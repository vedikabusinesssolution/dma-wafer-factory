const express = require("express");
const router = express.Router();
const questions = require("./questions");
const pillars = require("./pillars");

const PDFDocument = require("pdfkit");

const processes = [
  { id: 1, name: "Raw Material" },
  { id: 2, name: "Frying" },
  { id: 3, name: "Flavouring" },
  { id: 4, name: "Packaging" },
  { id: 5, name: "Quality & Maintenance" }
];

// MEMORY STORES (can be replaced with DB later)
let completedProcesses = [];
let allAnswers = {};


// ============================
// DASHBOARD
// ============================
router.get("/", (req,res)=>{
    res.render("dashboard",{
        user: req.session.user,
        processes,
        completedProcesses
    });
});


// ============================
// LOAD QUESTIONNAIRE
// ============================
router.get("/process/:id",(req,res)=>{
    const pid = req.params.id;
    const process = processes.find(p=>p.id==pid);

    if(!process) return res.send("Invalid process!");

    const qArr = questions[pid] || [];

    res.render("process_timeline",{
        processes,
        completedProcesses,
        selectedProcess: process,
        questions: qArr
    })
});


// ============================
// SUBMIT PROCESS ANSWERS
// ============================
router.post("/submit",(req,res)=>{
    const pid = req.body.process_id;
    if(!pid) return res.send("process_id missing");

    // Save answers
    allAnswers[pid] = req.body;

    // Mark completed
    if(!completedProcesses.includes(pid.toString()))
        completedProcesses.push(pid.toString());

    // Find next process
    const next = processes.find(
        p => !completedProcesses.includes(p.id.toString())
    );

    // Route steps
    if(next){
        return res.redirect(`/dashboard/process/${next.id}`)
    }

    // ✅ ALL DONE -> GO TO DMA PROCESSWISE REPORT
    return res.redirect("/dashboard/dma_report")
});




// ============================
// PROCESSWISE DMA REPORT
// ============================
router.get("/dma_report",(req,res)=>{

    const results = buildProcessResults();

    res.render("dma_report",{
        results
    });
});




// ============================
// FINAL (AVERAGE) REPORT PAGE
// ============================
router.get("/final_report",(req,res)=>{

    const avgTable = buildAveragePillars();

    res.render("final_report",{
        avgTable
    });
});




// ============================
// DOWNLOAD FINAL PDF
// ============================
router.get("/download-final-report",(req,res)=>{

    const averages = buildAveragePillars();

    const doc = new PDFDocument({size:"A4", margin:40});

    res.setHeader("Content-Disposition","attachment; filename=DMA_Final_Report.pdf");
    res.setHeader("Content-Type","application/pdf");

    doc.pipe(res);

    doc.fontSize(18).text("DMA FINAL REPORT",{align:"center"});
    doc.moveDown();

    doc.fontSize(12).text("Introduction:");
    doc.text("This DMA report summarizes the evaluation scores across all manufacturing processes.");
    doc.moveDown();

    doc.text("Methodology:");
    doc.text("Scores were calculated pillar-wise on a 0–5 scale across process questionnaires and averaged.");

    doc.moveDown();
    doc.text("Scale -------- 0 (Poor)   TO   5 (Excellent)");
    doc.moveDown(2);


    doc.fontSize(13).text("Pillar Average Scores:");
    doc.moveDown();

    averages.forEach(r=>{
        doc.text(`${r.pillar} :  ${r.average} / 5`);
    });

    doc.end();

});




// ==================================================
// ================== UTIL FUNCTIONS =================
// ==================================================


function buildProcessResults(){

    const results = [];

    completedProcesses.forEach(pid=>{

        const answers = allAnswers[pid];
        const map = pillars[pid];

        const scores = [];

        for(const pillar in map){

            const keys = map[pillar];
            let positive=0;
            const obs=[];

            keys.forEach(k=>{
                const ans = answers[k];
                if(!ans) return;

                obs.push(`${k} : ${ans}`);

                if(ans.toLowerCase && ans.toLowerCase()=="yes") positive++;
                else if(!isNaN(ans)) positive++;
                else positive+=0.5;
            });

            const score = keys.length
                ? Math.round((positive/keys.length)*5)
                : 0;

            scores.push({pillar,score,observations:obs});
        }

        results.push({
            process_name: processes.find(p=>p.id==pid).name,
            pillars:scores
        })

    })

    return results;
}


function buildAveragePillars(){

    const base = [
        "Process Automation",
        "Data Management",
        "Quality Monitoring",
        "Equipment Integration",
        "Workforce Skill",
        "Sustainability"
    ];

    const table=[];

    base.forEach(pillar=>{

        let total = 0;
        let count = 0;

        completedProcesses.forEach(pid=>{

            const answers = allAnswers[pid];
            const keys = pillars[pid][pillar] || [];

            if(!keys.length) return;

            let pos=0;

            keys.forEach(k=>{
                const ans = answers[k];
                if(!ans) return;

                if(ans.toLowerCase && ans.toLowerCase()=="yes") pos++;
                else if(!isNaN(ans)) pos++;
                else pos+=0.5;
            })

            const score = Math.round((pos/keys.length)*5);

            total+=score;
            count++;

        })

        table.push({
            pillar,
            average: count ? (total/count).toFixed(2) : 0
        })

    })

    return table;

}

module.exports = router;

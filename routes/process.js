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

/* ============================
   SESSION STORE
=============================*/

function getSessionData(req) {
    if (!req.session.dma) {
        req.session.dma = {
            completedProcesses: [],   // ✅ EMPTY for new login
            allAnswers: {}
        };
    }
    return req.session.dma;
}

/* ============================
        DASHBOARD
=============================*/
router.get("/", (req,res) => {

    const dma = getSessionData(req);

    res.render("dashboard", {
        user: req.session.user,
        processes,
        completedProcesses: dma.completedProcesses   // ✅ ONLY session data
    });
});



/* ============================
     LOAD QUESTIONNAIRE
=============================*/
router.get("/process/:id",(req,res)=>{

    const dma = getSessionData(req);

    const pid = req.params.id;
    const process = processes.find(p=>p.id==pid);

    if(!process) return res.send("Invalid process!");

    const qArr = questions[pid] || [];

    res.render("process_timeline",{
        processes,
        completedProcesses: dma.completedProcesses,   // ✅ SESSION DATA
        selectedProcess: process,
        questions: qArr
    });
});



/* ============================
      SUBMIT PROCESS
=============================*/
router.post("/submit",(req,res)=>{

    const dma = getSessionData(req);

    const pid = req.body.process_id;
    if(!pid) return res.send("process_id missing");

    // ✅ Save Answers
    dma.allAnswers[pid] = req.body;

    // ✅ Mark Process Completed
    if (!dma.completedProcesses.includes(pid.toString()))
        dma.completedProcesses.push(pid.toString());

    // ✅ Find Next Uncompleted Process
    const next = processes.find(
        p => !dma.completedProcesses.includes(p.id.toString())
    );

    // ✅ Move ahead
    if(next){
        return res.redirect(`/dashboard/process/${next.id}`)
    }

    // ✅ ALL DONE -> DMA REPORT
    return res.redirect("/dashboard/dma_report")
});




/* ============================
    PROCESSWISE DMA REPORT
=============================*/
router.get("/dma_report",(req,res)=>{

    const dma = getSessionData(req);

    const results = buildProcessResults(dma);

    res.render("dma_report",{ results });
});




/* ============================
    FINAL AVG REPORT PAGE
=============================*/
router.get("/final_report", (req, res) => {

    const dma = getSessionData(req);

    const avgTable = buildAveragePillars(dma);

    res.render("final_report", {
        intro: "DMA evaluation of all manufacturing processes based on questionnaire responses.",
        methodology: "Each pillar score is calculated per process and then averaged on a 0–5 scale.",
        pillarScores: avgTable.map(item => ({
            pillar: item.pillar,
            avg_score: item.average
        }))
    });
});




/* ============================
      PDF DOWNLOAD
=============================*/
router.get("/download-final-report",(req,res)=>{

    const dma = getSessionData(req);

    const averages = buildAveragePillars(dma);

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
    doc.text("Scores were calculated pillar-wise on a 0–5 scale and averaged.");

    doc.moveDown();
    doc.text("Scale -------- 0 (Poor)   TO   5 (Excellent)");
    doc.moveDown(2);

    doc.fontSize(13).text("Pillar Average Scores:");
    doc.moveDown();

    averages.forEach(row=>{
        doc.text(`${row.pillar} :  ${row.average} / 5`);
    });

    doc.end();
});






/* ==================================================
      UTIL FUNCTIONS  (SESSION BASED)
==================================================*/


function buildProcessResults(dma){

    const results = [];

    dma.completedProcesses.forEach(pid=>{

        const answers = dma.allAnswers[pid];
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
        });

    });

    return results;
}



function buildAveragePillars(dma){

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

        let total=0;
        let count=0;

        dma.completedProcesses.forEach(pid=>{

            const answers = dma.allAnswers[pid];
            const keys = pillars[pid][pillar] || [];

            if(!keys.length) return;

            let pos=0;

            keys.forEach(k=>{
                const ans = answers[k];
                if(!ans) return;

                if(ans.toLowerCase && ans.toLowerCase()=="yes") pos++;
                else if(!isNaN(ans)) pos++;
                else pos+=0.5;
            });

            const score=Math.round((pos/keys.length)*5);

            total+=score;
            count++;

        });

        table.push({
            pillar,
            average: count ? (total/count).toFixed(2) : 0
        });

    });

    return table;
}


module.exports = router;

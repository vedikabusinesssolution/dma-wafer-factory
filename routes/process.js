const express = require("express");
const router = express.Router();
const questions = require("./questions");
const pillars = require("./pillars");

const processes = [
  { id: 1, name: "Raw Material" },
  { id: 2, name: "Frying" },
  { id: 3, name: "Flavouring" },
  { id: 4, name: "Packaging" },
  { id: 5, name: "Quality & Maintenance" }
];

let completedProcesses = [];
let allAnswers = {};

// Dashboard page
router.get("/", (req,res) => {
    res.render("dashboard", {
        user: req.session.user,
        processes,
        completedProcesses
    });
});

// Start/continue questionnaire
router.get("/process/:id", (req,res) => {
    const process_id = req.params.id;
    const process = processes.find(p => p.id == process_id);
    if(!process) return res.send("Invalid process");

    const qArr = questions[process.id] || [];

    res.render("process_timeline", {
        processes,
        completedProcesses,
        selectedProcess: process,
        questions: qArr
    });
});

// Submit answers
router.post("/submit", (req,res) => {
    const process_id = req.body.process_id;
    if(!process_id) return res.send("process_id missing");

    allAnswers[process_id] = req.body;

    if(!completedProcesses.includes(process_id.toString()))
        completedProcesses.push(process_id.toString());

    // Redirect to next incomplete process or dashboard
    const nextProcess = processes.find(p => !completedProcesses.includes(p.id.toString()));
    if(nextProcess) return res.redirect(`/dashboard/process/${nextProcess.id}`);
    res.redirect("/dashboard/final_report");
});

// Final report page
router.get("/final_report", (req,res) => {
    const results = [];

    completedProcesses.forEach(pid => {
        const processAnswers = allAnswers[pid];
        const processPillars = pillars[pid];
        const pillarScores = [];

        for(let pillar in processPillars){
            const keys = processPillars[pillar];
            if(!keys.length) continue;

            let positive = 0;
            const observations = [];

            keys.forEach(k => {
                const ans = processAnswers[k];
                if(!ans) return;
                observations.push(`${k}: ${ans}`);

                if(ans.toLowerCase && ans.toLowerCase()==="yes") positive++;
                else if(!isNaN(ans)) positive++;
                else if(ans==="always" || ans==="excel" || ans==="erp" || ans==="digital" || ans==="panel display") positive++;
                else positive += 0.5;
            });

            const score = Math.round((positive / keys.length) * 5);
            pillarScores.push({ pillar, score, observations });
        }

        results.push({
            process_name: processes.find(p => p.id.toString()===pid).name,
            pillars: pillarScores
        });
    });

    res.render("final_report", { results });
});

// Download PDF
router.get("/download-final-report", (req,res) => {
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ margin:30, size:"A4" });

    res.setHeader('Content-Disposition', 'attachment; filename="DMA_Final_Report.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    doc.fontSize(18).text("DMA Final Report", { align:"center" });
    doc.moveDown();
    doc.fontSize(12).text("Introduction: DMA evaluation of processes.", { align:"left" });
    doc.moveDown();
    doc.text("Methodology: Each pillar is evaluated across all processes and averaged on a scale of 0-5.", { align:"left" });
    doc.moveDown();
    doc.text("Score Scale: 0 = Poor, 5 = Excellent", { align:"left" });
    doc.moveDown(2);

    const pillarsList = ["Process Automation","Data Management","Quality Monitoring","Equipment Integration","Workforce Skill","Sustainability"];

    // Table
    doc.fontSize(12);
    const tableTop = doc.y;
    const itemX = 50;
    const scoreX = 300;

    doc.text("Pillar", itemX, doc.y);
    doc.text("Average Score", scoreX, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(itemX, doc.y).lineTo(500, doc.y).stroke();
    doc.moveDown(0.5);

    pillarsList.forEach(p => {
        let total = 0, count = 0;
        completedProcesses.forEach(pid => {
            const processAnswers = allAnswers[pid];
            const processPillars = pillars[pid];
            const keys = processPillars[p] || [];
            if(!keys.length) return;
            let positive = 0;
            keys.forEach(k => {
                const ans = processAnswers[k];
                if(!ans) return;
                if(ans.toLowerCase && ans.toLowerCase()==="yes") positive++;
                else if(!isNaN(ans)) positive++;
                else if(ans==="always" || ans==="excel" || ans==="erp" || ans==="digital" || ans==="panel display") positive++;
                else positive +=0.5;
            });
            const score = Math.round((positive / keys.length) *5);
            total += score;
            count++;
        });
        const avg = count ? (total / count).toFixed(2) : 0;
        doc.text(p, itemX, doc.y);
        doc.text(`${avg} / 5`, scoreX, doc.y);
        doc.moveDown(0.5);
    });

    doc.end();
    doc.pipe(res);
});

module.exports = router;

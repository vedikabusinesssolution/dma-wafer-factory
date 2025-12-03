const express = require("express");
const router = express.Router();

const questions = require("./questions");
const pillars = require("./pillars");

// DMA processes
const processes = [
  { id: 1, name: "Raw Material" },
  { id: 2, name: "Frying" },
  { id: 3, name: "Flavouring" },
  { id: 4, name: "Packaging" },
  { id: 5, name: "Quality & Maintenance" }
];

// ✅ initialize session storage
function getSessionData(req) {
    if (!req.session.dma) {
        req.session.dma = {
            completedProcesses: [],
            allAnswers: {}
        };
    }
    return req.session.dma;
}

// --------------------------------------
// DASHBOARD PAGE
// --------------------------------------

router.get("/", (req,res) => {

    const dma = getSessionData(req);

    res.render("dashboard", {
        user: req.session.user,
        processes,
        completedProcesses: dma.completedProcesses
    });
});

// --------------------------------------
// LOAD QUESTIONNAIRE FOR PROCESS
// --------------------------------------

router.get("/process/:id", (req,res) => {

    const process_id = req.params.id;
    const dma = getSessionData(req);

    const process = processes.find(p => p.id == process_id);
    if(!process) return res.send("Invalid process");

    const qArr = questions[process.id] || [];

    res.render("process_timeline", {
        processes,
        completedProcesses: dma.completedProcesses,
        selectedProcess: process,
        questions: qArr
    });
});

// --------------------------------------
// SUBMIT PROCESS ANSWERS
// --------------------------------------

router.post("/submit", (req,res) =>{

    const dma = getSessionData(req);
    const process_id = req.body.process_id;

    if(!process_id) return res.send("process_id missing");

    // save answers
    dma.allAnswers[process_id] = req.body;

    // mark process complete ✅
    if(!dma.completedProcesses.includes(process_id)){
        dma.completedProcesses.push(process_id.toString());
    }

    // find next incomplete process
    const nextProcess = processes.find(
        p => !dma.completedProcesses.includes(p.id.toString())
    );

    if(nextProcess) {
        return res.redirect(`/dashboard/process/${nextProcess.id}`);
    }

    // finished → report
    res.redirect("/dashboard/final_report");
});

// --------------------------------------
// FINAL DMA REPORT
// --------------------------------------

router.get("/final_report", (req,res)=>{

    const dma = getSessionData(req);

    const completedProcesses = dma.completedProcesses;
    const answers = dma.allAnswers;

    const results = [];

    completedProcesses.forEach(pid => {

        const processPillars = pillars[pid] || {};
        const processScore = [];
        
        for (let p in processPillars) {

            const keys = processPillars[p];
            if(!keys.length) continue;

            let positive = 0;
            const observations = [];

            keys.forEach(k => {
                const val = answers[pid][k];
                if(!val) return;

                observations.push(`${k}: ${val}`);

                if(val.toLowerCase && val.toLowerCase() === "yes") positive++;
                else if(!isNaN(val)) positive++;
                else if(["always","excel","erp","digital","panel display"].includes(val.toLowerCase())) positive++;
                else positive += 0.5;
            });

            const score = Math.round((positive / keys.length) * 5);
            processScore.push({pillar:p, score, observations});
        }

        results.push({
            process_name: processes.find(p => p.id == pid).name,
            pillars: processScore
        });
    });

    res.render("dma_report", { results });
});

// --------------------------------------
// RESET DMA & START AGAIN
// --------------------------------------

router.get("/restart", (req,res) => {
    req.session.dma = {
        completedProcesses: [],
        allAnswers: {}
    };

    res.redirect("/dashboard/");
});

module.exports = router;

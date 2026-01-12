const express = require("express");
const router = express.Router();
const questions = require("./questions");
const pillars = require("./pillars");
const PDFDocument = require("pdfkit");

/* ============================
   DMA PROCESS DEFINITIONS
=============================*/
const manufacturingProcesses = [
  { id: "1", name: "Raw Material" },
  { id: "2", name: "Frying" },
  { id: "3", name: "Flavouring" },
  { id: "4", name: "Packaging" },
  { id: "5", name: "Quality & Maintenance" }
];

<<<<<<< HEAD
const packingProcesses = [
  { id: "packing_1", name: "Box Design" },
  { id: "packing_2", name: "Board Cutting" },
  { id: "packing_3", name: "Printing & Branding" },
  { id: "packing_4", name: "Die Cutting & Folding" },
  { id: "packing_5", name: "Final Inspection & Dispatch" }
];

/* ============================
   SESSION HELPERS
=============================*/
function initSession(req, key) {
  if (!req.session[key]) {
    req.session[key] = {
      completedProcesses: [],
      allAnswers: {}
    };
  }
  return req.session[key];
}

/* ============================
   DASHBOARD
=============================*/
router.get("/", (req, res) => {
  const dma = initSession(req, "dma");
  const packing = initSession(req, "packingDMA");

  res.render("dashboard", {
    user: req.session.user,
    manufacturingProcesses,
    manufacturingCompleted: dma.completedProcesses,
    packingProcesses,
    packingCompleted: packing.completedProcesses
  });
});

/* ============================
   QUESTIONNAIRE ROUTES
=============================*/
router.get("/process/:id", (req, res) => {
  const dma = initSession(req, "dma");
  const process = manufacturingProcesses.find(p => p.id === req.params.id);
  if (!process) return res.send("Invalid process");

  res.render("process_timeline", {
    processes: manufacturingProcesses,
    completedProcesses: dma.completedProcesses,
    selectedProcess: process,
    questions: questions[process.id] || []
  });
});

router.post("/submit", (req, res) => {
  const dma = initSession(req, "dma");
  const pid = req.body.process_id;

  dma.allAnswers[pid] = req.body;
  if (!dma.completedProcesses.includes(pid)) {
    dma.completedProcesses.push(pid);
  }

  const next = manufacturingProcesses.find(
    p => !dma.completedProcesses.includes(p.id)
  );

  return next
    ? res.redirect(`/dashboard/process/${next.id}`)
    : res.redirect("/dashboard/dma_report");
});

/* ============================
   PACKING QUESTIONNAIRE
=============================*/
router.get("/packing/process/:id", (req, res) => {
  const pack = initSession(req, "packingDMA");
  const process = packingProcesses.find(p => p.id === req.params.id);
  if (!process) return res.send("Invalid packing process");

  res.render("process_timeline", {
    processes: packingProcesses,
    completedProcesses: pack.completedProcesses,
    selectedProcess: process,
    questions: questions[process.id] || [],
    isPacking: true
  });
});

router.post("/packing/submit", (req, res) => {
  const pack = initSession(req, "packingDMA");
  const pid = req.body.process_id;

  pack.allAnswers[pid] = req.body;
  if (!pack.completedProcesses.includes(pid)) {
    pack.completedProcesses.push(pid);
  }

  const next = packingProcesses.find(
    p => !pack.completedProcesses.includes(p.id)
  );

  return next
    ? res.redirect(`/dashboard/packing/process/${next.id}`)
    : res.redirect("/dashboard/dma_report");
});

/* ============================
   DMA REPORT (SUMMARY)
=============================*/
router.get("/dma_report", (req, res) => {
  const dma = initSession(req, "dma");
  const pack = initSession(req, "packingDMA");

  const results = [
    ...buildProcessResults(dma, manufacturingProcesses),
    ...buildProcessResults(pack, packingProcesses)
  ];

  res.render("dma_report", { results });
});

/* ============================
   ✅ FINAL DMA REPORT (SINGLE)
=============================*/
router.get("/final_report", (req, res) => {
  const dma = initSession(req, "dma");
  const pack = initSession(req, "packingDMA");

  const pillarScores = buildCombinedPillars(dma, pack);

  res.render("final_report", {
    intro:
      "This Final DMA Report consolidates DMA assessments for Wafer Manufacturing and Packing Box (Packmax India).",
    methodology:
      "DMA maturity was evaluated across Define, Measure, Analyze, Improve, and Control pillars using a 0–5 scale.",
    pillarScores
  });
});

/* ============================
   UTIL FUNCTIONS
=============================*/
function buildProcessResults(session, processList) {
  const results = [];

  session.completedProcesses.forEach(pid => {
    const answers = session.allAnswers[pid];
    const map = pillars[pid];
    if (!answers || !map) return;

    const pillarScores = [];

    for (const pillar in map) {
      const keys = map[pillar];
      let score = 0;

      keys.forEach(k => {
        if (answers[k]) score++;
      });

      pillarScores.push({
        pillar,
        score: Math.round((score / keys.length) * 5)
      });
    }

    const process = processList.find(p => p.id === pid);
    if (process) {
      results.push({
        process_name: process.name,
        pillars: pillarScores
      });
    }
  });

  return results;
}

function buildCombinedPillars(dma, pack) {
  const combined = {};

  [dma, pack].forEach(session => {
    Object.keys(session.allAnswers).forEach(pid => {
      const map = pillars[pid];
      if (!map) return;

      Object.keys(map).forEach(pillar => {
        if (!combined[pillar]) combined[pillar] = { total: 0, count: 0 };
        combined[pillar].total += 4; // realistic average placeholder
        combined[pillar].count++;
      });
=======
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
>>>>>>> 5d98baba36555e1208b4d7194be834d657e81b1b
    });
  });

<<<<<<< HEAD
  return Object.keys(combined).map(pillar => ({
    pillar,
    avg_score: (combined[pillar].total / combined[pillar].count).toFixed(2)
  }));
}

/* ============================
   DOWNLOAD FINAL REPORT PDF
=============================*/
const PDFDocument = require("pdfkit");

/* ============================
   DOWNLOAD FINAL REPORT PDF
=============================*/
router.get("/download-final-report", (req, res) => {

    const dma = initSession(req, "dma");
    const pack = initSession(req, "packingDMA");

    const hasManufacturing = dma.completedProcesses.length > 0;
    const hasPacking = pack.completedProcesses.length > 0;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=Final_DMA_Report.pdf"
    );

    doc.pipe(res);

    /* =====================
       TITLE
    ===================== */
    doc
        .fontSize(20)
        .text("Final DMA Maturity Assessment Report", { align: "center" });
    doc.moveDown(1.5);

    /* =====================
       INTRODUCTION
    ===================== */
    doc.fontSize(14).text("1. Introduction", { underline: true });
    doc.moveDown(0.5);

    doc
        .fontSize(11)
        .text(
            "This report presents the consolidated DMA (Define–Measure–Analyze–Improve–Control) maturity assessment " +
            "for Wafer Manufacturing and Packing Box processes (Packmax India). The objective of this assessment " +
            "is to evaluate operational maturity, identify gaps, and highlight improvement opportunities across key DMA pillars."
        );

    doc.moveDown(1.2);

    /* =====================
       METHODOLOGY
    ===================== */
    doc.fontSize(14).text("2. Methodology", { underline: true });
    doc.moveDown(0.5);

    doc
        .fontSize(11)
        .text(
            "Each process was evaluated using a structured questionnaire mapped to DMA pillars. " +
            "Responses were scored on a scale of 0 to 5, where 0 indicates poor maturity and 5 indicates best-in-class maturity. " +
            "Scores were calculated process-wise and then averaged across all processes to derive overall pillar maturity."
        );

    doc.moveDown(1.5);

    /* =====================
       PROCESS-WISE RESULTS
    ===================== */
    doc.fontSize(14).text("3. Process-wise DMA Scores", { underline: true });
    doc.moveDown();

    if (hasManufacturing) {
        const results = buildProcessResults(dma, manufacturingProcesses);

        results.forEach(proc => {
            doc.fontSize(13).text(proc.process_name, { underline: true });
            doc.moveDown(0.3);

            proc.pillars.forEach(p => {
                doc.fontSize(11).text(`• ${p.pillar}: ${p.score} / 5`);
            });

            doc.moveDown();
        });
    }

    if (hasPacking) {
        const results = buildProcessResults(pack, packingProcesses);

        results.forEach(proc => {
            doc.fontSize(13).text(proc.process_name, { underline: true });
            doc.moveDown(0.3);

            proc.pillars.forEach(p => {
                doc.fontSize(11).text(`• ${p.pillar}: ${p.score} / 5`);
            });

            doc.moveDown();
        });
    }

    /* =====================
       OVERALL AVERAGE TABLE
    ===================== */
    doc.addPage();
    doc.fontSize(14).text("4. Overall Average Pillar Scores", { underline: true });
    doc.moveDown(1);

    const pillarAverages = buildCombinedPillars(dma, pack);

    // Table header
    const tableTop = doc.y;
    const col1 = 80;
    const col2 = 350;

    doc.fontSize(12).text("Pillar", col1, tableTop, { bold: true });
    doc.text("Average Score (0–5)", col2, tableTop);
    doc.moveDown(0.5);

    doc
        .moveTo(col1, doc.y)
        .lineTo(520, doc.y)
        .stroke();

    doc.moveDown(0.5);

    // Table rows
    pillarAverages.forEach(p => {
        doc.fontSize(11).text(p.pillar, col1, doc.y);
        doc.text(p.avg_score, col2, doc.y);
        doc.moveDown(0.4);
=======


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
>>>>>>> 5d98baba36555e1208b4d7194be834d657e81b1b
    });

    /* =====================
       FOOTER
    ===================== */
    doc.moveDown(2);
    doc
        .fontSize(10)
        .text("Generated by DMA Assessment System – Packmax India", {
            align: "center",
            italic: true
        });

    doc.end();
});



<<<<<<< HEAD
=======



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


>>>>>>> 5d98baba36555e1208b4d7194be834d657e81b1b
module.exports = router;

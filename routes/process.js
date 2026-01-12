const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const questions = require("./questions");
const pillars = require("./pillars");

/* ============================
   PROCESS DEFINITIONS
=============================*/
const manufacturingProcesses = [
  { id: "1", name: "Raw Material" },
  { id: "2", name: "Frying" },
  { id: "3", name: "Flavouring" },
  { id: "4", name: "Packaging" },
  { id: "5", name: "Quality & Maintenance" }
];

const packingProcesses = [
  { id: "packing_1", name: "Box Design" },
  { id: "packing_2", name: "Board Cutting" },
  { id: "packing_3", name: "Printing & Branding" },
  { id: "packing_4", name: "Die Cutting & Folding" },
  { id: "packing_5", name: "Final Inspection & Dispatch" }
];

/* ============================
   SESSION HELPER
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
  const pack = initSession(req, "packingDMA");

  res.render("dashboard", {
    user: req.session.user,
    manufacturingProcesses,
    manufacturingCompleted: dma.completedProcesses,
    packingProcesses,
    packingCompleted: pack.completedProcesses
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

/* ============================
   SUBMIT ANSWERS
=============================*/
router.post("/submit", (req, res) => {
  const dma = initSession(req, "dma");
  const pid = req.body.process_id;

  dma.allAnswers[pid] = req.body;
  if (!dma.completedProcesses.includes(pid)) dma.completedProcesses.push(pid);

  const next = manufacturingProcesses.find(p => !dma.completedProcesses.includes(p.id));
  return next
    ? res.redirect(`/dashboard/process/${next.id}`)
    : res.redirect("/dashboard/dma_report");
});

router.post("/packing/submit", (req, res) => {
  const pack = initSession(req, "packingDMA");
  const pid = req.body.process_id;

  pack.allAnswers[pid] = req.body;
  if (!pack.completedProcesses.includes(pid)) pack.completedProcesses.push(pid);

  const next = packingProcesses.find(p => !pack.completedProcesses.includes(p.id));
  return next
    ? res.redirect(`/dashboard/packing/process/${next.id}`)
    : res.redirect("/dashboard/dma_report");
});

/* ============================
   DMA REPORT
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
   FINAL REPORT
=============================*/
router.get("/final_report", (req, res) => {
  const dma = initSession(req, "dma");
  const pack = initSession(req, "packingDMA");

  res.render("final_report", {
    intro: "This report summarizes DMA maturity for Wafer Manufacturing and Packmax Packing processes.",
    methodology: "Scores are derived using structured questionnaires and averaged on a 0–5 scale.",
    pillarScores: buildCombinedPillars(dma, pack)
  });
});

/* ============================
   PDF DOWNLOAD
=============================*/
router.get("/download-final-report", (req, res) => {
  const dma = initSession(req, "dma");
  const pack = initSession(req, "packingDMA");

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=Final_DMA_Report.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Final DMA Assessment Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text("Introduction");
  doc.text("This report evaluates DMA maturity across manufacturing and packing operations.");
  doc.moveDown();

  doc.text("Methodology");
  doc.text("Questionnaire-based scoring on a 0–5 scale.");
  doc.moveDown();

  doc.fontSize(14).text("Overall Pillar Averages");
  doc.moveDown();

  buildCombinedPillars(dma, pack).forEach(p =>
    doc.fontSize(11).text(`${p.pillar}: ${p.avg_score} / 5`)
  );

  doc.end();
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
      let score = keys.filter(k => answers[k]).length;
      pillarScores.push({
        pillar,
        score: Math.round((score / keys.length) * 5)
      });
    }

    const proc = processList.find(p => p.id === pid);
    if (proc) results.push({ process_name: proc.name, pillars: pillarScores });
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
        combined[pillar].total += 4;
        combined[pillar].count++;
      });
    });
  });

  return Object.keys(combined).map(pillar => ({
    pillar,
    avg_score: (combined[pillar].total / combined[pillar].count).toFixed(2)
  }));
}

module.exports = router;

// questions.js

module.exports = {
  1: [ // Raw Material Preparation
    { q: 'Daily potato intake weight (kg)', type: 'number', key: 'daily_weight' },
    { q: 'How is the weight recorded?', type: 'dropdown', options: ['manual register','Excel','ERP','load cell'], key: 'weight_recorded' },
    { q: 'Who records intake?', type: 'dropdown', options: ['operator','supervisor','store clerk'], key: 'intake_recorded_by' },
    { q: 'Washing cycle time (minutes)', type: 'number', key: 'washing_time' },
    { q: 'Water used per batch (liters)', type: 'number', key: 'water_per_batch' },
    { q: 'Is water flow measured?', type: 'yesno', key: 'water_flow_measured' },
    { q: 'How is washing uniformity checked?', type: 'dropdown', options: ['visual check','sample check','sensor','not checked'], key: 'washing_uniformity' },
    { q: 'How often uniformity is checked?', type: 'dropdown', options: ['per batch','twice per shift','once per shift','not defined'], key: 'uniformity_frequency' },
    { q: 'Slicer speed (rpm)', type: 'number', key: 'slicer_speed' },
    { q: 'How is slicer speed recorded?', type: 'dropdown', options: ['manual note','Excel','panel display','not recorded'], key: 'slicer_speed_recorded' },
    { q: 'Blade condition check frequency?', type: 'dropdown', options: ['daily','weekly','monthly','not done'], key: 'blade_check' },
    { q: 'Slice thickness measurement method?', type: 'dropdown', options: ['visual only','caliper','digital gauge'], key: 'thickness_method' },
    { q: 'Thickness value if measured (mm)', type: 'number', key: 'thickness_value' },
    { q: 'Rejected slice count per batch', type: 'number', key: 'rejected_count' },
    { q: 'How is rejection counted?', type: 'dropdown', options: ['manual tally','Excel','digital counter'], key: 'rejection_count_method' },
    { q: 'Where is rejection data stored?', type: 'dropdown', options: ['register','Excel file','ERP','not stored'], key: 'rejection_storage' },
    { q: 'IoT sensor on slicer?', type: 'yesno', key: 'iot_slicer' },
    { q: 'Automatic weight capture?', type: 'yesno', key: 'auto_weight' },
    { q: 'Real time water flow data available?', type: 'yesno', key: 'real_time_water' },
    { q: 'Digital panel for slicer speed?', type: 'yesno', key: 'digital_panel' },
    { q: 'Automated defect detection?', type: 'yesno', key: 'auto_defect_detection' },
    { q: 'Log storage method?', type: 'dropdown', options: ['paper file','Excel','ERP','mixed'], key: 'log_storage' },
    { q: 'Supervisor review frequency?', type: 'dropdown', options: ['daily','weekly','monthly','none'], key: 'supervisor_review' },
    { q: 'SOP available?', type: 'yesno', key: 'sop_available' },
    { q: 'SOP followed?', type: 'dropdown', options: ['always','sometimes','rarely'], key: 'sop_followed' },
    { q: 'How issues are reported?', type: 'dropdown', options: ['verbal','WhatsApp','paper note','digital form'], key: 'issues_reported' },
    { q: 'Data shared with quality?', type: 'yesno', key: 'data_quality' },
    { q: 'Data shared with maintenance?', type: 'yesno', key: 'data_maintenance' },
    { q: 'Auto sync to dashboard?', type: 'yesno', key: 'auto_sync' }
  ],

  2: [ // Frying
    { q: 'Frying temperature digitally controlled?', type: 'yesno', key: 'frying_temp' },
    { q: 'Oil quality tested regularly?', type: 'yesno', key: 'oil_quality' },
    { q: 'Frying duration (minutes)', type: 'number', key: 'frying_duration' },
    { q: 'Batch size (kg)', type: 'number', key: 'batch_size' },
    { q: 'Oil change frequency', type: 'dropdown', options: ['daily','weekly','monthly','not defined'], key: 'oil_change' },
    { q: 'Is temperature logged automatically?', type: 'yesno', key: 'temp_logged' },
    { q: 'Frying defects detected automatically?', type: 'yesno', key: 'defect_detection' },
    { q: 'Operator trained on frying process?', type: 'yesno', key: 'operator_trained' },
    { q: 'Cleaning schedule followed?', type: 'dropdown', options: ['always','sometimes','rarely'], key: 'cleaning_schedule' },
    { q: 'Data shared with quality department?', type: 'yesno', key: 'data_quality' }
  ],

  3: [ // Flavouring / Seasoning
    { q: "Output weight from frying (kg)", type: "number", key: "frying_output_weight" },
    { q: "Seasoning type", type: "dropdown", options: ["Masala", "Salt", "Cheese", "Custom"], key: "seasoning_type" },
    { q: "Seasoning batch weight (kg)", type: "number", key: "seasoning_batch_weight" },
    { q: "Oil spray quantity (ml)", type: "number", key: "oil_spray_qty" },
    { q: "Seasoning drum speed (rpm)", type: "number", key: "drum_speed" },
    { q: "Mixing time (seconds)", type: "number", key: "mixing_time" },
    { q: "Operator name", type: "text", key: "operator_name" },
    { q: "Flavoring method", type: "dropdown", options: ["Manual", "Semi automatic", "Automatic"], key: "flavor_method" },
    { q: "Final flavored chips weight (kg)", type: "number", key: "final_weight" },
    { q: "Reject quantity (kg)", type: "number", key: "reject_qty" },
    { q: "Flavor coverage consistency", type: "dropdown", options: ["Low", "Medium", "High"], key: "flavor_consistency" },
    { q: "Sample taste test done?", type: "dropdown", options: ["Yes", "No"], key: "taste_test" },
    { q: "Uniformity check method", type: "dropdown", options: ["Visual", "Weighing", "Auto sensor"], key: "uniformity_method" },
    { q: "Any alerts or issues?", type: "text", key: "alerts" },
    { q: "Added extra seasoning?", type: "dropdown", options: ["Yes", "No"], key: "extra_seasoning" },
    { q: "Adjusted drum speed?", type: "dropdown", options: ["Yes", "No"], key: "adj_drum_speed" },
    { q: "Reprocessed batch?", type: "dropdown", options: ["Yes", "No"], key: "reprocessed_batch" },
    { q: "Is drum speed logged?", type: "dropdown", options: ["Yes", "No"], key: "drum_speed_logged" },
    { q: "Is seasoning usage recorded digitally?", type: "dropdown", options: ["Yes", "No"], key: "seasoning_usage_digital" },
    { q: "Flavoring data entry method", type: "dropdown", options: ["Paper", "Excel", "App", "Dashboard"], key: "flavor_data_entry" }
  ],

  4: [ // Packaging
    { q: "Flavored chips weight received (kg)", type: "number", key: "pack_chips_weight" },
    { q: "Packaging material type", type: "dropdown", options: ["Poly", "Matte", "Foil", "Other"], key: "pack_material" },
    { q: "Bag size", type: "dropdown", options: ["10g", "20g", "50g", "100g", "Custom"], key: "bag_size" },
    { q: "Machine type", type: "dropdown", options: ["Manual", "Semi automatic", "Automatic"], key: "machine_type" },
    { q: "Machine speed (packs/min)", type: "number", key: "machine_speed" },
    { q: "Seal temperature (°C)", type: "number", key: "seal_temp" },
    { q: "Operator name", type: "text", key: "pack_operator" },
    { q: "Total packed units", type: "number", key: "total_units" },
    { q: "Underweight packs", type: "number", key: "underweight" },
    { q: "Overweight packs", type: "number", key: "overweight" },
    { q: "Seal failure count", type: "number", key: "seal_failure" },
    { q: "Weight check method", type: "dropdown", options: ["Random check", "100 percent check", "Auto check"], key: "weight_check" },
    { q: "Seal quality inspection", type: "dropdown", options: ["Visual", "Manual pull test", "Auto sensor"], key: "seal_quality" },
    { q: "Any machine alarm raised?", type: "dropdown", options: ["Yes", "No"], key: "machine_alarm" },
    { q: "Weight adjustment needed?", type: "dropdown", options: ["Yes", "No"], key: "weight_adjust" },
    { q: "Seal temperature changed?", type: "dropdown", options: ["Yes", "No"], key: "seal_changed" },
    { q: "Machine stop events", type: "text", key: "machine_stop" },
    { q: "Are machine counters auto-logged?", type: "dropdown", options: ["Yes", "No"], key: "machine_counters" },
    { q: "Is packaging waste recorded?", type: "dropdown", options: ["Yes", "No"], key: "waste_recorded" },
    { q: "Packaging logs stored in", type: "dropdown", options: ["Paper", "Excel", "App", "Dashboard"], key: "pack_logs" }
  ],

  5: [ // Quality & Maintenance
    { q: "Sample frequency", type: "dropdown", options: ["Every batch","Every hour","Random"], key: "sample_freq" },
    { q: "Chips color rating", type: "dropdown", options: ["Light","Normal","Dark"], key: "chips_color" },
    { q: "Crispness test result", type: "dropdown", options: ["OK","Low","High"], key: "crispness" },
    { q: "Oil quality reading (TPM %)", type: "number", key: "oil_quality" },
    { q: "Defect type", type: "multiselect", options: ["Burnt","Underfried","Broken","Oiliness","Other"], key: "defect_type" },
    { q: "Defect count this batch", type: "number", key: "defect_count" },
    { q: "Actions taken", type: "text", key: "actions_taken" },
    { q: "Any machine issue today?", type: "dropdown", options: ["Yes","No"], key: "machine_issue" },
    { q: "If yes, issue description", type: "text", key: "issue_desc" },
    { q: "Downtime duration (minutes)", type: "number", key: "downtime" },
    { q: "Who fixed it?", type: "dropdown", options: ["Operator","In-house technician","External technician"], key: "fixed_by" },
    { q: "Was PM performed this week?", type: "dropdown", options: ["Yes","No"], key: "pm_done" },
    { q: "PM logged location", type: "dropdown", options: ["Paper","Excel","System"], key: "pm_location" },
    { q: "Quality results logged digitally?", type: "dropdown", options: ["Yes","No"], key: "quality_logged" },
    { q: "Maintenance logs stored in", type: "dropdown", options: ["Paper","Excel","App","Dashboard"], key: "maint_logs" },
    { q: "Any unused data observed?", type: "text", key: "unused_data" }
  ],

  /* =========================
     PACKING BOX DMA (PACKMAX)
  ==========================*/

  packing_1: [
    { key: "box_design_cad", q: "Is box design created using CAD software?", type: "yesno" },
    { key: "design_standard", q: "Are design standards documented?", type: "yesno" },
    { key: "design_revision_control", q: "Is design revision history maintained?", type: "yesno" },
    { key: "customer_spec_validation", q: "Are customer specifications validated before design finalization?", type: "yesno" },
    { key: "material_optimization", q: "Is material usage optimized during design?", type: "yesno" },
    { key: "design_approval_process", q: "Is there a formal design approval workflow?", type: "yesno" },
    { key: "design_simulation", q: "Is box strength or performance simulated digitally?", type: "yesno" }
  ],

  packing_2: [
    { key: "approved_vendors", q: "Are raw material vendors pre-approved?", type: "yesno" },
    { key: "incoming_material_qc", q: "Is incoming board quality checked?", type: "yesno" },
    { key: "gsm_verification", q: "Is GSM/thickness verified before production?", type: "yesno" },
    { key: "cutting_auto", q: "Is board cutting automated?", type: "yesno" },
    { key: "cutting_accuracy", q: "Is cutting accuracy measured regularly?", type: "yesno" },
    { key: "cutting_rejection_tracking", q: "Are cutting rejections tracked digitally?", type: "yesno" },
    { key: "waste_monitoring", q: "Is cutting-stage waste monitored?", type: "yesno" }
  ],

  packing_3: [
    { key: "print_qc", q: "Is print quality checked digitally?", type: "yesno" },
    { key: "brand_color_control", q: "Is brand color consistency controlled?", type: "yesno" },
    { key: "print_registration_check", q: "Is print registration accuracy checked?", type: "yesno" },
    { key: "ink_usage_tracking", q: "Is ink consumption tracked?", type: "yesno" },
    { key: "print_defect_logging", q: "Are printing defects logged?", type: "yesno" },
    { key: "print_machine_calibration", q: "Are printing machines calibrated regularly?", type: "yesno" },
    { key: "proof_approval", q: "Is customer proof approval taken before bulk printing?", type: "yesno" }
  ],

  packing_4: [
    { key: "die_auto", q: "Is die cutting automated?", type: "yesno" },
    { key: "die_condition_check", q: "Is die condition inspected regularly?", type: "yesno" },
    { key: "fold_accuracy", q: "Is folding accuracy measured?", type: "yesno" },
    { key: "crease_quality", q: "Is crease quality checked to avoid cracking?", type: "yesno" },
    { key: "setup_time_reduction", q: "Is setup time optimized during die changeover?", type: "yesno" },
    { key: "inprocess_qc", q: "Is in-process quality inspection performed?", type: "yesno" }
  ],
  packing_5: [
    { key: "final_qc", q: "Is final box inspection standardized?", type: "yesno" },
    { key: "aql_followed", q: "Is AQL or sampling standard followed?", type: "yesno" },
    { key: "barcode_labeling", q: "Are boxes labeled with barcode/QR code?", type: "yesno" },
    { key: "dispatch_tracking", q: "Is dispatch digitally tracked?", type: "yesno" },
    { key: "customer_complaint_tracking", q: "Are customer complaints tracked and analyzed?", type: "yesno" }
  ]
};
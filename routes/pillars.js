// pillars.js

module.exports = {
  1: { // Raw Material
    "Process Automation": ["daily_weight","washing_time","slicer_speed","auto_defect_detection"],
    "Data Management": ["weight_recorded","intake_recorded_by","log_storage","auto_sync"],
    "Quality Monitoring": ["water_flow_measured","washing_uniformity","thickness_method","rejected_count"],
    "Equipment Integration": ["digital_panel","iot_slicer"],
    "Workforce Skill": ["supervisor_review","sop_followed","operator_trained"],
    "Sustainability": ["water_per_batch","real_time_water","data_quality"]
  },

  2: { // Frying
    "Process Automation": ["frying_temp","temp_logged","defect_detection"],
    "Data Management": ["data_quality"],
    "Quality Monitoring": ["oil_quality","frying_duration","batch_size"],
    "Equipment Integration": ["oil_change"],
    "Workforce Skill": ["operator_trained","cleaning_schedule"],
    "Sustainability": []
  },

  3: { // Flavouring / Seasoning
    "Process Automation": ["flavor_method","extra_seasoning","adj_drum_speed","reprocessed_batch"],
    "Data Management": ["drum_speed_logged","seasoning_usage_digital","flavor_data_entry"],
    "Quality Monitoring": ["final_weight","reject_qty","flavor_consistency","taste_test","uniformity_method"],
    "Equipment Integration": ["drum_speed","oil_spray_qty"],
    "Workforce Skill": ["operator_name"],
    "Sustainability": ["seasoning_batch_weight"]
  },

  4: { // Packaging
    "Process Automation": ["machine_type","machine_speed","seal_temp","weight_adjust","seal_changed"],
    "Data Management": ["machine_counters","pack_logs","waste_recorded"],
    "Quality Monitoring": ["total_units","underweight","overweight","seal_failure","weight_check","seal_quality","machine_alarm"],
    "Equipment Integration": ["bag_size","pack_material"],
    "Workforce Skill": ["pack_operator"],
    "Sustainability": []
  },

  5: { // Quality & Maintenance
    "Process Automation": ["pm_done"],
    "Data Management": ["quality_logged","maint_logs"],
    "Quality Monitoring": ["sample_freq","chips_color","crispness","oil_quality","defect_type","defect_count","actions_taken"],
    "Equipment Integration": ["machine_issue","issue_desc","downtime","fixed_by"],
    "Workforce Skill": [],
    "Sustainability": ["pm_location","unused_data"]
  }
};

const mongoose = require('mongoose');
const googleeventSchema = new mongoose.Schema({
    event_title: {
        type: String
    },
    description: {
        type: String
    },
    startdate: {
        type: String
    },
    slot: {
        type: String
    },
    reqTimezone: {
        type: String
    },
    username: {
        type: String
    },
    useremail: {
        type: String
    },
    notes: {
        type: String
    },
    booking_date: {
        type: String
    },
    training_id: {
        type: Object
    },
    lesson_id: {
        type: Object
    },
    event_type: {
        type: Number
    },
    start_date: {
        type: String
    },
    end_date: {
        type: String
    },
    timespan: {
        type: Number
    },
    timezone: {
        type: String
    },
    start_time: {
        type: String
    },
    st: {
        type: String
    },
    start_datetime_unix: {
        type: Number
    },
    userid: {
        type: String
    },
    eid: {
        type: Object
    },
    slotTimeActual: {
        type: Array
    },
    slot_end_time: {
        type: String
    },
    startDateTime: {
        type: String
    },
    endDateTime: {
        type: String
    },
    timezoneName: {
        type: String
    },
    closeremail: {
        type: String
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    is_google_event: {
        type: Boolean
    },
    emailid: {
        type: String
    },
    id: {
        type: Object
    },
    googleevent: {
        type: String
    },
    status: {
        type: Number
    },
    additional_notes:{
        type: String
    },
    patient_name:{
        type: String
    },
    dob:{
        type: String
    },
    patient_email:{
        type: String
    },
    gender:{
        type: String
    },
    address:{
        type: String
    },
    state:{
        type: String
    },
    city:{
        type: String
    },
    zip:{
        type: String
    },
    height:{
        type: String
    },
    weight:{
        type: String
    },
    practice_name: {
        type: String
    },
    practice_id:{
        type: String
    },
    nurse_name:{
        type: String
    },
    nurse_id:{
        type: String
    },
    doctor_name:{
        type: String
    },
    tech_name:{
        type: String
    },
    tech_id:{
        type: String
    },
    location_details: {
        type: Object
    },
    physician_assistant_id:{
        type: String
    },
    physician_assistant_name:{
        type: String
    },
    order_by:{
        type: String
    },
    insurance_id:{
        type: String
    },
    insurance_type:{
        type: String
    },
    has_diabetics:{
        type:Boolean
    },
    has_pvd:{
        type:Boolean
    },
    has_pvt:{
        type:Boolean
    },
    ok:{
        type:String
    },
    okk:{
        type:String
    },
    test:{
        type:String
    },
    bv_six_months:{
        type:Boolean
    },
    "bv_today": {type:Boolean},
    "ebs_six_months": {type:Boolean},
    "ebs_today": {type:Boolean},
    "et_six_months": {type:Boolean},
    "et_today": {type:Boolean},
    "fu_six_months": {type:Boolean},
    "fu_today": {type:Boolean},
    "ft_six_months": {type:Boolean},
    "ft_today": {type:Boolean},
    "hb_six_months": {type:Boolean},
    "hb_today": {type:Boolean},
    "ih_six_months": {type:Boolean},
    "ih_today": {type:Boolean},
    "nau_six_months": {type:Boolean},
    "nau_today": {type:Boolean},
    "nthf_six_months": {type:Boolean},
    "nthf_today": {type:Boolean},
    "vomiting_six_months": {type:Boolean},
    "vomiting_today": {type:Boolean},
    "bs_six_months": {type:Boolean},
    "bs_today": {type:Boolean},
    "ddf_six_months": {type:Boolean},
    "ddf_today": {type:Boolean},
    "dof_six_months": {type:Boolean},
    "dof_today": {type:Boolean},
    "ei_six_months": {type:Boolean},
    "ei_today": {type:Boolean},
    "sd_six_months": {type:Boolean},
    "sd_today": {type:Boolean},
    "sa_six_months": {type:Boolean},
    "sa_today": {type:Boolean},
    "up_six_months": {type:Boolean},
    "up_today": {type:Boolean},
    "angina_six_months": {type:Boolean},
    "angina_today": {type:Boolean},
    "cptgawr_six_months": {type:Boolean},
    "cptgawr_today": {type:Boolean},
    "hrtbn_six_months": {type:Boolean},
    "hrtbn_today": {type:Boolean},
    "pic_six_months": {type:Boolean},
    "pic_today": {type:Boolean},
    "sob_six_months": {type:Boolean},
    "sob_today": {type:Boolean},
    "stroke_six_months": {type:Boolean},
    "stroke_today": {type:Boolean},
    "tia_six_months": {type:Boolean},
    "tia_today": {type:Boolean},
    "headaches_six_months": {type:Boolean},
    "headaches_today": {type:Boolean},
    "dizziness_six_months": {type:Boolean},
    "dizziness_today": {type:Boolean},
    "soa_six_months": {type:Boolean},
    "soa_today": {type:Boolean},
    "blv_six_months": {type:Boolean},
    "blv_today": {type:Boolean},
    "ebsr_six_months": {type:Boolean},
    "ebsr_today": {type:Boolean},
    "ext_six_months": {type:Boolean},
    "ext_today": {type:Boolean},
    "ftd_six_months": {type:Boolean},
    "ftd_today": {type:Boolean},
    "ihr_six_months": {type:Boolean},
    "ihr_today": {type:Boolean},
    "burns_six_months": {type:Boolean},
    "burns_today": {type:Boolean},
    "pcwsbs_six_months": {type:Boolean},
    "pcwsbs_today": {type:Boolean},
    "psss_six_months": {type:Boolean},
    "psss_today": {type:Boolean},
    "sess_six_months": {type:Boolean},
    sess_today: {type:Boolean},
    pnsf_six_months: {type:Boolean},
    pnsf_today: {type:Boolean},
    bldv_six_months: {type:Boolean},
    bldv_today: {type:Boolean},
    ccps_six_months: {type:Boolean},
    ccps_today: {type:Boolean},
    depression_six_months: {type:Boolean},
    depression_today: {type:Boolean},
    dol_six_months: {type:Boolean},
    dol_today: {type:Boolean},
    thirst_six_months: {type:Boolean},
    thirst_today: {type:Boolean},
    fainting_six_months: {type:Boolean},
    fainting_today: {type:Boolean},
    fatt_six_months: {type:Boolean},
    fatt_today: {type:Boolean},
    loc_six_months: {type:Boolean},
    loc_today: {type:Boolean},
    loe_six_months: {type:Boolean},
    loe_today: {type:Boolean},
    nausea_six_months: {type:Boolean},
    nausea_today: {type:Boolean},
    rsb_six_months: {type:Boolean},
    rsb_today: {type:Boolean},
    bciv_six_months: {type:Boolean},
    bciv_today: {type:Boolean},
    hattk_six_months: {type:Boolean},
    hattk_today: {type:Boolean},
    ihtfs_six_months: {type:Boolean},
    iftfs_today: {type:Boolean},
    strk_six_months: {type:Boolean},
    strk_today: {type:Boolean},
    doctor_id:  {type:String},
    doctors_office_id:  {type:String},
    parent_type:  {type:String},
    parent_id: {type:String},
}, { collection: 'google_events' })

module.exports = mongoose.model('google_events', googleeventSchema);
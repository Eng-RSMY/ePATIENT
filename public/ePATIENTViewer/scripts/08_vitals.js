
this.data.vitals_sections = [
    {
        key:'vital_signs',
        label:'Vital Signs',
        display:[
            {label:'Date',name:'date'},
            // {label:'Time',name:'time'},
            // {label:'Systolic',name:'systolic'},
            // {label:'Diastolic',name:'diastolic'},
            {label:'BP',name:'bps',calculation:function(e){
                if (isNaN(parseInt(e.systolic)) || isNaN(parseInt(e.diastolic))){
                    return '';
                }
                return parseInt(e.systolic)+'/'+parseInt(e.diastolic);
            }},
            {label:'HR',name:'beats_per_minute'},
            {label:'RR',name:'breaths_per_minute'},
            {label:'Temp',name:'temps', calculation: function(e){
                var temp = parseInt(e.temp);
                if (temp == 0){
                    return '';
                }
                return temp;
            }},
            {label:'SpO2',name:'spo2_p', calculation: function(e){
                var temp = parseInt(e.spo2);
                if (isNaN(temp)){
                    return '';
                }
                return temp+'%';
            }},
            {label:'Notes',name:'notes'},
            
        ]
    },    
    {
        key:'intake_output',
        label:'Intake/Output',
        display:[
            {label:'Date',name:'date'},
            {label:'Oral',name:'oral'},
            {label:'IV',name:'iv'}
        ]
    },    
    {
        key:'pain',
        label:'Pain',
        display:[
            {label:'Date',name:'date'},
            {label:'Site',name:'site'},
            {label:'Quantity',name:'quantity_p', calculation:function(e){
                return parseInt(e.quantity)+'/10';
            }},
            {label:'Description',name:'description',calculation:function(e){
                return "<div><b>Aggravating Factors:</b> "+e.aggravating_factors+"</div>"+"<div><b>Quality of pain:</b> "+e.quality_of_pain+"</div>"+"<div><b>Periodicity:</b> "+e.periodicity+"</div><div><b>Duration:</b> "+e.duration+"</div>"
            }}
        ]
    },    
    {
        key:'neuro',
        label:'Neuro',
        display:[
            {label:'Date',name:'date'},
            {label:'Orientation',name:'orientation'},
            {label:'Behavioral / Emotional',name:'behavioral_emotional'},
            {label:'Strength',name:'strength_summary'},
            {label:'Pupils',name:'pupil_summary'},
            {label:'PERRLA',name:'perrla'},
            {label:'GLASGOW',name:'gscore',calculation:function(e){
                return parseInt(e.verbal_response)+parseInt(e.motor_response)+parseInt(e.eye_opening) || '';
            }},
            {label:'Ramsey Scale',name:'sedation'},
            
            
            
            
        ]
    },    
    {
        key:'cardiac',
        label:'Cardiac',
        display:[
            {label:'Date',name:'date'},
            {label:'Heart Tones',name:'heart_tones'},
            {label:'Pulses',name:'pulses_summary'},
            {label:'Edema',name:'edema_summary'},
            {label:'Capillary Refill',name:'capillary_refill_summary'},
            {label:'Devices',name:'devices'}

        ]
    },    
    {
        key:'respiratory',
        label:'Respiratory',
        display:[
            {label:'Date',name:'date'},
            {label:'Assessment',name:'assess',calculation:function(e){
                return "stuff"
            }},
            {label:'O2 Delivery method',name:'method'},
            {label:'Amount',name:'o2amount'},
            {label:'Sputum',name:'sputum',calculation:function(e){
                return "<div><b>Color:</b> "+e.color+"</div>"+"<div><b>Consistency:</b> "+e.consistency+"</div>"+"<div><b>Amount:</b> "+e.amount+"</div>"
            }},
            // {label:'Airway Device',name:'airway_device'}
        ]
    },    
    {
        key:'gi',
        label:'Gastrointestinal',
        display:[
            {label:'Date',name:'date'},
            {label:'Assessment',name:'summary'},
            {label:'Output',name:'output_summary'},
            {label:'Gastric tube Location',name:'gt_location'},
            {label:'Ostamy Location',name:'ostamy_location'},
            {label:'Diet',name:'diet'},
            {label:'Abdominal girth',name:'size'}
        ]
    },    
    {
        key:'gu',
        label:'Genitourinary',
        display:[
            {label:'Date', name:'date'},
            {label:'Assessment',name:'urinary_symptoms'},
            {label:'Urine Color',name:'urine_color'},
            {label:'Urine Character',name:'urine_character'},
            {label:'Urinary Elimination',name:'urinary_elimination'},
            {label:'Amount',name:'amount'},
            
            
            
              {label:'Catheter',name:'catheter_bool',calculation:function(e){
                return (e.catheter ? "Yes" : "");
            }}
        ]
    },    
    {
        key:'musculoskeletal',
        label:'Musculoskeletal',
        display:[
            {label:'Date',name:'date'},
            {label:'Assessment',name:'musculoskeletal_symptoms'},
            {label:'Muscle Tone/Strength Summary',name:'muscle_summary'},
            {label:'Gait',name:'gait'},
            {label:'Ambulatory Device',name:'ambulatory_device'}
        ]
    },    
    {
        key:'skin',
        label:'Skin Assessment',
        display:[
            {label:'Date',name:'date'},
            {label:'Assessment',name:'skin'},
            {label:'Other',name:'other_data',calculation:function(e){
                var result = "";
                if(e.lesions.length){
                    result+= "<div><b>Lesions: </b> "+e.lesions+"</div>"
                }
                if(e.wounds.length){
                    result+= "<div><b>Wounds: </b> "+e.wounds+"</div>"
                }
                if(e.pressure_ulcers.length){
                    result+= "<div><b>Pressure Ulcers: </b> "+e.pressure_ulcers+"</div>"
                }
                return result
            }}
        ]
    },    
    {
        key:'mental',
        label:'Mental',
        display:[
            {label:'Date',name:'date'},
            {label:'Behavior/Affect',name:'behavior'},
            {label:'Coping',name:'coping'},
            {label:'Consult',name:'consult'},
            {label:'At Risk for',name:'at_risk_for'},
            {label:'Abuse Risk',name:'abuse_risk'},
            {label:'Note',name:'note_bool',calculation:function(e){
                return (e.note.length ? "Yes" : "");
            }}
        ]
    }
    
    
    
    
    
]

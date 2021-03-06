this.administer = function(id){
var order = this.data.scenario.prescription_orders.order[id];
    		var fields = [
    		  //  {label: 'Prescription', type: 'barcode', name:'prescription', required: true, help:order.medication },

				// {label: 'Patient MR#', type: 'barcode', name:'patient', required: true, help:this.data.scenario.patient_info.medical_record_number},

				{label: 'Patient/Date of Birth', type: 'barcode', name:'patient', required: true, help: this.data.scenario.patient_info.first_name+' '+this.data.scenario.patient_info.last_name+' '+this.data.scenario.patient_info.dob},
				// {label: 'Initials', required:true},
				{name: 'id', type: 'hidden', value:id}

			]
			if(this.data.admin){
			    fields.push({label:'Date',type:"date",value:moment().format("MM/DD/YYYY HH:mm")})
			    fields.push({label:'Time',type:"time",value:moment().format("hh:mm A")})
			    fields.push({label:'Administered By',value:this.data.user.first_name+" "+this.data.user.last_name})
			}
    			$().berry({name:'validate',legend: 'Confirmation', fields: fields}).on('save', function() {
				if( Berries.validate.validate() ) {
				    var order = this.data.scenario.prescription_orders.order[parseInt(Berries.validate.toJSON().id)]
                    order.medication_admin = order.medication_admin || [];
                    if(!this.data.admin){
                        order.medication_admin.push({
                            date:moment().format("MM/DD/YYYY HH:mm"), 
                            time:moment().format("hh:mm A"),
                            administered_by:this.data.user.first_name+" "+this.data.user.last_name
                        })
                    }else{
                            order.medication_admin.push(_.pick(Berries.validate.toJSON(),'date','time','administered_by'))
                    }
                        order.medication_admin = _.sortBy(order.medication_admin, 'date')
                        this.app.update(this.data.scenario)
                        save.call(this,this.data.scenario)
                    Berries.validate.trigger('close')
                    
				}
			},this)
			.on('change:patient', function(item){
					this.fields.patient.setValue(item.value)
					
			        var field = this.findByID(item.id);
					this.performValidate(field, item.value)
					field.self.toggleClass('has-success', field.valid);
			})
			.on('change:prescription', function(item){
					this.fields.prescription.setValue(item.value)
					
			        var field = this.findByID(item.id);
					this.performValidate(field, item.value)
					field.self.toggleClass('has-success', field.valid);
			})
    
    
    
        }


this.data.page_map = {
    
    
    // "patient_info":{
    //             attr: function(){
    //             return this.data.scenario.patient_info ||{}

    //     },
    //     update:function(scenario, updates){
    //         this.data.scenario.patient_info = updates;
    //         return this.data.scenario;
    //     },back:"#page=patient_info"
        
    // },
    "lab_form":{
        onload: function(){
            var temp = {};
            if(typeof this.data.hashParams.id !== 'undefined'){
                temp.date = this.data.scenario.lab_results[parseInt(this.data.hashParams.id)].date
                _.each(this.data.scenario.lab_results[parseInt(this.data.hashParams.id)].result,function(item){temp[item.test_name]=item.value;return temp;})
            }
    
            _.each(this.data.lab_types,function(item){
                if(item.tests.length){
                $('[name="'+item.name+'"]').berry(
                    {attributes:temp,name:item.name,fields:_.map(item.tests,function(test){test.name = test.test;return test;}),renderer:'inline'}
                    )
                }
            }.bind(this))
            
            if(this.data.admin){
                if(this.data.scenario_id){
                    $('.admin-date').berry(
                        {attributes:temp,name:'date',fields:[{label:'Lab Date',name:'date',type:'text'}],actions:[]}
                    )
                }else{
                    $('.admin-date').berry(
                        {attributes:temp,name:'date',fields:[{label:'Lab Date',name:'date',type:'date'}],actions:[]}
                    )
                }
            }
            // fields.push({name:'date'})

        },
        save: function(){
            
    _.each(this.data.lab_types,function(item){                
        if(item.tests.length){
            var tests = Berries[item.name].toJSON();
            if(!_.every(tests, _.isEmpty)){
                var temp = _.map(tests,function(test,i){
                    return {test_name:i,value:test}
                }.bind(this))
                var date = moment().format("MM/DD/YYYY");
                if(this.data.admin){
                    date = Berries.date.toJSON().date;
                }
                if(typeof this.data.hashParams.id !== 'undefined'){
                    this.data.scenario.lab_results[parseInt(this.data.hashParams.id)] ={category:item.name,date:date,result:temp}
                }else{
                    this.data.scenario.lab_results.push({category:item.name,date:date,result:temp})
                }
            }
        }
            }.bind(this))
            
            // this.data.scenario.lab_results = [];
            this.data.lab_types = _.map(["abgs","bmp","cmpanel", "cbc","cmprofile","ck","electrolytes","lp","lfp","urinalysis","btc","csf","coagulation"],function(item){
                return {
                    name:item,
                    tests:_.where(this.data.labs,{category:item}),
                    results:_.where(this.data.scenario.lab_results,{category:item})
                }}.bind(this))
                
                
            this.app.update(this.data.scenario)
            save.call(this, this.data.scenario)

            // this.app.post('scenario_log', {team_id:this.data.team_id, state:this.data.scenario}, function(){})
            document.location.hash = this.data.page_map.lab_form.back;

        },
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this alert?")){
                    delete this.data.scenario.lab_results[id]
                    this.data.scenario.lab_results = _.compact(this.data.scenario.lab_results);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                    document.location.hash = this.data.page_map.lab_form.back;
                    location.reload();
                }
            }
        },
        back:"#page=labs"
    },
    "orders":{
        attr: function(){
            if(typeof this.data.scenario.orders !== 'undefined'){
                return this.data.scenario.orders.order[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario.orders = {order:[]};
                return {}
            }
        },
        update:function(scenario, updates){
            if(typeof this.data.hashParams.id !== 'undefined'){
                this.data.scenario.orders.order[parseInt(this.data.hashParams.id)] = updates
            }else{
            this.data.scenario.orders.order.push(updates);
                
            }
            return this.data.scenario;
        },       
        start:function(id){
            this.data.scenario.orders.order[id].status = "In Progress";
            this.app.update(this.data.scenario)
            save.call(this,this.data.scenario)

        },       
        complete:function(id){
            this.data.scenario.orders.order[id].status = "Completed"
            this.data.scenario.orders.order[id].completed_by = this.data.user.first_name+" "+this.data.user.last_name;
            this.app.update(this.data.scenario)
            save.call(this,this.data.scenario)
        },        
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this order?")){
                    delete this.data.scenario.orders.order[id]
                    this.data.scenario.orders.order = _.compact(this.data.scenario.orders.order);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                }
            }
        },
        back:"#page=orders"
        
    },
    "prescription_orders":{
        attr:function(){
            if(typeof this.data.scenario.prescription_orders !== 'undefined'){
                return this.data.scenario.prescription_orders.order[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario.prescription_orders = {order:[]};
                return {}
            };
        },
        update:function(scenario, updates){
            if(typeof this.data.hashParams.id !== 'undefined'){
                
                var medication_admin = this.data.scenario.prescription_orders.order[parseInt(this.data.hashParams.id)].medication_admin || [];
                this.data.scenario.prescription_orders.order[parseInt(this.data.hashParams.id)] = updates
                this.data.scenario.prescription_orders.order[parseInt(this.data.hashParams.id)].medication_admin = medication_admin;
            }else{
            this.data.scenario.prescription_orders.order.push(updates);
                
            }
            return this.data.scenario;
        },        
        "administer":this.administer,
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this prescription order?")){
                    delete this.data.scenario.prescription_orders.order[id]
                    this.data.scenario.prescription_orders.order = _.compact(this.data.scenario.prescription_orders.order);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                }
            }
        },
        back:"#page=prescription_orders"
    },
    
    "medication_admin":{
        "administer":this.administer,
        "delete":function(id,e){
            // debugger;
            delete this.data.scenario.prescription_orders.order[parseInt(e.currentTarget.parentElement.parentElement.dataset.id)].medication_admin[id]
            this.data.scenario.prescription_orders.order[parseInt(e.currentTarget.parentElement.parentElement.dataset.id)].medication_admin = _.compact(this.data.scenario.prescription_orders.order[parseInt(e.currentTarget.parentElement.parentElement.dataset.id)].medication_admin);
            this.app.update(this.data.scenario)
            save.call(this,this.data.scenario)
        }
    },
    
    "alerts":{
        attr: function(){
            if(typeof this.data.scenario.alerts !== 'undefined'){
                return this.data.scenario.alerts.alert[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario.alerts = {alert:[]};
                return {}
            };
        },
        update:function(scenario, updates){
            if(typeof this.data.hashParams.id !== 'undefined'){
                this.data.scenario.alerts.alert[parseInt(this.data.hashParams.id)] = updates
            }else{
                this.data.scenario.alerts.alert.push(updates);
            }
            return this.data.scenario;
    
        },
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this alert?")){
                    delete this.data.scenario.alerts.alert[id]
                    this.data.scenario.alerts.alert = _.compact(this.data.scenario.alerts.alert);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                }
            }
        },
        back:"#page=alerts"
    },
    "problems":{
        attr: function(){
            if(typeof this.data.scenario.problems !== 'undefined'){
                return this.data.scenario.problems.problem[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario.problems = {problem:[]};
                return {}
            };
        },
        update:function(scenario, updates){
            if(typeof this.data.hashParams.id !== 'undefined'){
                this.data.scenario.problems.problem[parseInt(this.data.hashParams.id)] = updates
            }else{
            this.data.scenario.problems.problem.push(updates);
                
            }
            return this.data.scenario;
        },
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this problem?")){
                    delete this.data.scenario.problems.problem[id]
                    this.data.scenario.problems.problem = _.compact(this.data.scenario.problems.problem);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                }
            }
        },
        back:"#page=problems"
    },   
    "notes":{
        attr: function(){
            if(typeof this.data.scenario.notes !== 'undefined'){
                return this.data.scenario.notes.note[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario.notes = {note:[]};
                return {}
            }
        },
        update:function(scenario, updates){
            if(typeof this.data.hashParams.id !== 'undefined'){
                this.data.scenario.notes.note[parseInt(this.data.hashParams.id)] = updates
            }else{
            this.data.scenario.notes.note.push(updates);
                
            }
            return this.data.scenario;
    
        },
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this note?")){
                    delete this.data.scenario.notes.note[id]
                    this.data.scenario.notes.note = _.compact(this.data.scenario.notes.note);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                }
            }
        },
        back:"#page=notes"
    },
    "diagnostics":{
        attr: function(){
            if(typeof this.data.scenario.diagnostics !== 'undefined'){
                
                return this.data.scenario.diagnostics[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario.diagnostics = [];
                return {}
            }
        },
        update:function(scenario, updates){
            if(typeof this.data.hashParams.id !== 'undefined'){
                this.data.scenario.diagnostics[parseInt(this.data.hashParams.id)] = updates
            }else{
            this.data.scenario.diagnostics.push(updates);
                
            }
            return this.data.scenario;
    
        },
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this diagnostic?")){
                    delete this.data.scenario.diagnostics[id]
                    this.data.scenario.diagnostics = _.compact(this.data.scenario.diagnostics);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                }
            }
        },
        back:"#page=diagnostics"
    },
    "labs":{
        attr: function(){
            if(typeof this.data.scenario.labs !== 'undefined'){
                
                return this.data.scenario.labs[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario.labs = [];
                return {}
            }
        },
        update:function(scenario, updates){
            if(typeof this.data.hashParams.id !== 'undefined'){
                this.data.scenario.labs[parseInt(this.data.hashParams.id)] = updates
            }else{
            this.data.scenario.labs.push(updates);
                
            }
            return this.data.scenario;
    
        },
        delete:function(id, e){
            if(this.data.admin){
                if(confirm("Are you sure you want to delete this lab?")){
                    delete this.data.scenario.labs[id]
                    this.data.scenario.labs = _.compact(this.data.scenario.labs);
                    this.app.update(this.data.scenario)
                    save.call(this,this.data.scenario)
                }
            }
        },
        back:"#page=labs"
    },   
    "patient_info":{
        attr:  function(){
            return this.data.scenario.patient_info || {}
        },
        update:function(scenario, updates){
            // if(typeof this.data.hashParams.id !== 'undefined'){
            //     this.data.scenario.prescription_orders.order[parseInt(this.data.hashParams.id)] = updates
            // }else{
            // this.data.scenario.prescription_orders.order.push(updates);
                
            // }
            // return this.data.scenario;
            this.data.scenario.patient_info = updates;
            return this.data.scenario;
    
        },
        back:"#page=patient_info&form=patient_info"
    },
    "pharmacist_verification":{
        attr:  function(){
            // return this.data.scenario.patient_info || {}
        },
        approve:function(id){
            this.data.scenario.prescription_orders.order[parseInt(id)].approved = 'Verified'
            this.app.update(this.data.scenario)
            save.call(this,this.data.scenario)
            // this.app.post('scenario_log', {team_id:this.data.team_id, state:this.data.scenario}, function(){})
            document.location.hash = this.data.page_map.pharmacist_verification.back;

        },
        reject:function(id){
            this.data.scenario.prescription_orders.order[parseInt(id)].approved = 'Declined'
            this.app.update(this.data.scenario)
            save.call(this,this.data.scenario)
            document.location.hash = this.data.page_map.pharmacist_verification.back;

            // this.app.post('scenario_log', {team_id:this.data.team_id, state:this.data.scenario}, function(){})
        },

        back:"#page=pharmacist_verification"
    },
    "default":{
        attr: function(){
            if(typeof this.data.scenario[this.data.hashParams.form] !== 'undefined'){
                return _.extend([],this.data.scenario[this.data.hashParams.form].item).reverse()[parseInt(this.data.hashParams.id)] || {}
            }else{
                this.data.scenario[this.data.hashParams.form] = {item:[]};
                return {}
            };
        },
        update:function(scenario, updates){
            // if(typeof this.data.scenario[this.data.hashParams.form] == 'undefined'){
            //     this.data.scenario[this.data.hashParams.form] = {item:[]};
            // };
            if(typeof this.data.hashParams.id !== 'undefined'){
                this.data.scenario[this.data.hashParams.form].item[parseInt(this.data.hashParams.id)] = updates
            }else{
                this.data.scenario[this.data.hashParams.form].item.push(updates);
                
            }
            return this.data.scenario;
        },
        delete:function(id, e){
            if(confirm("Are you sure you want to delete this assessment?")){
                delete this.data.scenario[e.currentTarget.dataset.form].item[id]
                this.data.scenario[e.currentTarget.dataset.form].item = _.compact(this.data.scenario[e.currentTarget.dataset.form].item);
                this.app.update(this.data.scenario)
                save.call(this,this.data.scenario)
            }
            // if(typeof this.data.hashParams.id !== 'undefined'){
            //     this.data.scenario[this.data.hashParams.form].item[parseInt(this.data.hashParams.id)] = updates
            // }else{
            // this.data.scenario[this.data.hashParams.form].item.push(updates);
                
            // }
            // return this.data.scenario;
        },
        back:"#page=assessment"
    }
    
}

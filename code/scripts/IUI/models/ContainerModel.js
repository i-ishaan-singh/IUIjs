define(['IUI-core','ObservableModel','Template'],function(IUI){

	var ContainerModel=IUI.ObservableModel.extend({
		ModelType: 'ContainerModel',
		_handleChange: function(key,value,sender){
			//console.log('in Container Model'+ this._uid);
			IUI.ObservableModel.prototype._handleChange.apply(this,arguments);
			var boundModels=this.boundModels,length;
			if(boundModels.length){
				var length=boundModels.length;				
				for(var i=0;i<length;++i){
					var obj=boundModels[i];
					if(obj.model._uid===this.lastUpdatedBy){
						delete this.lastUpdatedBy;
						continue;
					}
					var result=IUI.Template.render(obj.template,this.model);			
					obj.model.model[obj.optionAttribute]=result;
				}			
			}
		},
		bindOptionModel: function(optionModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels=[]);
			for(var i=0;i<length;++i){
				var obj={
					model: optionModel,
					optionAttribute:mappingArray[i].optionAttribute,
					template:mappingArray[i].template
				}
				mapping=mappingArray[i].mappings;
				this.boundModels.push(obj);		
			}
		}	
	});
	
	IUI.ContainerModel=ContainerModel;
	
});
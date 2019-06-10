(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','ObservableModel','Template'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

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
		unbindOptionModel: function(optionModel,mappingArray){
			var length = mappingArray.length;
			var uids=[];
			for(var i=0;i<length;++i){
				uids.push( mappingArray[i]._uid);
			}
			this.boundModels=this.boundModels.filter(function(elem){
				if(uids.indexOf(elem._uid) !== -1){
					return false;
				}
				return true;
			});		
		},
		bindOptionModel: function(optionModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels=[]);
			for(var i=0;i<length;++i){
				var obj={
					model: optionModel,
					optionAttribute:mappingArray[i].optionAttribute,
					template:mappingArray[i].template,
					_uid: mappingArray[i]._uid
				}
				mapping=mappingArray[i].mappings;
				this.boundModels.push(obj);		
			}
		}	
	});
	
	IUI.ContainerModel=ContainerModel;
	
});
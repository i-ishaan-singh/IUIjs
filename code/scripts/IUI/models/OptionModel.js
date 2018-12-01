(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','ObservableModel','Template'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var OptionsModel=IUI.ObservableModel.extend({
		ModelType: 'OptionsModel',
		_handleChange: function(key,value,sender){
			//console.log('in Options Model'+ this._uid);
			IUI.ObservableModel.prototype._handleChange.apply(this,arguments);
			var boundModels=this.boundModels[key],length;
			if(boundModels){
				var length=boundModels.length;
				for(var i=0;i<length;++i){
					var obj=boundModels[i];
					for(var a in obj.mappedAttributes){
						
						if(obj.isExclusive){
							obj.model.lastUpdatedBy=this._uid;
							obj.model.model[obj.mappedAttributes[a]]=value;
						}
					}
				}			
			}
		},
		bindConainerModel: function(containerModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels={});
			for(var i=0;i<length;++i){
				var obj={
					model: containerModel,
					mappedAttributes:[],
					isExclusive:mappingArray[i].isExclusive 
				}
				mapping=mappingArray[i].mappings;
				for(var maps in mapping){
					if(typeof containerModel.model[mapping[maps]] !== "undefined"){
						obj.mappedAttributes.push(mapping[maps]);
					}
				}
				options=mappingArray[i].optionAttribute;
				this.model[options]=IUI.Template.render(mappingArray[i].template,containerModel.model);
				(this.boundModels[options]) || (this.boundModels[options]=[]);
				this.boundModels[options].push(obj);				
			}
		}
	});

		
	IUI.OptionsModel=OptionsModel;
	
});
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
		unbindConainerModel: function(optionModel,mappingArray){
			var length = mappingArray.length, keys;
			var uids={
				
			};
			for(var i=0;i<length;++i){
				(uids[mappingArray[i].optionAttribute]) || (uids[mappingArray[i].optionAttribute] =[])
				uids[mappingArray[i].optionAttribute].push( mappingArray[i]._uid);
			}
			keys=Object.keys(uids)
			for(var i in keys){
				
				this.boundModels[keys[i]]=this.boundModels[keys[i]].filter(function(elem){
					if(uids[keys[i]].indexOf(elem._uid) !== -1){
						return false;
					}
					return true;
				});	
				
				
			}
				
		},
		bindConainerModel: function(containerModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels={});
			for(var i=0;i<length;++i){
				var obj={
					model: containerModel,
					mappedAttributes:[],
					isExclusive:mappingArray[i].isExclusive,
					_uid: mappingArray[i]._uid
				}
				mapping=mappingArray[i].mappings;
				for(var maps in mapping){
					if(typeof containerModel.model[mapping[maps]] !== "undefined"){
						obj.mappedAttributes.push(mapping[maps]);
					}
				}
				options=mappingArray[i].optionAttribute;
				(this.boundModels[options]) || (this.boundModels[options]=[]);
				this.boundModels[options].push(obj);				
			}
		}
	});

		
	IUI.OptionsModel=OptionsModel;
	
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Template'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var validator= function(){
		return {valid:true};
	}
	var ObservableModel=IUI.Class.extend({
		classType: 'ObservableModel',
		initialize: function(model,handler,list,options){
			this._uid=IUI.getUID();
			//IUI.Class.prototype.initialize.call(this,options);
			options=((options) || ({}));
			if(typeof handler === "object"){
				list=handler;
				delete handler;
			}	
			
			var _data={},
				_handleChange=this._handleChange.bind(this);
			if((options.shouldValidate===false || !options.validator)){
				validator = validator;
			}
			this._data=_data;
			this.handler=handler;
			
			var that=this, _modelUpdating=false;
			this.model=model || {};
			
			Object.defineProperty(this.model,'__update',{
				value: function(_newModel){
					_modelUpdating=true;
					var _keys=[], that=this;
					Object.keys(_newModel).forEach(function(key){
						that[key]=_newModel[key];				
						_keys.push(key);
					});
					_keys.forEach(function(key){
						_handleChange(key,_newModel[key]);
					});
					
					_modelUpdating=false;
				},
				enumerable: false
    		});
				
			
			Object.keys(model).forEach(function(key){
				if(list && (list.indexOf(key)===-1)){
					return;
				}else if(typeof that.model[key] === 'function'){
					return;
				}
				
				Object.defineProperty(that._data,key,{
					value: that.model[key],
					writable: true
    			});
				
				Object.defineProperty(that.model,key,{	
					set: function(value){
							var valid=validator(value);
							if(_data[key]!==value && valid.valid){
								_data[key]=value;
								setTimeout(function(){
									(_modelUpdating) || (_handleChange(key,value));
								});
							}
						},
					get: function(){
							return _data[key];
						}
				});
			});
	
		},
		
		_handleChange: function(key,value,sender){
			var that=this;
			setTimeout(function(){
				(that.handler) && (that.handler(key,value,sender));
			})
		}
	});
	
	
	ObservableModel.bindModels=function bindModels(optionsModel, containerModel,mappingArray){
		optionsModel.bindConainerModel(containerModel,mappingArray);
		containerModel.bindOptionModel(optionsModel,mappingArray);
	}
		
	ObservableModel.unbindModels=function bindModels(optionsModel, containerModel,mappingArray){
		optionsModel.unbindConainerModel(containerModel,mappingArray);
		containerModel.unbindOptionModel(optionsModel,mappingArray);
	}
	
	
	IUI.ObservableModel=ObservableModel;
	


});
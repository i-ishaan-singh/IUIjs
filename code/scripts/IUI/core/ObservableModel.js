define(['IUI-core','Template'],function(IUI){

	var ObservableModel=IUI.Class.extend({
		classType: 'ObservableModel',
		initialize: function(options,handler,list){
			this._uid=IUI.getUID();
			//IUI.Class.prototype.initialize.call(this,options);
			
			if(typeof handler === "object"){
				list=handler;
				delete handler;
			}	
			
			var _data={},
				_handleChange=this._handleChange.bind(this);
			this._data=_data;
			this.handler=handler;
			this.model=options || {};
			for(var key in options){
				if(list && (list.indexOf(key)===-1)){
					continue;
				}
				
				Object.defineProperty(this._data,key,{
					value: this.model[key],
					writable: true
    			});
				
				Object.defineProperty(this.model,key,{	
					set: (function(key){
						return function(value){
							if(_data[key]!==value){
								_data[key]=value;
								_handleChange(key,value);
							}
						}
					})(key),
					get: (function(key){
						return function(){
							return _data[key];
						}
					})(key)
				});
			}
		}
		,
		_handleChange: function(key,value,sender){
			(this.handler) && (this.handler(key,value,sender));
		}
	});
	
	
	ObservableModel.bindModels=function bindModels(optionsModel, containerModel,mappingArray){
		optionsModel.bindConainerModel(containerModel,mappingArray);
		containerModel.bindOptionModel(optionsModel,mappingArray);
	}
	
	
	IUI.ObservableModel=ObservableModel;
	


});
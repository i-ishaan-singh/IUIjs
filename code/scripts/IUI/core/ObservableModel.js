define(['IUI-core'],function(IUI){


	var ObservableModel=IUI.Class.extend({
		classType: 'ObservableModel',
		initialize: function(options,handler,list){
			if(typeof handler === "object"){
				list=handler;
			}			
			var _data={},_handleChange=handler || this._handleChange.bind(this);
			this._data=_data;
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
		_handleChange: function(key,value){
			this._userHandler(key,value);
		}
	});
	
	IUI.ObservableModel=ObservableModel;
	


});
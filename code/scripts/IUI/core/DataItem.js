(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var DataItem=IUI.Class.extend({
		classType: 'DataItem',
		events:IUI.Class.prototype.events.concat(['change']),
		options:{
			data:{}
		},
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);		
			this.dataAttributes=[];
			this._data=options.data;
			for(var attr in options.data){
				if(options.data.hasOwnProperty(attr)){
					this[attr]=options.data[attr];
					this.dataAttributes.push(attr);
				}
			}
			delete this.options;
		},
		set: function(key,value){
			this[key]=value;
			this._data[key]=value;
			var changed={}
			changed[key]=value;
			this.trigger('change',{changed:changed, model: this});
		},
		get: function(key){
			return this[key];
		}
		
	});
	
	
	IUI.DataItem=DataItem;

});
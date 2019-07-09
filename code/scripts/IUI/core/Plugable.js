(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','ContainerUI'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var plugList={};
	


	var Plugable =  IUI.ContainerUI.extend({
		events: IUI.ContainerUI.prototype.events.concat(['plug', 'activate']),
		initialize: function(){
			IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
			this._extractPlugOptions();
		},
		onInitialize: function(){
			(this.options.plugto) && (this._plugTo(this.options.plugto));
		},
		_extractPlugOptions: function(){
			var _plugOptions={}, options=this.options;
			Object.keys(options).forEach(function(_key){
				if(_key.indexOf('plug-')===0){
					_plugOptions[_key.slice(5)]=options[_key];
				}
			});
			this._plugOptions = _plugOptions;
		},
		plug: function(widget){
			
		},
		_plugTo: function(plugName){
			var that=this;
			if(plugList[plugName]){
				plugList[plugName].plugs.forEach(function(_plug){
					that.plug(_plug);
				});				
				plugList[plugName].plugable.push(this);
			}else{
				plugList[plugName]={
					plugs:[],
					plugable: [this]
				}
			}
		},
		unplug: function(){
			var that=this;
			if(this.options.plugto){
				plugList[this.options.plugto].plugable.forEach(function(_plugable, idx, list){
					if(_plugable === that){
						list.splice(idx,1);
						return false;
					}
				});
			}
		},
		destroy: function(){
			this.unplug();
			IUI.ContainerUI.prototype.destroy.apply(this,arguments);	
		}	
	});
	
	Plugable.registerPlug = function(name, widget){
		if(plugList[name]){
			plugList[name].plugable.forEach(function(_plugable){
				_plugable.plug(widget);
			});
			plugList[name].plugs.push(widget);
		}else{
			plugList[name]={
				plugs:[widget],
				plugable: []
			}
			
		}
	}
	IUI.Plugable=Plugable;

});
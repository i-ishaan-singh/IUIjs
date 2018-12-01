(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','ContainerUI'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Container=IUI.ContainerUI.extend({
		name:'Container',
		initialize: function(){
			IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
			this.bindModels();
			this._beforeRender();
			this.makeUI();		
			this._afterRender();
		},
		_beforeRender:function(){
		},
		_afterRender:function(){
		}
	});
	
	IUI.WidgetBuilder.plugin(Container);


});
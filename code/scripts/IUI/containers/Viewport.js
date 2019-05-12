(function (factory) {
  if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Exhibit', 'View'],factory);
  } else {
    factory(window.IUI);
  }
})(function(IUI){



	var Viewport = IUI.uiContainers.Exhibit.extend({
		name: 'Viewport',
		classList: IUI.uiContainers.Exhibit.prototype.events.concat(['i-ui-Viewport']),
		options:{
			context : 'default',
			destroyViews : false
		},
		initialize: function(options){
			IUI.uiContainers.Exhibit.prototype.initialize.apply(this, arguments);
			IUI.View.registerViewport(this);
			this.oldViews={};
			if(this.options.defaultview){
				IUI.View.renderViewInViewport(this.options.defaultview, this);
			}
		}

	});
	

	
	IUI.WidgetBuilder.plugin(Viewport);


});
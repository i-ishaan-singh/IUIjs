(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Grid=IUI.uiContainers.DataBoundContainer.extend({
		name:'Grid',
		tagName: 'table',		
		classList: ['i-ui-grid'],
	});
	
	IUI.WidgetBuilder.plugin(Grid);


});
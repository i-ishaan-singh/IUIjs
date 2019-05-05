(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){	
	
	var ContainerCell=IUI.uiContainers.Container.extend({
		name:'ContainerCell',
		tagName: 'TD',
		classList: ['i-ui-cell']
	});
	
	IUI.WidgetBuilder.plugin(ContainerCell);


});
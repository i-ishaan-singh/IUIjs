(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Row=IUI.uiContainers.Container.extend({
		name:'Row',
		tagName: 'tr',
		classList: ['i-ui-row']
	});
	
	IUI.WidgetBuilder.plugin(Row);


});
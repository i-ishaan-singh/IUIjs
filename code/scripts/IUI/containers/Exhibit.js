(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Exhibit=IUI.uiContainers.Container.extend({
		name:'Exhibit',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-exhibit'])
	});
	
	IUI.WidgetBuilder.plugin(Exhibit);


});
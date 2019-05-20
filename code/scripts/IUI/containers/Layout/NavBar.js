(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','Layout'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Navbar=IUI.uiContainers.Layout.extend({
		name:'Navbar',
		classList: IUI.uiContainers.Layout.prototype.classList.concat(['i-ui-navbar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-navbar-subcontainer']),
		_observedOptions: ['height'],
		_handleheightChange:function(value){
			$(this.subcontainer).css('padding-top',value);
		},
		processSubcontainer:function(subcontainer){
			$(subcontainer).css('padding-top',this.options.height);
		}
	});
	
	IUI.WidgetBuilder.plugin(Navbar);


});
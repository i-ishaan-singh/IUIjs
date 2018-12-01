(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','Navbar'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Footer=IUI.uiContainers.Navbar.extend({
		name:'Footer',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-footer']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-footer-subcontainer']),
		_appendSubContainer: function(){
			this.$element.before(this.subcontainer);
		},
	});
	
	IUI.WidgetBuilder.plugin(Footer	);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','Navbar'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){


	var Footer=IUI.uiContainers.Layout.extend({
		name:'Footer',
		classList: IUI.uiContainers.Layout.prototype.classList.concat(['i-ui-footer']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-footer-subcontainer']),
		_observedOptions: ['height'],
		_handleheightChange:function(value){
			$(this.subcontainer).css('padding-bottom',value);
		},
		processSubcontainer:function(subcontainer){
			$(subcontainer).css('padding-bottom',this.options.height);
		}
	});

	
	IUI.WidgetBuilder.plugin(Footer	);


});
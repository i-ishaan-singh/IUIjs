(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','Cell'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){	
	
	var ContainerHeaderCell=IUI.uiContainers.Container.extend({
		name:'ContainerHeaderCell',
		tagName: 'TH',
		classList: IUI.uiWidgets.Cell.prototype.classList.concat(['i-ui-header-cell']),
		makeUI: function(){
			IUI.uiContainers.Container.prototype.makeUI.apply(this,arguments);
			this.$element.data('field', this.options.field);
		}
	});
	
	IUI.WidgetBuilder.plugin(ContainerHeaderCell);


});
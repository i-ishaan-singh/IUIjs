(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Cell'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){
	
	var HeaderCell=IUI.uiWidgets.Cell.extend({
		name:'HeaderCell',
		tagName: 'Th',
		classList: IUI.uiWidgets.Cell.prototype.classList.concat(['i-ui-header-cell']),
		load: function(options){
			options.value=(options.element && options.element.innerHTML) || options.template || options.field || '';
			IUI.Widget.prototype.load.apply(this,arguments);		
		},
		_processOptions: function(wrapper){
			wrapper.innerHTML=this.options.value;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		}
	});
	
	IUI.WidgetBuilder.plugin(HeaderCell);


});
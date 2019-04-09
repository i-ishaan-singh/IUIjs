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
		_processOptions: function(wrapper){
			this.options.value=(this.element && this.element.innerHTML) || this.options.template || this.options.field || '';
			wrapper.innerHTML=this.options.value;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		}
	});
	
	IUI.WidgetBuilder.plugin(HeaderCell);


});
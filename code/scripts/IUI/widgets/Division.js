(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Division=IUI.Widget.extend({
		name:'Division',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-div']),
		_processOptions: function(wrapper){
			this.options.value=(this.element && this.element.innerHTML);
			wrapper.innerHTML=this.options.value;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(Division);


});
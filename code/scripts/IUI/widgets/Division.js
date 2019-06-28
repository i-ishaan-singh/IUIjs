(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Division=IUI.Widget.extend({
		name:'Division',
		classList: ['i-ui-div'],
		load: function(options){
			if(options.tagname){
				this.tagName=options.tagname;
			}
			options.value=(options.element && options.element.innerHTML);
			IUI.Widget.prototype.load.apply(this,arguments);
		},
		_processOptions: function(wrapper){
			wrapper.innerHTML=this.options.value;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(Division);


});
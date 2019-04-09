(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var FormLabel=IUI.Widget.extend({
		name:'FormLabel',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-formlabel']),
		_processOptions: function(wrapper){
			this.options.value=(this.element && this.element.innerHTML) || this.options.text;
			wrapper.innerText=this.options.value;
			delete this.options.text;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		options:{
			text: ''
		},
		value: function(val){
			if(typeof val !== 'undefined'){
				return this.element.innerHTML=val;
			}
			return this.element.innerHTML;
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(FormLabel);


});
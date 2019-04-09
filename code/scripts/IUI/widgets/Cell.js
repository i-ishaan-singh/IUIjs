(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){	
	
	var Cell=IUI.Widget.extend({
		name:'Cell',
		tagName: 'TD',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-cell']),
		_processOptions: function(wrapper){
			debugger;
			this.options.value=(this.element && this.element.innerHTML) || this.options.template || (this.options.field?'::'+this.options.field+'::':(new Error('No Field Value to bind with')));
			wrapper.innerHTML=this.options.value;
			delete this.options.text;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		options:{
			text: ''
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(Cell);


});
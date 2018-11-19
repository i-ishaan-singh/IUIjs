define(['IUI-core','Widget'],function(IUI){

	var FormLabel=IUI.Widget.extend({
		name:'FormLabel',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-formlabel']),
		_processOptions: function(wrapper){
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
			this.options.text=(this.element && this.element.innerHTML) || this.options.text;
			wrapper.innerHTML=this.options.text;
		},
		options:{
			text: ''
		}
	});
	
	IUI.WidgetBuilder.plugin(FormLabel);


});
define(['IUI-core','Widget'],function(IUI){

	var Button=IUI.Widget.extend({
		name:'Button',
		template: '<span class="i-ui-noselect"></span>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-button']),
		events:IUI.Widget.prototype.events.concat(['click']),
		options:{
			text: 'Button',
		},
		initialize: function(){
			IUI.Widget.prototype.initialize.apply(this,arguments);			
			this._attachEvents();
		},
		_processOptions: function(wrapper){
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
			this.options.text=(this.element && this.element.innerHTML) || this.options.text;
			wrapper.children[0].innerHTML=this.options.text;
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('click',IUI.behaviors.delegateDOMEvent.bind(this));
		},
		value: function(val){
			return this.options.text;
		}
	});
	
	IUI.WidgetBuilder.plugin(Button);


});
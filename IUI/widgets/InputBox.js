define(['../IUI-core.js','../core/Widget.js'],function(IUI){

	var InputBox=IUI.Widget.extend({
		name:'InputBox',
		template: '<input class="i-ui-input"></input>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-inputbox']),
		events:IUI.Widget.prototype.events.concat(['change']),
		onInitialize: function(){
			this._attachEvents();
			this.value(this.options.value);
		},
		onTemplateAttach:function(wrapper){
			this.input=$(wrapper.children[0]);
		},
		_attachEvents: function(){
			var that=this;
			$(this.input).on('change',IUI.behaviors.delegateDOMEvent.bind(this));
		},
		value: function(val){
			if(typeof val !== 'undefined'){
				return this.input.val(val);
			}
			return this.input.val();
		}
	});
	
	IUI.WidgetBuilder.plugin(InputBox);


});
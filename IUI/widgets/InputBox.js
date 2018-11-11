define(['../IUI-core.js','../core/Widget.js'],function(IUI){

	var InputBox=IUI.Widget.extend({
		name:'InputBox',
		template: '<input class="i-ui-input"></input>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-inputbox']),
		events:IUI.Widget.prototype.events.concat(['change']),
		initialize: function(){
			IUI.Widget.prototype.initialize.apply(this,arguments);			
			this.input=$(this.element.children[0]);
			this._attachEvents();
			this.value(this.options.value);
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
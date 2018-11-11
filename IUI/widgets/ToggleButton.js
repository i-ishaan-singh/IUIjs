define(['../IUI-core.js','../widgets/Button.js'],function(IUI){

	var ToggleButton=IUI.uiWidgets.Button.extend({
		name:'ToggleButton',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-button','i-ui-togglebutton']),
		events:IUI.Widget.prototype.events.concat(['click','toggle']),
		options:{
			text: 'ToggleButton',
		},
		toggle: function(){
			this.element.classList.toggle('i-ui-active');
			this.trigger('toggle',{value:this.value()});
		},
		_attachEvents: function(){
			var that=this;
			
			var _delegateEvent=IUI.behaviors.delegateDOMEvent.bind(this);
			
			this.$element.on('click',function(e){
				that.toggle();
				_delegateEvent(e);
			});
		},
		value: function(val){
			if(typeof val !== 'undefined'){
				val=JSON.parse(val);
				this.element.classList.toggle('i-ui-active',val);
			}else{
				return this.element.classList.contains('i-ui-active');
			}
		}
	});
	
	IUI.WidgetBuilder.plugin(ToggleButton);


});
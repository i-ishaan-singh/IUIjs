define(['IUI-core','Button'],function(IUI){

	var SubmitButton=IUI.uiWidgets.Button.extend({
		name:'SubmitButton',
		template: '<span class="i-ui-noselect"></span><button style="display:none;"></button>',
		options:{
			text: 'Submit',
		},
		_attachEvents: function(){
			var that=this;
			var _delegateEvent=IUI.behaviors.delegateDOMEvent.bind(this)
			this.$element.on('click',function(e){
				_delegateEvent(e);
				e.stopPropagation();
				$(that.element.children[1]).trigger(e);
			});
		},
		value: function(val){
			return this.options.text;
		}
	});
	
	IUI.WidgetBuilder.plugin(SubmitButton);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var RadioGroup=IUI.uiContainers.Container.extend({
		name:'RadioGroup',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-radiogroup']),
		options:{
			group: 'group',
			orientation: 'vertical'
		},
		events:['change'],
		_handlevalueChange:function(value){
			if(this.value()!==value)
				this.value(value);
		},
		_beforeRender:function(){
			var radios=this.element.querySelectorAll('Radio');
			for (var i = 0; i < radios.length; i++) {
				var item = radios[i];
					item.setAttribute('group',this.options.group);
			}
			this.group=this.options.group;	
			if(this.options.orientation==="vertical"){
				this.classList.push('i-ui-vertical-radiogroup');
			}else{
				this.classList.push('i-ui-horizontal-radiogroup');
			}
		},
		_afterRender: function(){
			if(this.options.value){
				this.value(this.options.value);
			}
			this._attachEvents();
		},
		_onCreate: function(widget){
			if(widget.options.formattribute && typeof widget.value === "function" ){
				this._widgetAttributeValueMap[widget.options.formattribute]=widget.value.bind(widget);
			}
		},
		value: function(val){
			var selectedRadio;
			if(typeof val !== "undefined"){
				selectedRadio=this.element.querySelector('input[value="'+val+'"]');
				if(selectedRadio){
					selectedRadio.checked=true;
					this.options.value=val;
				}
			}else{
				selectedRadio=this.element.querySelector(':checked');
				if(selectedRadio){
					return selectedRadio.value;
				}else{
					return null;
				}
			}
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('change','input',function(e){
				that.options.value=e.target.value;
				IUI.behaviors.delegateDOMEvent.call(that,e);
			});
		}
	});
	
	IUI.WidgetBuilder.plugin(RadioGroup);


});
define(['IUI-core','Container'],function(IUI){

	var RadioGroup=IUI.uiContainers.Container.extend({
		name:'RadioGroup',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-radiogroup']),
		options:{
			group: 'group',
			orientation: 'vertical'
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
			this.element.removeAttribute('group');
			this.element.removeAttribute('orientation');
			this.element.removeAttribute('formAttribute');
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
				}
			}else{
				selectedRadio=this.element.querySelector(':checked');
				if(selectedRadio){
					return selectedRadio.value;
				}else{
					return null;
				}
			}
		}
	});
	
	IUI.WidgetBuilder.plugin(RadioGroup);


});
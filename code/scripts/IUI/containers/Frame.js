define(['IUI-core','Container'],function(IUI){

	var Form=IUI.Container.extend({
		name:'Form',
		classList: IUI.Container.prototype.classList.concat(['i-ui-form']),
		initialize: function(){
			this._widgetAttributeValueMap={};
		},
		_onCreate: function(widget){
			if(widget.classType==="Widget" && widget.options.formattribute){
				this._widgetAttributeValueMap[widget.options.formattribute]=widget.value.bind(widget);
			}
		},
		getJSON: function(){
			var _JSON={};
			for(var attribute in this._widgetAttributeValueMap){
				_JSON[attribute]=this._widgetAttributeValueMap[attribute]();
			}
		}
	});
	
	IUI.WidgetBuilder.plugin(Form);


});
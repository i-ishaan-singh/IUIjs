(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Form=IUI.uiContainers.Container.extend({
		name:'IForm',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-form']),
		_beforeRender:function(){	
			this._widgetAttributeValueMap={};
		},
		_onCreateWidget: function(widget){
			if(widget.options.formattribute && typeof widget.value === "function" ){
				this._widgetAttributeValueMap[widget.options.formattribute]=widget.value.bind(widget);
			}
		},
		getJSON: function(){
			var _JSON={};
			for(var attribute in this._widgetAttributeValueMap){
				_JSON[attribute]=this._widgetAttributeValueMap[attribute]();
			}
			return _JSON;
		},
		setJSON: function(obj){
			for(var attribute in obj){
				if(this._widgetAttributeValueMap[attribute]){
					this._widgetAttributeValueMap[attribute](obj[attribute]);
				}
			}
		},
		value: function(obj){
			if(obj){
				return this.setJSON(obj);
			}
			return this.getJSON();
		}
	});
	
	IUI.WidgetBuilder.plugin(Form);


});
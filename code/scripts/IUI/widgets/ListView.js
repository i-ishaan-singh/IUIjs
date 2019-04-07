(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){
	debugger;
	var ListView=IUI.Widget.extend({
		name:'ListView',
		tagName: 'TD',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-listview']),
		onDataFetch:function(dataObject){
			var _length=dataObject.data.length;
				items=[];
			for(var i=0;i<_length;++i){
				var _item=IUI.makeUI(this.options.template,dataObject.data[i]);
				this.$element.append(_item.$element);
				items.push(_item);
			}
			
			this.items=items;
		},
		onDataChange: function(dataObject){
			
			
		},
		_processOptions: function(wrapper){
			if(!this.options.template){
				this.options.template=(this.element && this.element.innerHTML);
				this.options.template='<container class="i-ui-list-item">'+this.options.template+'</container>';
			}
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		options:{
			text: ''
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(ListView);


});
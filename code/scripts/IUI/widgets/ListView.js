(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var ListView=IUI.Widget.extend({
		name:'ListView',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-listview']),
		ignoredAttributes: ['template'],
		onDataFetch:function(dataObject){
			var _length=dataObject.data.length, options=this.options, container= this.container;
				items=[];
			requestAnimationFrame(function(){
				for(var i=0;i<_length;++i){
					var _item=IUI.makeUI(options.template,dataObject.data[i]);
					container.append(_item.$element);
					items.push(_item);
				}				
			});
			
			this.items=items;
		},		
		onDataChange: function(dataObject){
			if(dataObject.type==="add"){
				var _item=IUI.makeUI(this.options.template,dataObject.item);
				if(typeof dataObject.index ==='undefined'){
					this.container.append(_item.$element);
					this.items.push(_item);
				}else{
					this.container.children().eq(dataObject.index).after(_item.$element);
					this.items.splice(dataObject.index,0,_item);	
				}
			}else if(dataObject.type==="remove"){
				this.container.children().eq(dataObject.index).remove();				
			}else{
				this._cleanUp();
				this.onDataFetch(dataObject);
			}
		},
		onTemplateAttach: function(element){
			IUI.Widget.prototype.onTemplateAttach.apply(this,arguments);	
			this.container = this.containerSelector?$(element).find(this.containerSelector):$(element);
		},
		_processOptions: function(wrapper){
			if(!this.options.template){
				this.options.template=(this.element && this.element.innerHTML);
				this.options.template='<container class="'+this.options.listclass+'">'+this.options.template+'</container>';
			}
			
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		_cleanUp: function(){
			this.container.children().detach();
		},
		options:{
			text: '',
			listclass: 'i-ui-list-item'
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(ListView);


});
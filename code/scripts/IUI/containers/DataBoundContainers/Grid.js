(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Grid=IUI.uiContainers.DataBoundContainer.extend({
		name:'Grid',
		tagName: 'table',		
		classList: ['i-ui-grid'],
		_extractRowTemplate: function(){
			var columns=this.element.getElementsByTagName('column'),
				headerTemplate = '<row class="i-ui-grid-thead">',
				rowTemplate = '<row class="i-ui-grid-tbody">';
						
			Array.prototype.slice.call(columns).forEach(function(elem){
				headerTemplate = headerTemplate+'<HeaderCell class=\'i-ui-grid-header\'>'+(elem.attributes.title?elem.attributes.title.value:'')+'</HeaderCell>';
				
				rowTemplate = rowTemplate+elem.outerHTML.replace(/title="(.*?)"/g,'').replace(/column/g,'ContainerCell');
				elem.outerHTML='';
			});
			this.headerTemplate = headerTemplate + '</row>'
			this.rowTemplate = rowTemplate + '</row>'
			
		},
		onDataFetch: function(dataObject){
			var _length=dataObject.data.length;
				items=[];
			this._header=IUI.makeUI(this.headerTemplate,this.options.model);
			this.$element.append(this._header.$element);
			for(var i=0;i<_length;++i){
				var _item=IUI.makeUI(this.rowTemplate,dataObject.data[i]);
				this.$element.append(_item.$element);
				items.push(_item);
			}
			this.items=items;
		},
		onDataChange: function(dataObject){
			debugger;
			if(dataObject.type==="add"){
				var _item=IUI.makeUI(this.rowTemplate,dataObject.item);
				if(typeof dataObject.index ==='undefined'){
					this.$element.append(_item.$element);
					this.items.push(_item);
				}else{
					this.$element.children().eq(dataObject.index).after(_item.$element);
					this.items.splice(dataObject.index,0,_item);	
				}
			}else if(dataObject.type==="remove"){
				this.$element.children().eq(dataObject.index).remove();				
			}else{
				this.$element.children().remove();
				this.onDataFetch(dataObject);
			}
		},
		makeUI: function(){
			this._extractRowTemplate();
			IUI.uiContainers.DataBoundContainer.prototype.makeUI.apply(this,arguments);
		},
		
	});
	
	IUI.WidgetBuilder.plugin(Grid);


});
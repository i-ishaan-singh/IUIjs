(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','DataBoundContainer'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Grid=IUI.uiContainers.DataBoundContainer.extend({
		name:'Grid',
		tagName: 'table',		
		classList: ['i-ui-grid'],
		options:{
			sortable: false
		},
		load: function(options){
			options.sortable=options.sortable === 'true';
		},
		_getHeaderTemplate: function(elem){
			var headerPrefix='',
				headerSufix='',
				headerTag='HeaderCell',
				classList=['i-ui-grid-header'];
				
			if((elem.attributes.sortable?(elem.attributes.sortable.value === 'true'):this.options.sortable)){
				headerTag='ContainerHeaderCell';
				headerSufix='</division><div class="i-ui-sort-icon-container"><i class="sort-arrow-desc fa fa-arrow-up"></i><i class="sort-arrow-asc fa fa-arrow-down"></div></i>'
				headerPrefix='<division>'
				classList.push('i-ui-sortable');
			}
			return '<'+headerTag+' '+(elem.attributes.field?('field=\''+elem.attributes.field.value+'\''):'')+' class=\''+classList.join(' ')+'\'>'+headerPrefix+(elem.attributes.title?elem.attributes.title.value:'')+headerSufix+'</'+headerTag+'>';
		},
		_extractRowTemplate: function(){
			var columns=this.element.getElementsByTagName('column'),
				headerTemplate = '<row class="i-ui-grid-thead">',
				rowTemplate = '<row class="i-ui-grid-tbody">',
				that=this;

			Array.prototype.slice.call(columns).forEach(function(elem){
				headerTemplate = headerTemplate+that._getHeaderTemplate(elem);
				if(elem.innerHTML.indexOf('<')!==0){
					rowTemplate = rowTemplate+elem.outerHTML.replace(/title="(.*?)"/g,'').replace(/column/g,'Cell');
				}else{
					rowTemplate = rowTemplate+elem.outerHTML.replace(/title="(.*?)"/g,'').replace(/column/g,'ContainerCell');
				}
				elem.outerHTML='';
			});
			this.headerTemplate = headerTemplate + '</row>'
			this.rowTemplate = rowTemplate + '</row>'
			
		},
		onDataFetch: function(dataObject){
			var _length=dataObject.data.length;
				items=[];
			this._header=this._header || IUI.makeUI(this.headerTemplate,this.options.model);
			this.$element.append(this._header.$element);
			for(var i=0;i<_length;++i){
				var _item=dataObject.data[i].__items || IUI.makeUI(this.rowTemplate,dataObject.data[i]);
				dataObject.data[i].__items = _item;
				this.$element.append(_item.$element);
				items.push(_item);
			}
			this.items=items;
		},
		onDataChange: function(dataObject){
			
			if(dataObject.type==="add"){
				var _item=dataObject.item.__items || IUI.makeUI(this.rowTemplate,dataObject.item);
				if(typeof dataObject.index ==='undefined'){
					dataObject.item.__items = _item;
					this.$element.append(_item.$element);
					this.items.push(_item);
				}else{
					this.$element.children().eq(dataObject.index).after(_item.$element);
					this.items.splice(dataObject.index,0,_item);	
				}
			}else if(dataObject.type==="remove"){
				this.$element.children().eq(dataObject.index).remove();				
			}else{
				this.$element.children().detach();
				this.onDataFetch(dataObject);
			}
		},
		makeUI: function(){
			this._extractRowTemplate();
			IUI.uiContainers.DataBoundContainer.prototype.makeUI.apply(this,arguments);
		},
		sort: function(sortObject){
			if(this.dataMart){
				this.dataMart.sort(sortObject);
				this._sortObject=sortObject;
			}
		},
		_handleSortClick: function(e){
			
				this._sortObject=this._sortObject || [];
			var sortDesc;
			
			if($(e.target).hasClass('sort-arrow-desc')){
				sortDesc=true;
			}else if($(e.target).hasClass('sort-arrow-asc')){
				sortDesc=false;
			}

			var _field=$(e.currentTarget).closest('th').data('field');

			if(e.currentTarget.sortDesc==sortDesc){	
				this._sortObject.splice(this._sortObject.indexOf(e.currentTarget.sortObject),1);
				e.currentTarget.sortObject=null;
				e.currentTarget.sortDesc=null;	
			}else{
				e.currentTarget.sortDesc=sortDesc;
				e.currentTarget.sortObject = e.currentTarget.sortObject || this._sortObject[this._sortObject.push({field:_field}) - 1];
				e.currentTarget.sortObject.desc=sortDesc;
			}
			
			this.sort(this._sortObject.slice());			
			
			
		},
		_attachEvents: function(){
			IUI.uiContainers.DataBoundContainer.prototype._attachEvents.apply(this,arguments);
			if(this.options.sortable){
				this.$element.on('click','.i-ui-sort-icon-container',this._handleSortClick.bind(this))
			}
		}
		
	});
	
	IUI.WidgetBuilder.plugin(Grid);


});
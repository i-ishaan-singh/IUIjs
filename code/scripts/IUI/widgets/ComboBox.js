(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','InputBox'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var InputBox=IUI.uiWidgets.InputBox,		
		Combobox=InputBox.extend({
			
			name:'Combobox',
			
			template: '<input tabindex="-1" class="i-ui-input"></input><div class="i-ui-dropbutton-container"><div class="i-ui-dropbutton"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div></div>',
			
			
			classList: IUI.Widget.prototype.classList.concat(['i-ui-combobox']),
			initialize: function(options){
				var _templateExtras='';
				if(options.datamart){
					$(options.element).removeAttr('datamart');
					_templateExtras=_templateExtras+' datamart="'+options.datamart+'" ';
					delete options.datamart;
				}
				if(options.data){
					$(options.element).removeAttr('data');
					_templateExtras=_templateExtras+' data="'+options.data+'" ';
					delete options.data;
				}
				
				this.tagTemplate ='<listview class="i-ui-dropdown-list" '+_templateExtras+'><division class="i-ui-option-item" ii-id="::'+(options.idfield||this.options.idfield)+'::">::'+(options.textfield||this.options.textfield)+'::</division></listview>'
				InputBox.prototype.initialize.apply(this,arguments);		
			},
			_createPopup:function(){
				var _elem=this.$element;
				this.popup=IUI.createOverlay({
					anchor: this.element,
					contents: this.tagTemplate,
					model: this.options.model,
					button: this.element.querySelector('.i-ui-dropbutton-container'),
					maxHeight: '15em',
					height: '15em',
					pointeropening: 'center',
					opening: function(){
						_elem.addClass('i-ui-active');
					},
					close: function(){
						_elem.removeClass('i-ui-active');
					}							
				});
			},
			onRender: function(){	
				this._createPopup();
			},
			options:{
				idfield: 'id',
				textfield: 'text',
			},
			_getDataMart: function(){
				return this.popup.contents.widgets[0].dataMart;
			},
			_attachEvents: function(){
				var that=this;
				InputBox.prototype._attachEvents.apply(this,arguments);
				this.popup._initPromise.then(function(){
					
					$(that.popup.element).on('click','.i-ui-list-item',function(e){
						var index=$(e.currentTarget).index(),
							dataMart=that._getDataMart();
						if(dataMart){
							that.value(dataMart.data[index][that.options.textfield]);
							that.trigger('change',{value:dataMart.data[index]});
						}
					});
				});
			},
		});
	
	IUI.WidgetBuilder.plugin(Combobox);


});
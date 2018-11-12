define(['../IUI-core.js','./InputBox.js'],function(IUI){

	var InputBox=IUI.uiWidgets.InputBox,		
		DropDown=InputBox.extend({
			
			name:'DropDown',
			
			template: '<input class="i-ui-input"></input><div class="i-ui-dropbutton-container"><div class="i-ui-dropbutton"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div></div>',
			
			classList: IUI.Widget.prototype.classList.concat(['i-ui-dropdown']),
			initialize: function(options){
				var textAttribute=this.options.textAttribute, idAttribute=this.options.idAttribute;
				if(options.element){
					var _data=[];
					$(options.element).find('option').each(function(idx,elem){
						var obj={}
							obj[textAttribute]=elem.innerHTML;
							obj[idAttribute]=elem.id;
						_data.push(obj);
					});
					options.data=_data;
				}
				InputBox.prototype.initialize.apply(this,arguments);		
			},
			_createPopup:function(){
					var textAttribute=this.options.textAttribute, idAttribute=this.options.idAttribute;
					this.popup=IUI.createOverlay({
						anchor: this.element,
						contents: this.options.data.map(function(_data,idx){
							var elem=document.createElement('div');
							elem.classList.add('i-ui-list-item');
							if(_data[idAttribute]){
								elem.id=_data[idAttribute];
							}
							elem.innerHTML=_data[textAttribute];
							elem._uiDataIndex=idx;
							return elem;
						}),
						button: this.element.children[1],
						height: (2*this.options.data.length)+'em'
					});
			},
			onRender: function(){
				this._createPopup();
			},
			options: {
				data:[],				
				textAttribute: 'text',
				idAttribute: 'id'
			},
			_attachEvents: function(){
				var that=this;
				InputBox.prototype._attachEvents.apply(this,arguments);
				$(this.popup.element).on('click','.i-ui-list-item',function(e){
					var index=e.currentTarget._uiDataIndex;
					if(typeof index !== "undefined"){
						that.value(that.options.data[index][that.options.textAttribute]);
						that.trigger('change',{value:that.options.data[index] });
					}
				}.bind(this));
			},
		});
	
	IUI.WidgetBuilder.plugin(DropDown);


});
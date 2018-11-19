define(['IUI-core','InputBox'],function(IUI){

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
			_createPopup:function(data){
					var textAttribute=this.options.textAttribute, idAttribute=this.options.idAttribute;
					
					var dataMapper=function(_data,idx){
						var elem=document.createElement('div');
						$(elem).addClass('i-ui-list-item');
						if(_data[idAttribute]){
							elem.id=_data[idAttribute];
						}
						elem.innerHTML=_data[textAttribute];
						elem._uiDataIndex=idx;
						return elem;
					}
					
					if(this.popup){
						this.popup.setContents(data.map(dataMapper))
						this.popup.options.animateObjectOpen.height=2*data.length+'em'
					}else{
						this.popup=IUI.createOverlay({
							anchor: this.element,
							contents: data.map(dataMapper),
							button: this.element.children[1],
							height: (2*this.options.data.length)+'em'
						});
					}
			},
			onDataFetch: function(e){
				var data=e.data;
				this._createPopup(data);
				this.options.data=data;
			},
			onRender: function(){
				this._createPopup(this.options.data);
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
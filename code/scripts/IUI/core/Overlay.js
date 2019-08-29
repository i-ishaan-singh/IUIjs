(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var overlayContainer,overlayUid=1;
		overlayContainer=document.createElement('DIV');
		$(overlayContainer).addClass('i-ui-overlay-container');
		document.body.appendChild(overlayContainer);
		
		
	var Overlay=IUI.Class.extend({
		classType: 'Overlay',
		classList: ['i-ui-overlay','i-ui-hidden'],
		initialize: function(options){
			var that=this;
			that._initPromise = $.Deferred();
			IUI.Class.prototype.initialize.apply(this,arguments);		
			this._uid='_uid'+(overlayUid++);
			this.hide=this.hide.bind(this);
			this.open=this.open.bind(this);
			this.close=this.close.bind(this);
			this.options.animateObjectOpen.height=this.options.height || this.options.animateObjectOpen.height;
			this.contents=this.options.contents;
			this._initialPopupStyle=IUI.behaviors.filterStyleFromObject(this.options);
			this._initialPopupStyle.height=0;
			this._initialPopupStyle.display='block';
			this.options.animateObjectClose.height=this.options.animateObjectClose.height || 0;
			if(typeof this._initialPopupStyle.width === "undefined" ){
					this._anchorWidth=true;
			}
			this.clientRectSet=!!this.options.clientrectangle;
			
			setTimeout(function(){
				that.createOverlay();
				that._attachEvents();
				that._initPromise.resolve();
				delete that._initPromise;
			});	
		},
		events: ['opening','open','close','closing'],
		options:{
			lazy: false,
			anchor:'body',
			direction: 'down',
			placement: 'bottom',
			classList:[],
			button: null,
			buttonBehavior: 'click',
			animateObjectClose:{},
			animateObjectOpen:{},
			autoclose: true,
			clientrectangle: null,
			pointeropening: null
		},
		setClientRectangle: function(clientrectangle){
			this.options.clientrectangle=clientrectangle
			this.clientRectSet=!!clientrectangle;
			
		},
		_processInitialPopupStyle:function(){
			
			if(this.clientRectSet){
				_rect=this.options.clientrectangle;
			}else{
				var $anchor=$(this.options.anchor);
				if($anchor.length===0) $anchor=$('body');
				var _anchor=$anchor[0], _rect=_anchor.getClientRects();
			}
			
			var direction=this.options.direction;
			
			if(_rect.length){
				var rect=_rect[0];
				var placements=this.options.placement.split(' ');
				var _placeVertical = placements[0] || 'center';
				var _placeHorizontal = placements[1] || 'center';
					if(_placeVertical==="top"){
						if(direction==='down'){
							this._initialPopupStyle.top=rect.top;
						}else{
							this._initialPopupStyle.bottom=$(window).innerHeight()	-  rect.top;
						}
					}else if(_placeVertical==="bottom"){
						if(direction==='down'){
							this._initialPopupStyle.top=rect.bottom;
						}else{
							this._initialPopupStyle.bottom=$(window).innerHeight()	 - rect.bottom;
						}						
					}else if(_placeVertical==="center"){
						if(direction==='down'){
							this._initialPopupStyle.top=rect.top - rect.width/2;
						}else{
							this._initialPopupStyle.bottom=rect.top - rect.width/2;
						}						
					}else{
						this._initialPopupStyle.left=_placeVertical;
					}
					
					if(!this.options.width){
						this._initialPopupStyle.width=rect.width-2;
					}

					
					if(_placeHorizontal === "right"){
						this._initialPopupStyle.left=rect.right;
					}else if(_placeHorizontal === "left"){
						this._initialPopupStyle.right=$(window).innerWidth() - rect.left;
					}else if(_placeHorizontal === "center"){
						this._initialPopupStyle.left=rect.left + rect.width/2;
					}else{
						this._initialPopupStyle.left=_placeHorizontal;
					}
					
					if(this.options.pointeropening){
						if(this.options.pointeropening === "flip"){
							
								if(_placeHorizontal === "left"){
								this._initialPopupStyle.right = this._initialPopupStyle.right - this._initialPopupStyle.width;
							}else if(_placeHorizontal === "center"){
								this._initialPopupStyle.left = this._initialPopupStyle.left - this._initialPopupStyle.width;
							}
							
						}else if(this.options.pointeropening === "center"){
							
							if(_placeHorizontal === "left"){
								this._initialPopupStyle.right = this._initialPopupStyle.right - this._initialPopupStyle.width/2;
							}else if(_placeHorizontal === "center"){
								this._initialPopupStyle.left = this._initialPopupStyle.left - this._initialPopupStyle.width/2;
							}
							
						}
					
						
					}
			}	
		},
		bindButton: function(button,behavior){
			var $button=$(button)
			if($button.length){
				var events;
				if(behavior==='click'){
					events='click';
				}else if(behavior==='hover'){
					events='mouseover';
				}
				$button.on(events,this.open);
			}
		},
		open: function(){
			if(this._popupOpen){
				return;
			}
			this._processInitialPopupStyle();
			$(this.element).css(this._initialPopupStyle);
			if(!this._isAttached){
				$(overlayContainer).append(this.element);
				this._isAttached=true;
			}
			this.show();
			this._popupOpen=true;
			this.trigger('opening');
			$(this.element).animate(this.options.animateObjectOpen,300,function(){
				this.trigger('open');
				if(this.options.autoclose){
					$('html').off('mouseup.'+this._uid);
					$('html').one('mouseup.'+this._uid,this.close);
				}
			}.bind(this));
			
			if(!this.options.animateObjectOpen.height){
				$(this.element).animate({
					height: this.element.scrollHeight
				},300)
			}
			
		},
		show: function(){
			$(this.element).removeClass('i-ui-hidden');
		},
		hide: function(){
			$(this.element).addClass('i-ui-hidden');
		},
		closeImmediate: function(e){
			if(!this._popupOpen || (e && $(e.target).is(this.element))){
				$('html').off('mouseup.'+this._uid);
				$('html').one('mouseup.'+this._uid,this.close);
				return;
			}
			this.trigger('closing');
			$(this.element).css(this.options.animateObjectClose);
			this.trigger('close');
			this.hide();
			this._popupOpen=false;
		},
		close: function(e){
			if(!this._popupOpen || (e && $(e.target).is(this.element))){
				$('html').off('mouseup.'+this._uid);
				$('html').one('mouseup.'+this._uid,this.close);
				return;
			}
			var that=this;
			this.trigger('closing');
			$(this.element).animate(this.options.animateObjectClose,300,function(){
				that.trigger('close');
				that.hide();
				that._popupOpen=false;
			});
		},
		setContents: function(contents){
			this.contents=contents;
			var _element=$(this.contents).detach();
			this.element.innerHTML=''
			_element.appendTo(this.element);
			
		},
		_attachEvents:function(){
			this.bindButton(this.options.button,this.options.buttonBehavior);
			
		},
		createOverlay: function(){
			this.element=document.createElement('DIV');
			if(this.contents){
				$(this.contents).before($('<span class="ghost-span">'));
				var _element=$(this.contents).detach();
				_element.appendTo(this.element);
				this.contents = IUI.makeUI(this.element, this.options.model);
			}
			$(this.element).addClass(this.classList.concat(this.options.classlist));
			this.element.uiOverlay=this;
			this.height=this.options.height;
			if(!this.options.lazy){
				$(overlayContainer).append(this.element);
				this._isAttached=true;
			}
		}		
	});
	
	
	IUI.createOverlay=function(options){
		return new Overlay(options);
	}


});
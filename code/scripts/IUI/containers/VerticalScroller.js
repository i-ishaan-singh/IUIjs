(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var VerticalScroller=IUI.uiContainers.Container.extend({
		name:'VerticalScroller',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-verticalscroller']),
		options: {
			height: '15rem',
			autohide: true,
			scrollinside:false,
			nativescrollbar: false,
		},
		load: function(options){
			IUI.uiContainers.Container.prototype.load.apply(this,arguments);
			(options.autohide) && (options.autohide=JSON.parse(options.autohide));
			(options.nativescrollbar) && (options.nativescrollbar=JSON.parse(options.nativescrollbar));
			(options.scrollinside) && (options.scrollinside=JSON.parse(options.scrollinside));
			
		},
		_beforeRender: function(){
		},
		_handlerWrapperMouseover: function(){
			this.downArrow.css({
				display: 'block'
			});
			this.upArrow.css({
				display: 'block'
			});
			
			
			
			this.downArrow.animate({
				opacity: 1,
				bottom: -this.downArrowOffset
			},50);
			
			this.upArrow.animate({
				opacity: 1,
				top: -this.upArrowOffset
			},50);
		},
		_handlerWrapperMouseout: function(e){
			if($.contains(e.currentTarget,e.relatedTarget)){
				return;
			}
			var that=this;
			this.downArrow.animate({
				opacity: 0,
				bottom: 0
			},50,function(){
				that.downArrow.css({
					display: 'none'
				});
			});
			
			this.upArrow.animate({
				opacity: 0,
				top: 0
			},50,function(){
				that.upArrow.css({
					display: 'none'
				});
			});
		},
		_handleScrollUp: function(e){
			var that=this;
			
			this._scrollInterval=setInterval(function(){
				var _val=that.element.scrollTop;
				that.element.scrollTop=_val-5;
				if(that.element.scrollTop===0){
					clearInterval(that._scrollInterval);
				}
			},50);
		},
		_handleScrollDown: function(e){
			var that=this;
			
			this._scrollInterval=setInterval(function(){
				var _val=that.element.scrollTop;
				that.element.scrollTop=_val+5;
				if(that.element.scrollTop===_val){
					clearInterval(that._scrollInterval);
				}
			},50);
						
		},
		_handleScrollEnd: function(e){
			clearInterval(this._scrollInterval);
		},
		_afterRender: function(){
			this.wrapper=this.$element.wrap('<div class="i-ui-scroller-wrapper">').parent();			
			if(this.options.nativescrollbar){
				this.$element.css({'overflow-y':'auto'})
				return;
				
			}
			
			this.upArrow=$('<div class="i-ui-scroller-up-arrow"><i class="i-ui-widget-icon fa fa-caret-up" aria-hidden="true"></i></div>').css({position: 'absolute'});
			this.downArrow=$('<div class="i-ui-scroller-down-arrow"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div>').css({position: 'absolute'});
			this.wrapper.prepend(this.upArrow);
			this.wrapper.append(this.downArrow);
			
			
			if(this.options.autohide){
				this.upArrow.css({
					opacity: 0,
					top: 0,
					display: 'none'
					
				});
				this.downArrow.css({
					opacity: 0,
					bottom: 0,
					display: 'none'
				})
				this.wrapper.on('mouseover.verticalscroller',this._handlerWrapperMouseover.bind(this));
				this.wrapper.on('mouseout.verticalscroller',this._handlerWrapperMouseout.bind(this));
			}
			
			
			if(this.options.scrollinside){
				this.wrapper.addClass('i-ui-inset-scrollable');
				this.downArrowOffset=0;
				this.upArrowOffset=0;
			}else{
				this.downArrowOffset=this.downArrow.height();
				this.upArrowOffset=this.upArrow.height();
			}
			
			
			this.upArrow.on('mouseover.verticalscroller',this._handleScrollUp.bind(this));
			this.upArrow.on('mouseout.verticalscroller',this._handleScrollEnd.bind(this));
			this.downArrow.on('mouseover.verticalscroller',this._handleScrollDown.bind(this));
			this.downArrow.on('mouseout.verticalscroller',this._handleScrollEnd.bind(this));
			
			
			
			
			
		}
		
	});
	
	IUI.WidgetBuilder.plugin(VerticalScroller);


});
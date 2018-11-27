define(['IUI-core','Widget'],function(IUI){

	var Slider=IUI.Widget.extend({
		name:'Slider',
		template: '<div class="i-ui-slider-bar"></div><div class="i-ui-slider-button"></div>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-slider']),
		events:IUI.Widget.prototype.events.concat(['change']),
		options:{
			min: 0,
			max: 255,
			value: 0,
			step: 1
		},
		load: function(options){
			(options.min) && (options.min=Number(options.min));
			(options.max) && (options.max=Number(options.max));
			(options.step) && (options.step=Number(options.step));
			
		},
		initialize: function(){
			IUI.Widget.prototype.initialize.apply(this,arguments);		
			this.button=this.$element.find('.i-ui-slider-button');
			this.sliderY=0;
			this._attachEvents();
		},
		_handleMouseDown: function(e){
			this.buttonWidth=this.button.outerWidth();
			this.sliderWidth=this.$element.width();
			this.elementMinX=this.element.offsetLeft;
			this.$element.addClass('i-ui-active');
			this.elementMaxX=this.elementMinX+this.element.offsetWidth;
			if(!this._sliding){
				this._sliding=true;
				$('body').on('mousemove.slider',this._handleMouseMove.bind(this));
				$('body').on('mouseup.slider',this._handleMouseUp.bind(this));
			}		
		},
		_handleMouseMove: function(e){			
			var that=this;
			
			if(this._mouseExceedCondition) return;
			
			var actualMovement=(this.sliderWidth-this.buttonWidth), movementRatio=(actualMovement/this.sliderWidth), movementX=e.originalEvent.movementX, actualValues=(this.options.max-this.options.min) ;
			
			var deltaValue=(movementX/this.sliderWidth)*actualValues;
			
			
			this.sliderY=this.sliderY+movementX;
			var value=Math.floor(((this.sliderY-(this.buttonWidth/2))/actualMovement)*actualValues);;
			if(value<this.options.min){
				value=this.options.min;
			}else if(value>this.options.max){
				value=this.options.max;
			}
			this.options.value=value;
			console.log(this.options.value);
			
			if(this.sliderY>(this.sliderWidth - Math.floor(this.buttonWidth/2))){
				this.sliderY=(this.sliderWidth - this.buttonWidth/2);
				this.$element.one('mouseover.slider','.i-ui-slider-button',function(){
					that._mouseExceedCondition=false;
				});
				this._mouseExceedCondition=true;
			}
			if(this.sliderY<Math.floor(this.buttonWidth/2)){
				this.sliderY=this.buttonWidth/2;
				this._mouseExceedCondition=true;
				this.$element.one('mouseover.slider','.i-ui-slider-button',function(){
					that._mouseExceedCondition=false;
				});
			}
			$(this.button).css('left',this.sliderY);			
		},
		_handleMouseUp: function(e){
			if(this._sliding){
				this._sliding=false;
				$('body').off('mousemove.slider');				
				$('body').off('mouseup.slider');
				this.$element.removeClass('i-ui-active');
			}
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('mousedown','.i-ui-slider-button',this._handleMouseDown.bind(this));
			this.$element.on('mouseup.slider','.i-ui-slider-button',this._handleMouseUp.bind(this));
			
		},
		value: function(val){
			if(typeof val === "undefined"){
				return this.$element.hasClass('i-ui-slider-active');
			}else{
				this.$element.toggleClass('i-ui-slider-active',val);				
			}
		}
	});
	
	IUI.WidgetBuilder.plugin(Slider);


});
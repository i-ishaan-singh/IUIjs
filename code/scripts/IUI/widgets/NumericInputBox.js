define(['IUI-core','InputBox'],function(IUI){

	var InputBox=IUI.uiWidgets.InputBox,
		SPINNERS_SELECTOR=".i-ui-spinner",		
		NumericInputBox=InputBox.extend({
			
			name:'NumericInputBox',
			
			template: '<input class="i-ui-input"></input><div class="i-ui-spinner-container"><div class="i-ui-spinner i-ui-spinner-up"><i class="i-ui-widget-icon fa fa-caret-up" aria-hidden="true"></i></div><div class="i-ui-spinner i-ui-spinner-down"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div></div>',
			
			classList: IUI.Widget.prototype.classList.concat(['i-ui-numericinputbox']),
			
			validationList: ['numeric'],
			
			initialize: function(){
				this._handleSpinStart=this._handleSpinStart.bind(this);	
				this._handleSpinEnd=this._handleSpinEnd.bind(this);		
				InputBox.prototype.initialize.apply(this,arguments);
				this.step=Number(this.options.step);				
			},
			
			events: InputBox.prototype.events.concat(['spin']),
			
			options: {
				step: 1,
				value: 0,
				decimal: false,
				precision:2
			},			
			_handleSpinStart: function(e){
				var that=this, step=this.step;
				
				if($(e.currentTarget).hasClass('i-ui-spinner-down')){
					step=-step;
				}				
				$(this.element).addClass('i-ui-active');
				if(this._interval){
					clearInterval(this._interval);
					delete this._interval;
				}
				this._interval=setInterval(function(){
					var value;
					value=that._formatNumber(Number(that.input.val())+step);
					that.input.val(value);
					that.trigger('spin',{value:value});
				},50);
			},
			_formatNumber: function(val){
				if(this.options.decimal){
					val=(val).toFixed(this.options.precision);
				}else{
					val=parseInt(val);
				}
				return val;
			},
			_handleSpinEnd:function(e){
				if(this._interval){
					clearInterval(this._interval);
					this.trigger('change',{value:Number(this.input.val())});
					this._value=this.input.val();
					this.$element.removeClass('i-ui-active');
					delete this._interval;
				}				
			},
			_attachEvents: function(){
				InputBox.prototype._attachEvents.apply(this,arguments);	
				this.$element.on('mousedown',SPINNERS_SELECTOR,this._handleSpinStart);
				this.$element.on('mouseup mouseleave',SPINNERS_SELECTOR ,this._handleSpinEnd);
			},
			value: function(val){
				if(typeof val !== "undefined"){
					val=this._formatNumber(Number(val));
				}				
				return  Number(InputBox.prototype.value.call(this,val));
			}
		});
	
	IUI.WidgetBuilder.plugin(NumericInputBox);


});
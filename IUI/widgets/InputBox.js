define(['../IUI-core.js','../core/Widget.js'],function(IUI){

	var InputBox=IUI.Widget.extend({
		name:'InputBox',
		template: '<input class="i-ui-input"></input>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-inputbox']),
		events:IUI.Widget.prototype.events.concat(['change']),
		_value:'',
		options:{
			validateoninput: true,
			validateonblur: true
		},
		load: function(options){
			(options.validateoninput) && (options.validateoninput=JSON.parse(options.validateoninput));
			(options.validateonblur) && (options.validateonblur=JSON.parse(options.validateonblur));
		},
		onInitialize: function(){
			
			this._attachEvents();
			this.value(this.options.value);
		},
		onTemplateAttach:function(wrapper){
			this.input=$(wrapper.children[0]);
		},
		_attachEvents: function(){
			var that=this;
			if(this.options.validateoninput){
				$(this.input).on('input',function(e){
					if(!that.validate(e.target.value).valid){
						e.target.value=that._value;
						e.stopImmediatePropagation();
						e.preventDefault();
						return false;
					}else{
						that._value=e.target.value;
					}
				});
			}
			if(this.options.validateonblur){
				$(this.input).on('change',function(e){
					if(!that.validate(e.target.value).valid){
						e.target.value=that._value;
						e.stopImmediatePropagation();
						e.preventDefault();
						return false;
					}else{
						that._value=e.target.value;
					}
				});
			}
			$(this.input).on('change',IUI.behaviors.delegateDOMEvent.bind(this));
		},
		value: function(val){
			if(typeof val !== 'undefined' && this.validate(val).valid){
				this._value=val;
				return this.input.val(val);
			}
			return this.input.val();
		}
	});
	
	IUI.WidgetBuilder.plugin(InputBox);


});
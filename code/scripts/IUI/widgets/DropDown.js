define(['IUI-core','DropDown'],function(IUI){

	var Combobox=IUI.uiWidgets.Combobox,		
		DropDown=Combobox.extend({
			name:'DropDown',
			classList: IUI.Widget.prototype.classList.concat(['i-ui-dropdown']),
			template: '<input tabindex="-1" class="i-ui-input" style="display:none;"><div tabindex="-1" class="i-ui-input i-ui-display"></div><div class="i-ui-dropbutton-container"><div class="i-ui-dropbutton"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div></div>',
			_handlevalueChange: function(value){
				IUI.Widget.prototype._handlevalueChange.apply(this,arguments);
				
			}
			,value: function(val){
				if(typeof val !== 'undefined'){	// && this._validate(val).valid
					this.options.value=val;
					this.element.querySelector('.i-ui-display').innerText=val;
					return this.input.val(val);
				}
				return this.input.val();
			}

		});
	
	IUI.WidgetBuilder.plugin(DropDown);


});
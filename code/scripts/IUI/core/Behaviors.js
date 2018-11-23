define(['IUI-core','Template'],function(IUI){

	var behaviors={};
	
	behaviors.delegateDOMEvent=function(e){
		var obj={originalEvent:e};
		if(this.value){
			obj.value=this.value()
		}
		obj.target=this;
		this.trigger(e.type,obj);
	}
	
	behaviors.extractStyleFromObject=function(element,object){
		object.style={}
		for(var attr in object){
			if(attr in element.style){					//Need to make efficient
				element.style[attr]=object[attr];
				object.style[attr]=object[attr];
				delete object[attr];
			}
		}	
	}
	
	behaviors.getObservableMapping=function(object){
		var _matchedObservers=[],templateObject;
		for(var attr in object){
			if(typeof object[attr] === "string"){	
					var templateObject=IUI.Template.extractTemplateObject(object[attr]);
					if(templateObject.mappings){
						templateObject.optionAttribute=attr;
						//console.log(templateObject)
						_matchedObservers.push(templateObject);
					}
				}
			}
		
		return _matchedObservers;	
	}
	
	behaviors.filterStyleFromObject=function(object){
		var _obj={};
		for(var attr in object){
			if(attr in document.body.style){
				_obj[attr]=object[attr];
			}
		}
		return _obj;		
	}
	
	IUI.behaviors=behaviors;

});
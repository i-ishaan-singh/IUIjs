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
		for(var attr in object){
			if(attr in element.style){					//Need to make efficient
				element.style[attr]=object[attr];
			}
		}	
	}
	
	var extractionMap={
		
		style: function(element,attr,value){
			if(attr in element.style){					//Need to make efficient
					element.style[attr]=value;
			}
		},
		'ii-attibute': function(element,attr,value){
			if(attr.match(IUI.iiAttributeRegex)){
				$(element).attr(attr,value);
			}
		},
		'subconatiner-attribute': function(element,attr,value,object){
			(object.subcontainerOptions) || (object.subcontainerOptions={});
			if(attr.match(IUI.subcontainerRegex)){
				object.subcontainerOptions[attr.slice(13)]=value;
				//delete object[attr];
			}
		},
		
		
	}
	
	
	behaviors.extractFromObject=function(element,object,list){
		for(var attr in object){
			for(var item in list){
				extractionMap[list[item]](element,attr,object[attr],object);
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
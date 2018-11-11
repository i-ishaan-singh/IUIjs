define(['../IUI-core.js'],function(IUI){

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
			if(element.style.hasOwnProperty(attr)){
				element.style[attr]=object[attr];
			}
		}	
	}
	
	behaviors.filterStyleFromObject=function(object){
		var _obj={};
		for(var attr in object){
			if(document.body.style.hasOwnProperty(attr)){
				_obj[attr]=object[attr];
			}
		}
		return _obj;		
	}
	
	IUI.behaviors=behaviors;

});
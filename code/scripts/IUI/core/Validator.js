(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var validator;
	
	Validator=function Validator(){
		this._validationRules={}
	}
	
	Validator.prototype.addRule=function addRule(rule,handler){
		if(typeof this._validationRules[rule] === 'undefined'){
			this._validationRules[rule]=[];
		}
		this._validationRules[rule].push(handler);
	}
	
	Validator.prototype.validate=function validateByRule(rule,object){
		var length, valid=true;
		if(typeof this._validationRules[rule] !== 'undefined'){
			length=this._validationRules[rule].length;
			for(var i=0;i<length;++i){
				valid = valid && this._validationRules[rule][i](object);
			}
		}
		return valid;
	}
	
	
	validator=new Validator();
	Validator._validationRules=validator._validationRules;
	Validator.addRule=validator.addRule;
	Validator.validate=validator.validate;
	
	IUI.Validator=Validator;
	
});
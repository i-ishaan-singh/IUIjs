define(['../IUI-core.js','../core/Widget.js'],function(IUI){

	var validator;
	
	Validator=function Validator(){
		return validator;
	}
	
	Validator.prototype._validationRules={}
	
	Validator.prototype.addRule=function addRule(rule,handler){
		if(typeof this._validationRules[rule] === 'undefined'){
			this._validationRules[rule]=[];
		}
		this._validationRules[rule].push(handler);
	}
	
	Validator.prototype.validate=function validateByRule(rule,object){
		if(typeof this._validationRules[rule] !== 'undefined'){
			var length=this._validationRules[rule].length, valid=true;
			for(var i=0;i<length;++i){
				valid = valid && this._validationRules[rule][i](object);
			}
			return valid;
		}
	}
	
	
	validator=new Validator();
	
	
	IUI.Validator=validator;
	
});
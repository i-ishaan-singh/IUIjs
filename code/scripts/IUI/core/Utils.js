(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core'],factory);
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var _utilities={}
	
	IUI.registerUtil = function(name, handler){
		Object.defineProperty(_utilities, name,{
			value: handler,
			writable: false
		});	
	}
	
	IUI.utils=_utilities;

});
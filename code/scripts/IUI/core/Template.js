define(['IUI-core'],function(IUI){

	var _templateToFunctionWrapper=function(key,index,str){
		var _key=key.slice(2,-2);		
		return (index?'"+':'')+'(function(){ return '+_key+' })()'+((index+key.length===str.length)?'':'+"');
	}
	
	
	
	var Template=function Template(){
		
	};
	
	Template.render=function(template,object,options){
		var _string="";
		if(options && options.attrString){
			_string=options.attrString;
		}else{			
			for(var attr in object){
				_string=_string+'var '+attr+'=model.'+attr+'; ';			
			}			
		}
		_string='(function(model){ '+_string+' return '+template+'; })';
		return (eval(_string))(IUI.deepExtend(object));
		
	}
	
	
	Template.extractTemplateObject=function(string){
			var _matches=string.match(IUI._observableRegex),_template,lastMatch,firstMatch,exclusive;
			string=string.trim();
				if(_matches && _matches.length>0){
					_template=string.replace(IUI._observableRegex,_templateToFunctionWrapper);
//.replace(/'/g,'\\\'').replace(/"/g,'\\"')
					lastMatch=_matches[_matches.length-1],
					firstMatch=_matches[0];
					_template=((string.indexOf(firstMatch)===0)?'':'"')+_template+((string.lastIndexOf(lastMatch)+lastMatch.length===string.length)?'':'"');
					exclusive=_matches[0].length==string.length;
					return { template:_template,mappings:_matches.map(function(elem){ return elem.slice(2,-2).trim(); }), isExclusive:exclusive };
		}
			return { template:string};
	
	}
	
	
	

	IUI.Template=Template;
});
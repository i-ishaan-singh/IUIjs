define(['./IUI-core.js'],function(IUI){

	IUI.makeUI=function makeUI(elem){
		(elem) || (elem='body')
		var uiContainer= new IUI.ContainerUI({
			element: elem
		});		
		uiContainer.makeUI();
		return uiContainer;
	}

	return IUI;

});
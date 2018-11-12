# IUI.js
##### version 1.0.0

IUI is a simple UI Widgets creation JavaScript library for creating UI faster. It aims at minimising the use of JavaScript in UI Creation and manupulation, giving more responsibility on HTML. IUI provides custom HTML tags which can be directly embeded anywhere in the template. IUI requires *JQuery* to function.



## Basic Usage
	
Custom tags provided by IUI can be directly inserted in HTML. All the attributes of the tag will be passed as *options* to to the IUI Component which is created.

By calling the **IUI.makeUI()** API, the given template will be rendered in into the desired UI with IUI Components attached. The styling attributes for the widget can be directly passed as attributes to the IUI custom tag which will be appended to inline style. 
This API return an object of Container which is further discussed below.

##### HTML:
```HTML
<body>
  ...
	<Widget id="new-widget" class="widget-class" 
		height="3rem" width="4rem" background-color="black" 
		border-radius="0.5em">
	</Widget>
  ...
</body>
```

##### HTML:
```javascript
var container=IUI.makeUI();
```

##### Output:
```HTML
<body class="i-ui-container">
  ...
	<div class="i-ui-widget widget-class" id="new-widget" 
	     style="height: 3rem; width: 4rem; background-color: black; border-radius: 0.5em;">
	</div>
  ...
</body>
```


## IUI.makeUI API

This API renderes the given Object and returns an Container Object.
**Usage:** 
```javascript
...
	IUI.makeUI(Object);
...
```
Where **Object** can be:
* **Element | JQuery** - Javascript Element or JQuery Object of the parent Element containing the IUI custom tags. The given will be converted to Container Object which is returned. If JQuery Object contains more than one element, then the elements are wrapped in a *div* which is returned as Container Object.

* **TemplateString** -  Template String containing the IUI custom tags which needs to be rendered. Passing single widget in the TemplateString will not render the widget as it will be considered as Container.

* **[Element|JQuery|WidgetString]** - If a single widget needs to be rendered, the Element, JQuery Object or its String should be passed enclosed in an Array.
	
	
	
## UI Components
Components are the objects which can be created using IUI. 
Components can bind to and trigger events. The events can be bounded with the Component during component creation or can be created and bind separately using EventGroup.

There are Three basic types of Components which can be created using IUI:
1. **Widget**
2. **Container**
3. **Overlay**
	
## Widget

Widgets are IUI Component which are first rendered in javascript and then attached to the DOM to reduce reflow and allow faster UI Creation. The name of the Widget is same as it's TagName. Widgets can be extended to create new Widgets with properties of old Widget and extended properties.

Widgets can be indentified bu class *i-ui-widget* and can be accessed by uiWidget attribute of it's Elemenet Object.

The basic **APIs** Provided by Widget are:
* **enable( *{Boolean}* )** - enabled or disables the Widget. 

Handler to Events can be provided as attribute to Widget with same name as the event. The handlers can be of type:


##### HTML:
```HTML
  ...
	<Widget event="function(e){ ... }"></Widget>
	<Widget event="WindowFunction()"></Widget>
	<Widget event="console.log(e)"></Widget>
	<Widget event="WindowFunctionReference"></Widget>
  ...
```


#### Types Of Widgets:
* **FormLabel**
* **InputBox**
* **NumericInputBox**
* **DropDown**
* **ComboBox**
* **Button**
* **ToggleButton**
* **SubmitButton**
* **Radio**

### FormLabel

It is used to create a basic label which can be placed in Form for Widgets or inputs. The text can be set using both attribute or as content of FormLabel.
The text can also be a HTML which will be rendered inside the FormLabel.

The basic *options** which can be passed to FormLabel are:
* **text** *{String}* - Text to be displayed as label or HTML String.

##### HTML:
```HTML
<FormLabel text="Name"></FormLabel>
<FormLabel>Age</FormLabel>
```


### InputBox

It is used to create a basic input box, which can be used to take input from user.

**Events :** change

The basic **options** which can be passed to InputBox are:
* **value** *{String}* - initial value for InputBox
* **formAttribute** *{String}* - JSON attribute for value of Form

The basic **APIs** Provided by InputBox are:
* **value( *{ undefined | value }* )** - If the value is passed, this API sets the value to the InputBox. If nothing is passed it returns the current Value.

##### HTML:
```HTML
<InputBox value="initialValue" change="function(e){ console.log(e.value) }"></InputBox>
```


### NumericInputBox

NumericInputBox is an extension to InputBox. It is used to create a input box with attached spinners. It can input both Integer and Decimal numbers.

**Events :** change, spin

The basic **options** which can be passed to NumericInputBox are:
* **step** *{Number}* - (default:1) Value with which the spinner should increase/decrease the current value
* **decimal** *{true|false}* - (default:false) Is the Number Integer or decimal(floating).
* **precision** *{Integer}* - (default:2) Precision for decimal numbers

##### HTML:
```HTML
<NumericInputBox value="3.14159" precision="5" step="0.00001" 
		 change="function(e){ console.log(e.value) }" 
		 spin="console.log(e.value)">
</NumericInputBox>
```


### DropDown

DropDown is an extension to InputBox. It is used to create a Basic DropDown using the Data given in <option> tag as Widget Children. Dropdown doesn't allow custom data to be entered as it's value.

**Events :** change

The basic **options** which can be passed to DropDown are:
* **data** *{Array}* - It is used for rendering of the options in the DropDown when the widget is created. It is not passed as an attribute to IUI custom tag.
* **idAttribute** *{String}* - (default:'id') The id attribute from Object in data Array to be displayed in the popup. It can also be HTML. 
* **textAttribute** *{String}* - (default:'text') The text attribute from Object in data Array to be displayed in the popup. It can also be HTML. 

##### HTML:
```HTML
<DropDown>
	...
	<option id="dropdown-option-a-id">Option A</option>
	<option id="dropdown-option-b-id">Option B</option>
	...
</DropDown>
```



### ComboBox

**Events :** change

ComboBox is an extension to InputBox. It is used to create a Basic ComboBox using the Data given in <option> tag as Widget Children. ComboBox provides a dropdown list for values. It also allows custom data to be entered as it's value.

The basic **options** which can be passed to ComboBox are:
* **data** *{Array}* - It is used for rendering of the options in the ComboBox when the widget is created. It is not passed as an attribute to IUI custom tag.
* **idAttribute** *{String}* - (default:'id') The id attribute from Object in data Array to be displayed in the popup. It can also be HTML. 
* **textAttribute** *{String}* - (default:'text') The text attribute from Object in data Array to be displayed in the popup. It can also be HTML. 

##### HTML:
```HTML
<ComboBox>
	...
	<option id="cobobox-option-a-id">Option A</option>
	<option id="cobobox-option-b-id">Option B</option>
	...
</ComboBox>
```



### Button

It renderes a Clickable button widget.

**Events :** click

The basic **options** which can be passed to Button are:
* **text** *{String}* - Text to be displayed as label or HTML String.

##### HTML:
```HTML
<Button text="Click Me" click="console.log('button Clicked')"></Button>
<Button click="clickHandler">Click Me</Button>
```



### ToggleButton

It renderes a Togglable button widget.

**Events :** click, toggle

The basic **options** which can be passed to SubmitButton are:
* **text** *{String}* - Text to be displayed as label or HTML String.

The basic **APIs** Provided by ToggleButton are:
* **toggle( *{ undefined | Boolean }* )** - It is used to toggle the active state of the Toggle Button. Boolean can alse be passed to set the Toggle state.
* **value( *{ undefined | value }* )** - If the value is passed, this API sets the value to the ToggleButton. If nothing is passed it returns the current Value.

##### HTML:
```HTML
<ToggleButton text="Toggle Me" click="console.log('button Clicked')"></ToggleButton>
<ToggleButton toggle="toggleHandler">Toggle Me</ToggleButton>
```


### SubmitButton

It renderes a Clickable button widget. This button will submit the form in which it is contained.

**Events :** click

The basic **options** which can be passed to SubmitButton are:
* **text** *{String}* - Text to be displayed as label or HTML String.

##### HTML:
```HTML
<SubmitButton text="Submit Me" click="console.log('button Clicked')"></SubmitButton>
<SubmitButton click="clickHandler">Submit Me</SubmitButton>
```


### Radio

It is used to create a Radio button With a form label attached to it. It is generally used along with RadioGroup.

The basic *options** which can be passed to Radio are:
* **text** *{String}* - Text to be displayed as label or HTML String.
* **checked** *{true|false|'checked'}* - If this attriute is present, the radio will be selected.
* **group** *{String}* - The group of the radio Button.
* **value** *{String}* - The value of the radio Button.

The basic **APIs** Provided by Radio are:
* **checked( *{ undefined | Boolean }* )** - It is used to get the checked active state of the radio. Boolean value can alse be passed to set the checked state.
* **value( *{ undefined | value }* )** - If the value is passed, this API sets the value to the Radio. If nothing is passed it returns the current Value.

##### HTML:
```HTML
<Radio group="gender" value="1" text="male"></Radio>
<Radio group="gender" value="2" text="female" checked="checked"></Radio>
```

## Container

Containers are IUI Components which contains other Containers or Widgets. Containers are also rendered like widgets in which the attributes are passed as options to the Container, but unline Widgets the Container is not turned into div elements.

Every Container contains his own Widgets, therefore if There is nesting of Containers the parent Container will contain the Child container but not the widgets of the Child Container.

#### Types Of Containers:
* **Container**
* **Frame**
* **RadioGroup**
* **Form**

Angular Panels
================

Pure [AngularJS](http://www.angularjs.org) based Drag and Drop. 
[![ScreenShot](https://rawgit.com/eu81273/angular.dragndrop/gh-pages/images/preview.png)](http://eu81273.github.io/angular.dragndrop/)


## Demo

[http://eu81273.github.io/angular.dragndrop/](http://eu81273.github.io/angular.dragndrop/)



## Installation

Copy the script and css into your project and add a script and link tag to your page.

```html
<script type="text/javascript" src="angular.dragndrop.js"></script>
<link rel="stylesheet" type="text/css" href="angular.dragndrop.css">
```

And add dragndrop container tag to your application.

```html
<div data-dragndrop="true"></div>

```

Add a dependency to your application module and configure panel settings.

```javascript
var app = angular.module('myApp', ['angular.dragndrop']);

app.config(['dragndropProvider', function (dragndropProvider) {

	dragndropProvider
		.add({
			id: "testmenu",
			position: "right",
			size: "700px",
			templateUrl: "../resources/template/testmenu.html",
			controller: "testmenuCtrl"
		})
		.add({
			id: "testpanel",
			position: "right",
			size: "80%",
			templateUrl: "../resources/template/testpanel.html",
			controller: "testpanelCtrl",
			closeCallbackFunction: "testpanelClose"
		});
}]);

```

attributes are..

- id : panel's unique id.
- position : the side panel slides from top/right/bottom/left.
- size : panel's height or width. unit(px,em,%..) is required.
- templateUrl : panel template url.
- controller : panel's controller name.
- openCallbackFunction : panel open callback.
- closeCallbackFunction : panel close callback.


## Open panel

Opening panel also very simple. Inject dragndrop service to your app then call the service method like below.


```javascript
var app = angular.module('myApp', ['angular.dragndrop']);

app.config(['dragndropProvider', function (dragndropProvider) {

	dragndropProvider
		.add({
			id: "testmenu",
			position: "right",
			size: "700px",
			templateUrl: "../resources/template/testmenu.html",
			controller: "testmenuCtrl"
		});
}]);

app.controller('defaultController', function($scope, dragndrop) {

	//open testmenu panel
	dragndrop.open("testmenu");
});


app.controller('testmenuCtrl', function($scope) {

	//left panel controller

});

```

## Browser Compatibility

IE10+, Chrome, Safari

## Changelogs

#### version 1.0.0
- first release

## License

The MIT License.

Copyright ⓒ 2015 AHN JAE-HA.

See [LICENSE](https://github.com/eu81273/angular.dragndrop/blob/master/LICENSE)

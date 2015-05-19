/*
	Angular Dragndrop version 1.0.0
	ⓒ 2015 AHN JAE-HA http://github.com/eu81273/angular.dragndrop
	License: MIT
*/

(function () {
	"use strict";

	var module = angular.module("angular.dragndrop", []);

	module.constant("configurations", {
		"draggableClass": "",
		"droppableClass": ""
	});

	module.provider("dragndrop", ["configurations", function (configurations) {

		this.setDraggableClass = function (className) {
			configurations.draggableClass = className;
			//for chaining
			return this;
		};

		this.setDroppableClass = function (className) {
			configurations.droppableClass = className;
			//for chaining
			return this;
		};

		this.$get = function () {

			var element = {};

			var getElement = function (id) { 
				return element[id];
			};

			var setElement = function (id, object) {
				element[id] = object;
			};

			return {
				getElement : getElement,
				setElement : setElement
			}
		};
	}]);

	module.directive("draggable", ["$parse", "dragndrop", "configurations", function ($parse, dragndrop, configurations) {

		return function (scope, element, attrs) {

			var eventTarget = $parse(attrs.draggableModel || undefined, /* interceptorFn */ null, /* expensiveChecks */ true)(scope);
			var eventRestricted = attrs.restricted;
			var dragStartCallback = $parse(attrs.dragStartCallback || undefined, /* interceptorFn */ null, /* expensiveChecks */ true);
			var dragEndCallback = $parse(attrs.dragEndCallback || undefined, /* interceptorFn */ null, /* expensiveChecks */ true);

			//add draggable attribute
			element.attr("draggable", true);

			element.on("dragstart", function (event) {
				//save current event target
				dragndrop.setElement("eventTarget", eventTarget);
				//save current event target's restrict
				dragndrop.setElement("eventRestricted", eventRestricted);

				event.dataTransfer.effectAllowed = "copy";
				//for FireFox compatibility
				event.dataTransfer.setData("Text", "");

				element.addClass(configurations.draggableClass);
				//if type of dragStartCallback is function..
				typeof dragStartCallback == "function" && dragStartCallback(scope, {$event: {target:dragndrop.getElement("eventTarget"), targetType:dragndrop.getElement("eventRestricted")}});

				return false;
			});

			element.on("dragend", function (event) {
				element.removeClass(configurations.draggableClass);
				//if type of dragEndCallback is function..
				typeof dragEndCallback == "function" && dragEndCallback(scope, {$event: {target:dragndrop.getElement("eventTarget"), targetType:dragndrop.getElement("eventRestricted")}});

				return false;
			});
		}
	}]);

	module.directive("droppable", ["$parse", "dragndrop", "configurations", function($parse, dragndrop, configurations) {

		return function (scope, element, attrs) {

			var eventRestricted = attrs.restricted;
			var flagOriginalEvent = false, flagDuplicatedEvent = false;
			var dropCallback = $parse(attrs.dropCallback || undefined, /* interceptorFn */ null, /* expensiveChecks */ true);

			element.on("dragover", function (event) {

				if (eventRestricted == dragndrop.getElement("eventRestricted")) {
					//if not prevent default, then no drop event..
					event.preventDefault && event.preventDefault();
					event.dataTransfer.dropEffect = "copy";
				}

				return false;
			});

			element.on("dragenter", function (event) {

				if (eventRestricted == dragndrop.getElement("eventRestricted")) {
					if (flagOriginalEvent) {
						flagDuplicatedEvent = true;
					}
					else {
						flagOriginalEvent = true;
						//add droppable class
						element.addClass(configurations.droppableClass);
					}
				}

				return false;
			});

			element.on("dragleave", function (event) {

				if (eventRestricted == dragndrop.getElement("eventRestricted")) {
					if (flagDuplicatedEvent) {
						flagDuplicatedEvent = false;
					}
					else if (flagOriginalEvent) {
						flagOriginalEvent = false;
					}
					if (!flagOriginalEvent && !flagDuplicatedEvent) {
						//remove droppable class
						element.removeClass(configurations.droppableClass);
					}
				}

				return false;
			});

			element.on("drop", function (event) {

				if (eventRestricted == dragndrop.getElement("eventRestricted")) {
					event.preventDefault && event.preventDefault();
					event.stopPropagation && event.stopPropagation();

					//reset vars for duplicated event checking
					flagOriginalEvent = false, flagDuplicatedEvent = false;

					//remove droppable class
					element.removeClass(configurations.droppableClass);

					//if type of dragEndCallback is function..
					typeof dropCallback == "function" && dropCallback(scope, {$event: {target:dragndrop.getElement("eventTarget"), restricted:dragndrop.getElement("eventRestricted")}});
				}

				return false;
			});

		}
	}]);

})();


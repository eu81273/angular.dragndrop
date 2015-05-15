/*
	Angular Dragndrop version 1.0.0
	ⓒ 2015 AHN JAE-HA http://github.com/eu81273/angular.dragndrop
	License: MIT
*/

(function ( angular ) {
	"use strict";

	var module = angular.module( "angular.dragndrop", [] );

	//객체를 저장하는 서비스
	module.factory('elementStorage', function () {

		//엘리먼트 저장소
		var element = {};

		return {
			getElement : function ( id ) { return element[id]; },
			setElement : function ( id, object ) { element[id] = object; }
		};
	});

	//드래그 
	module.directive('draggable', ['$parse', 'elementStorage', function( $parse, elementStorage ) {

		return function(scope, element, attrs) {

			//드래그하는 객체
			var eventTarget = $parse(attrs['data-draggable'] || attrs['draggable'] || undefined, /* interceptorFn */ null, /* expensiveChecks */ true);

			//드래그 속성 부여
			element.attr("draggable", true);

			//드래그 시작 이벤트
			element.on("dragstart", function(e){

				//현재 객체를 저장
				elementStorage.setElement( "eventTarget", eventTarget(scope) );

				//현재 객체의 타입을 저장
				elementStorage.setElement( "eventTargetType", e.target.getAttribute("data-type") );

				//이동 효과 설정
				e.dataTransfer.effectAllowed = "copy";

				//FireFox 호환을 위해서 dataTransfer에 객체의 타입을 저장
				e.dataTransfer.setData("Text", "");
				
				//추가적인 이동 효과를 위한 클래스 설정
				element.addClass('drag-start-element');

				return false;
			});

			//드래그 종료 이벤트
			element.on("dragend", function(e){

				//추가적인 이동 효과를 위한 클래스 제거
				element.removeClass('drag-start-element');

				return false;
			});
		}
	}]);

	module.directive('droppable', ['$rootScope', '$parse', 'elementStorage', function($rootScope, $parse, elementStorage) {

		return function(scope, element, attrs) {

			//이벤트 체크 변수 초기화
			var entered = false;
			var duplicated = false;

			//드래그 오버 이벤트
			element.on("dragover", function(e) {

				//같은 타입인 경우에만
				if ( attrs.type == elementStorage.getElement("eventTargetType") ) {

					//이벤트 기본 동작 중지를 하지 않으면, DROP 이벤트가 발생하지 않는다.
					e.preventDefault && e.preventDefault();

					//이동 효과 설정
					e.dataTransfer.dropEffect = "copy";
				}

				return false;
			});

			//드래그 엔터 이벤트
			element.on("dragenter", function(e) {

				if ( attrs.type == elementStorage.getElement("eventTargetType") ) {

					if ( entered ) {
						duplicated = true;
					}

					else {

						entered = true;

						//현재 드랍 영역에 추가적인 이동 효과를 위한 클래스 설정
						element.addClass("drag-over-border");
					}
				}

				return false;
			});



			//드래그 리브 이벤트
			element.on("dragleave", function(e) {

				if ( attrs.type == elementStorage.getElement("eventTargetType") ) {

					if ( duplicated ) {
						duplicated = false;
					}

					else if ( entered ) {
						entered = false;
					}

					if (!entered && !duplicated) {

						//추가적인 이동 효과를 위한 클래스 제거
						element.removeClass("drag-over-border");
					}
				}

				return false;
			});

			//드랍 이벤트
			element.on("drop", function(e) {

				if ( attrs.type == elementStorage.getElement("eventTargetType") ) {

					//이벤트 기본 동작 중지
					e.preventDefault && e.preventDefault();

					//일부 브라우저 리다이렉팅을 막기 위해 전파 방지 
					e.stopPropagation && e.stopPropagation();

					//이벤트 체크 변수 초기화
					entered = false, duplicated = false;

					//추가적인 이동 효과를 위한 클래스 제거
					element.removeClass("drag-over-border");

					//콜백 초기화
					var dropCallback = $parse(attrs['data-droppable'] || attrs['droppable'] || undefined, /* interceptorFn */ null, /* expensiveChecks */ true);

					//콜백 함수 호출
					if ('undefined' !== typeof dropCallback) {

						//두 가지 케이스가 있기 때문에, 익명 함수로 한번 감싸준다.
						var callback = function() {
							dropCallback(scope, { $event:{target:elementStorage.getElement( "eventTarget"), targetType:elementStorage.getElement( "eventTargetType")}} );
						}

						//현재 $digest cycle 상태이면,
						if ($rootScope.$$phase) {
							//비동기로 실행
							scope.$evalAsync(callback);
						}

						else {
							//그렇지 않으면 바로 실행
							scope.$apply(callback);
						}
					}
				}

				return false;
			});

		}
	}]);

})(angular);

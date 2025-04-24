/*
 Usage: <buttoninputctrl options="ctrloptions" ng-model="model" readonly="readonly" btnclick="clickEvent()"></buttoninputctrl>
 attributes: 
 ng-model: 				the angular data model
 options: 				the options for the button details on how the button should behave:
 options = {
 btnPos: 'front',
 btnText: '@',
 placeholder: 'placeholder text'
 }
 btn-text: 				a string for the button
 btn-pos: 				possible values are: front or back. Defines the appearance of the button
 placeholder: 			a placeholder text to appear in the textbox
 readonly: 				sets the control editable or readonly
 btnclick: 				event for button click
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('buttoninputctrl', control);
	angular.module('platform').directive('buttonInputControl', control);

	control.$inject = ['$compile', '$timeout'];

	function control($compile, $timeout) {
		return {
			restrict: 'AE',
			require: 'ngModel',
			scope: {
				options: '=',
				readonly: '=',
				btnclick: '&'
			},
			link: function (scope, elem, attrs, ctrl) {
				/* btnPos="$$btnPos$$" btnText="$$btnText$$" placeholder="$$placeholder$$" */
				var template = ['<div><div class="input-group"><span ng-if="options.btnPos === \'front\'" class="input-group-btn">',
					'<button class="btn btn-default" ng-click="btnclick()" type="button" ng-disabled="readonly">{{options.btnText}}</button></span>',
					'<input type="text" class="form-control" placeholder="{{options.placeholder}}" ng-readonly="readonly"><span class="input-group-btn" ng-if="options.btnPos === \'back\'">',
					'<button class="btn btn-default" ng-click="btnclick()" type="button" ng-disabled="readonly">{{options.btnText}}</button></span></div></div>'].join('');

				var linkFn = $compile(template);
				var content = linkFn(scope);
				elem.replaceWith(content);

				$timeout(function () {
					ctrl.$setViewValue(scope.ngModel);
					ctrl.$render();
				}, 0);
			}
		};
	}
})(angular);
/**
 * Created by xia on 12/26/2016.
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('qtoBoqAssignedTypeLookup',function(){
		return {
			restrict: 'EA',
			// require: '^ngModel',
			scope: {
				ngModel: '=',
				options: '=',
				onSelectionChanged: '&',
				readonly: '='
			},
			controller : 'qtoMainHeaderCreateDialogController',
			template:
				'<div data-radiolistctrl data-ng-model="ngModel" data-options="options" on-selection-changed="onRadioGroupOptChanged(value)"></div>',
			link: {
				pre: function (scope) {
					scope.onRadioGroupOptChanged = function(value){
						scope.onSelectionChanged(value);
					};
				}
			}

		};
	});

})(angular);
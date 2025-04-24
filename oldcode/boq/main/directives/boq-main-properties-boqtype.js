/**
 * Created by joshi on 08.07.2014.
 */
(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainType
	 * @requires
	 * @description
	 */
	angular.module('boq.main').directive('boqMainType', ['boqMainBoqTypeService', function (boqMainBoqTypeService) {
		return {
			restrict: 'A',
			scope: {
				ngModel: '='
			},
			template: '<dropdowncontrol ng-model="model" options="options" on-selection-changed="changeEvent(value)"></dropdowncontrol>',
			link: function link(scope/* , element, attrs */) {

				boqMainBoqTypeService.loadData().then(function () {
					scope.items = boqMainBoqTypeService.getBoqType();
				});
			}
		};
		//        return {
		//
		//            restrict: 'A',
		//
		//            scope: {
		//                ngModel: '='
		//            },
		//
		// //            template: '<span data-platform-simple-combo data-items="items" data-display-member="description" ng-model="ngModel"></span>',
		//            template:'<select class="form-control" data-ng-model="ngModel" data-ng-options="item.description for item in items"><option value="" ng-hide="ngModel">{{ ngModel.description  || "not selected" }}</option></select>',
		//            link:  function link(scope, element, attrs) {
		//
		//                boqMainBoqTypeService.loadData().then(function() {
		//                    scope.items = boqMainBoqTypeService.getBoqType();
		//                });
		//            }
		//        };

	}]);
})();


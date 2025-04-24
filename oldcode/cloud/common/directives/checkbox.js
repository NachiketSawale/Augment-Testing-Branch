(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformCheckbox', [function () {

//      var template =  '<input type="checkbox" data-ng-model="ngModel" data-ng-readonly="controlOptions.readonly || false" data-ng-disabled="controlOptions.readonly || false"  \
//                                              class="form-control input-sm pull-left" ng-change="ngChange()"/>';

		var template = '<input type="checkbox" data-ng-model="ngModel" data-ng-readonly="controlOptions.readonly" \
                             data-ng-disabled="controlOptions.disabled" \
	                          class="form-control" \
	                          ng-change="ngChange()" \
	                   />';

		return {

			restrict: 'A',

			replace: false,

			scope: {
				ngModel: '=',
				controlOptions: '=',
				entity: '=',
				ngChange: '&'
			},

			template: template
		};
	}]);

})(angular);

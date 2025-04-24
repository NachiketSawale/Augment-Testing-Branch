/**
 * Created by baf on 2023/02/27
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name logisticJobPlantAllocationFilterItemTypeGridDirective
	 * @requires angular
	 * @description
	 */
	angular.module('logistic.job').directive('logisticJobPlantAllocationFilterItemTypeGridDirective', LogisticJobPlantAllocationFilterItemTypeGridDirective);

	function LogisticJobPlantAllocationFilterItemTypeGridDirective() {
		return {
			restrict: 'A',
			scope: { ngModel: '=' },
			templateUrl: globals.appBaseUrl + 'app/components/modaldialog/modal-form-sub-grid-template.html',
			controller: 'logisticJobPlantAllocationFilterItemTypeGridController'
		};
	}
})(angular);

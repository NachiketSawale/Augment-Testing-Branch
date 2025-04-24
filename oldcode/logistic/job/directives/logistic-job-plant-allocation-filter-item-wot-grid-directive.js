/**
 * Created by baf on 2023/02/21
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name logisticJobPlantAllocationFilterItemWotGridDirective
	 * @requires angular
	 * @description
	 */
	angular.module('logistic.job').directive('logisticJobPlantAllocationFilterItemWotGridDirective', LogisticJobPlantAllocationFilterItemWotGridDirective);

	function LogisticJobPlantAllocationFilterItemWotGridDirective() {
		return {
			restrict: 'A',
			scope: { ngModel: '=' },
			templateUrl: globals.appBaseUrl + 'app/components/modaldialog/modal-form-sub-grid-template.html',
			controller: 'logisticJobPlantAllocationFilterItemWotGridController'
		};
	}
})(angular);

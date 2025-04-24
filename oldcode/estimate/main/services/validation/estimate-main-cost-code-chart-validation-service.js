/**
 * Created by Naim on 05.03.2018.
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainValidationService
	 * @description provides validation methods for estimate instances
	 */
	estimateMainModule.factory('estimateMainCostCodeChartValidationService',
		[
			function () {
				let service = {};

				service.validateColor = function validateColor() {
					return true;
				};

				return service;
			}
		]);
})();

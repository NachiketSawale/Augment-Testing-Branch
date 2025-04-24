(function (angular) {
	'use strict';
	let moduleName = 'controlling.projectcontrols';
	/**
	 * @ngdoc service
	 * @name controllingProjectcontrolsDashboardValidationService
	 * @description provides validation methods for project controls dashboard
	 */
	angular.module(moduleName).factory('controllingProjectcontrolsDashboardValidationService',
		['_', 'controllingProjectcontrolsDashboardService', 'platformDataValidationService', '$injector', '$translate',
			function (_, dashboardService, platformDataValidationService, $injector, $translate) {

				let service = {};

				angular.extend(service, {
					validateSAC: validateSAC
				});

				function getIsMapCulture(checkVal){
					let isMapCulture = $injector.get('estimateMainCommonCalculationService').getIsMapCulture(checkVal);

					let result = {apply: true, valid: true};
					if (!isMapCulture) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
					}

					return result;
				}

				function validateSAC(entity, value, model) {
					let result = getIsMapCulture(value);
					let valueResult = $injector.get('controllingProjectcontrolsDashboardService').checkValueByCulture(value);

					if (result.valid) {
						if(isNaN(_.toNumber(valueResult.value))){
							entity[model] = '0';
							entity[model + 'Detail'] = 0;

							result = {
								apply: true,
								valid: false,
								error: $translate.instant('cloud.common.ERROR_TYPE_NUMBER')
							};
						}

					}

					return result;
				}

				return service;
			}]);

})(angular);

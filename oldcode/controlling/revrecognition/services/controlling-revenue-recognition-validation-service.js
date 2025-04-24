/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	/**
     * @ngdoc service
     * @name controllingActualsValidationService
     * @function
     *
     * @description
     * This service provides validation methods of controlling-actuals
     */
	angular.module(moduleName).factory('controllingRevenueRecognitionValidationService', ['_', 'platformDataValidationService',
		'platformRuntimeDataService', '$translate', 'controllingRevenueRecognitionHeaderDataService',
		function (_, platformDataValidationService, platformRuntimeDataService, $translate, dataService) {
			var service = {};


			service.validateCompanyYearFk = function validateCompanyYearFk(entity, value) {
				var result;
				var fieldErrorTr = {fieldName: 'Company Year Service'};

				if (value === -1) {
					result = platformDataValidationService.isMandatory(null, 'CompanyYearFk', fieldErrorTr);
					return platformDataValidationService.finishValidation(result, entity, null, 'CompanyYearFk', service, dataService);
				} else {
					result = platformDataValidationService.isMandatory(value, 'CompanyYearFk', fieldErrorTr);
					return platformDataValidationService.finishValidation(result, entity, value, 'CompanyYearFk', service, dataService);
				}
			};

			service.validateCompanyPeriodFk = function validateCompanyPeriodFk(entity, value) {
				var result= {apply: true, valid: true, error: ''};
				var fieldErrorTr = {fieldName: 'Trading Period'};

				if (value === -1) {
					result = platformDataValidationService.isMandatory(null, 'CompanyPeriodFk', fieldErrorTr);
					return platformDataValidationService.finishValidation(result, entity, null, 'CompanyPeriodFk', service, dataService);
				} else {

					var sameItem = _.find(dataService.getList(), function (item) {
						return item.CompanyPeriodFk === value && item.Id !== entity.Id && item.PrjProjectFk===entity.PrjProjectFk;
					});
					if(sameItem) {
						result = platformDataValidationService.createErrorObject('controlling.revrecognition.errorCompanyPeriodMustBeUniquePrjContext');
					}
				}
				return platformDataValidationService.finishValidation(result, entity, value, 'CompanyPeriodFk', service, dataService);
			};

			service.validatePrjProjectFk = function validatePrjProjectFk(entity, value) {
				var result= { apply: true, valid: true };
				var fieldErrorTr = {fieldName: 'Project'};
				if(value<=0){
					result = platformDataValidationService.isMandatory(null, 'PrjProjectFk', fieldErrorTr);
					platformDataValidationService.finishValidation(result, entity, null, 'PrjProjectFk', service, dataService);
				}
				else {
					entity.PrjProjectFk=value;
					service.validateCompanyPeriodFk(entity, entity.CompanyPeriodFk, 'CompanyPeriodFk');
					platformDataValidationService.finishValidation(result, entity, value, 'PrjProjectFk', service, dataService);
				}
				return result;
			};



			return service;
		}
	]);
})(angular);

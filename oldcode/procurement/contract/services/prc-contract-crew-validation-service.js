/**
 * Created by jhe on 1/11/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	/**
     * @ngdoc service
     * @name procurementContractCrewValidationService
     * @description provides validation methods for entities
     */
	angular.module(moduleName).service('procurementContractCrewValidationService', procurementContractCrewValidationService);

	procurementContractCrewValidationService.$inject = ['procurementContractCrewDataService', 'platformDataValidationService', 'platformPropertyChangedUtil',
		'platformRuntimeDataService'];

	function procurementContractCrewValidationService(procurementContractCrewDataService, platformDataValidationService, platformPropertyChangedUtil,
		platformRuntimeDataService) {

		var self = this;// jshint ignore:line

		self.validateDescriptionInfo = function (entity, value/* , model */) {
			var result;
			if (angular.isObject(value)){
				result = platformDataValidationService.isEmptyProp(value.Translated);
				value = value.Translated;
			}
			else{
				result = platformDataValidationService.isEmptyProp(value);
			}

			if (result) {
				result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'description'});
			} else {
				result = platformDataValidationService.createSuccessObject();
			}
			handleError(result, entity, 'DescriptionInfo');
			platformDataValidationService.finishValidation(result, entity, value, 'DescriptionInfo', self, procurementContractCrewDataService);
			return result;
		};

		self.validateSorting = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, procurementContractCrewDataService);
		};

		self.validateIsDefault = function (entity, value, model) {
			platformPropertyChangedUtil.onlyOneIsTrue(procurementContractCrewDataService, entity, value, model);
			return { apply: value, valid: true };
		};

		function handleError(result, entity, model) {
			if (!result.valid) {
				platformRuntimeDataService.applyValidationResult(result, entity, model);
			} else {
				removeError(entity);
			}
		}

		function removeError(entity) {
			if (entity.__rt$data && entity.__rt$data.errors) {
				entity.__rt$data.errors = null;
			}
		}

	}

})(angular);
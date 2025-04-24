/**
 * Created by jack.wu on 24/6/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainStandardAllowancesValidationService',
		['$http', '_', '$timeout', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateMainStandardAllowancesDataService','estStandardAllowancesCostCodeDetailDataService','$injector',
			function ($http, _, $timeout, $translate, platformDataValidationService, platformRuntimeDataService, estimateMainStandardAllowancesDataService,estStandardAllowancesCostCodeDetailDataService,$injector) {
				let service = {};

				service.validateCode = function validateCode(entity, value, model) {
					let fieldToValidate = 'Code';
					let oldEstAllowance = angular.copy(entity);
					entity.oldCode = oldEstAllowance.Code;
					entity.isUniq = true;
					if (value) {
						value = value.toUpperCase();
					}
					let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, fieldToValidate, estimateMainStandardAllowancesDataService.getList(), service, estimateMainStandardAllowancesDataService);

					if (!result.valid) {
						entity.isUniq = false;
					}

					platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
					return platformDataValidationService.finishValidation(result, entity, entity.Code, model, service, estimateMainStandardAllowancesDataService);
				};

				service.validateIsActive = function validateIsActive(entity, value) {
					let activeAllowance = _.filter(estimateMainStandardAllowancesDataService.getList(),{IsActive:true});
					if(activeAllowance.length === 1){
						if(value){
							estimateMainStandardAllowancesDataService.setActiveAllowanceChange(activeAllowance[0].Id);
						} else {
							estimateMainStandardAllowancesDataService.setActiveAllowanceChange(entity.Id);
						}
					}

					let estimateMainService = $injector.get('estimateMainService');
					estimateMainStandardAllowancesDataService.setIsActiveChange(true);
					if (value) {
						estimateMainStandardAllowancesDataService.setUniqueIsActive(entity);
						estimateMainService.handleOldAllowance();
					}
					// estimateMainService.setAAReadonly(!value);
				};

				service.validateIsOneStep = function validateIsOneStep(entity, value) {
					entity.IsOneStep = value;
					estStandardAllowancesCostCodeDetailDataService.refreshColumns('e4a0ca6ff2214378afdc543646e6b079',entity);
				};

				return service;
			}
		]);
})(angular);


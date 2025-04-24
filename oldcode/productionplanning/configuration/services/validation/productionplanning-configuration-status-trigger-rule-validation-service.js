(function () {
	'use strict';
	let moduleName = 'productionplanning.configuration';

	angular.module(moduleName).service('ppsStatusTriggerRuleValidationService', ValidationService);

	ValidationService.$inject = ['platformValidationServiceFactory', 'platformRuntimeDataService', 'platformDataValidationService', 'ppsStatusInheritedTriggerRuleDataService'];

	function ValidationService(platformValidationServiceFactory, platformRuntimeDataService, platformDataValidationService, dataService) {

		const service = {};

		service.mandatoryProperties = {
			PossibleSourceStatus: 'PossibleSourceStatus',
			RequiredSourceStatus: 'RequiredSourceStatus',
			TargetStatusId: 'TargetStatusId'
		};

		service.validatePossibleSourceStatus = function (entity, value, model) {
			if (!model) {
				model = service.mandatoryProperties.PossibleSourceStatus;
			}

			const result = hasAnySourceStatus(entity, value, model);
			if (result.valid) {
				removeRelatedError(result, entity, value, model, service.mandatoryProperties.RequiredSourceStatus);
			}

			platformRuntimeDataService.applyValidationResult(result, entity, service.mandatoryProperties.PossibleSourceStatus);
			return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
		};

		service.validateRequiredSourceStatus = function (entity, value, model) {
			if (!model) {
				model = service.mandatoryProperties.RequiredSourceStatus;
			}

			const result = hasAnySourceStatus(entity, value, model);
			if (result.valid) {
				removeRelatedError(result, entity, value, model, service.mandatoryProperties.PossibleSourceStatus);
			}

			platformRuntimeDataService.applyValidationResult(result, entity, service.mandatoryProperties.RequiredSourceStatus);
			return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
		};

		service.validateTargetStatusId = (entity, value, model) => {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		function hasAnySourceStatus(entity, value, model) {
			const sourceStatus = entity.PossibleSourceStatus.concat(entity.RequiredSourceStatus);
			if (sourceStatus.length === 0 && (platformDataValidationService.isEmptyProp(value) || value.length === 0)) {
				return platformDataValidationService.createErrorObject('productionplanning.configuration.statusInheritedTriggering.noSourceStatus');
			}

			return platformDataValidationService.createSuccessObject();
		}

		function removeRelatedError(result, entity, value, model, relatedModel) {
			platformDataValidationService.ensureNoRelatedError(entity, model, relatedModel, service, dataService);
			platformRuntimeDataService.applyValidationResult(result, entity, relatedModel);
			platformDataValidationService.finishValidation(result, entity, value, relatedModel, service, dataService);
		}

		return service;
	}
})();
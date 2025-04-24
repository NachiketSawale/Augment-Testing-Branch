/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformFastRecordingInputHandlerService
	 * @function
	 * @requires _, platformSchemaService, platformDataValidationService
	 * @description
	 * platformFastRecordingInputHandlerService
	 */
	angular.module('platform').service('platformFastRecordingInputHandlerService', PlatformFastRecordingInputHandlerService);

	PlatformFastRecordingInputHandlerService.$inject = ['_', 'platformValidationByDataService', 'platformDataValidationService'];

	function PlatformFastRecordingInputHandlerService(_, platformValidationByDataService, platformDataValidationService) {
		var self = this;

		function getValidationService(dataService) {
			if(dataService && dataService.getServiceName && _.isFunction(dataService.getServiceName)) {
				return platformValidationByDataService.getValidationServiceByDataService(dataService);
			}

			return null;
		}

		function getDataService(entity) {
			return entity.__rt$data.getDataService();
		}

		this.registerAsyncEvaluationCall = function registerAsyncEvaluationCall(promise, entity, value, model, moduleName) {
			if(moduleName !== 'desktop') {
				const dataService = getDataService(entity);
				const validationService = getValidationService(dataService);

				if(validationService) {
					const asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = promise;

					return asyncMarker;
				}
			}

			return null;
		};

		this.unregisterAsyncEvaluationCall = function unregisterAsyncEvaluationCall(marker, entity, moduleName) {
			if(marker && moduleName !== 'desktop') {
				const dataService = getDataService(entity);

				if(dataService) {
					platformDataValidationService.cleanUpAsyncMarker(marker, dataService);
				}
			}
		};

		this.handleInputNotFound = function handleInputNotFound(result, entity, value, model, moduleName) {
			if(moduleName !== 'desktop') {
				const dataService = getDataService(entity);
				const validationService = getValidationService(dataService);
				if(validationService) {
					const report = {
						apply: false,
						entity: entity,
						error: result.error,
						error$tr$: result.error$tr$,
						error$tr$params$: result.error$tr$params$,
						model: model,
						valid: false,
						value: result.value
					};

					platformDataValidationService.addToErrorList(report, entity, value, model, validationService, dataService);
				}
			}
		};

		this.handleInputFound = function handleInputFound(result, entity, value, model, moduleName) {
			if(moduleName !== 'desktop') {
				const dataService = getDataService(entity);
				const validationService = getValidationService(dataService);
				if(validationService) {
					platformDataValidationService.removeFromErrorList(entity, model, validationService, dataService);
				}
			}
		};
	}
})(angular);
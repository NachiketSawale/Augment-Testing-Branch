/* global moment */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonDocumentValidationService
	 * @require $http
	 * @description provides validation methods for a PrcDocument
	 */
	angular.module('procurement.common').factory('procurementCommonDocumentValidationService',
		['procurementCommonDataNewDataService', 'platformDataValidationService', 'platformRuntimeDataService',
			function (dataDataServiceFactory, platformDataValidationService, platformRuntimeDataService) {

				return function (dataService) {
					var service = {};
					// var dataDataService = dataDataServiceFactory.getService(dataService.parentService());

					// validators
					service.validateDocumentTypeFk = function validateDocumentTypeFk(entity, value, model) {
						entity.OriginFileName = null;
						if (angular.isFunction(dataService.updateReadOnly) && entity.Version !== 0) {
							dataService.updateReadOnly(entity, 'DocumentTypeFk' );
						}

						var result = platformDataValidationService.isMandatory(value === -1 ? null : value, model, {fieldName: 'document type'});

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

						return result;
					};

					service.validateOriginFileName = function validateOriginFileName(entity, value) {
						entity.DocumentDate = moment.utc(Date.now());
						entity.DocumentName = value;
						if (angular.isFunction(dataService.updateReadOnly)) {
							dataService.updateReadOnly(entity, 'DocumentTypeFk' );
						}
						// dataDataService.notifyChanged('ATTACHMENT');
						dataService.fireItemModified(entity);
					};

					service.validateEntity = function (entity) {
						service.validateDocumentTypeFk(entity, entity.DocumentTypeFk, 'DocumentTypeFk');
					};

					// noinspection JSUnusedLocalSymbols
					function onEntityCreated(e, item) {
						service.validateEntity(item);
					}

					dataService.registerEntityCreated(onEntityCreated);

					return service;
				};
			}
		]);
})(angular);

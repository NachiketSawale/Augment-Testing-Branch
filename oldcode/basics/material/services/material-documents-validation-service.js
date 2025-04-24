(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsMaterialDocumentsValidationService
	 * @require $http
	 * @description provides validation methods for a PrcDocument
	 */
	angular.module('basics.material').factory('basicsMaterialDocumentsValidationService',
		['$translate', 'validationService', 'basicsMaterialDocumentsService', 'ServiceDataProcessDatesExtension',
			function ($translate, validationService, dataService, DatesProcessor) {
				var service = validationService.create('materialdocuments', 'basics/material/document/schema');
				var dateProcessor = new DatesProcessor(['DocumentDate']);
				//validators

				service.validateOriginFileName = function validateOriginFileName(entity, value) {
					entity.DocumentDate = Date.now();
					entity.Description = value;
					dateProcessor.processItem(entity);
					return true;
				};

				return service;
			}
		]);
})(angular);

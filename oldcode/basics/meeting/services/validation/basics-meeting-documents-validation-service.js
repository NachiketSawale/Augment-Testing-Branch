/**
 * Created by chd on 12/22/2021.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsMeetingDocumentsValidationService
	 * @require $http
	 * @description provides validation methods for a meeting Document
	 */
	angular.module('basics.meeting').factory('basicsMeetingDocumentsValidationService',
		['$translate', 'validationService', 'basicsMeetingDocumentsService', 'ServiceDataProcessDatesExtension',
			function ($translate, validationService, dataService, DatesProcessor) {
				let service = validationService.create('meetingdocuments', 'basics/meeting/document/schema');
				let dateProcessor = new DatesProcessor(['DocumentDate']);

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

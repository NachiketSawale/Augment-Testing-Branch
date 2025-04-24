/**
 * Created by lnt on 29.10.2019.
 */

(function () {
	'use strict';
	/* global */

	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoDetailDocumentValidationService
	 * @description provides validation methods for qto detail entities
	 */
	angular.module(moduleName).factory('qtoDetailDocumentValidationService',
		['platformDataValidationService', 'qtoDetailDocumentService',
			function (platformDataValidationService, docService) {
				var service = {};

				service.validateFileArchiveDocFk = function validateFileArchiveDocFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, docService);
				};

				service.validateQtoDetailDocumentTypeFk = function validateQtoDetailDocumentTypeFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, docService);
				};

				service.validateOriginFileName = function validateOriginFileName(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, docService);
				};

				return service;
			}
		]);
})();
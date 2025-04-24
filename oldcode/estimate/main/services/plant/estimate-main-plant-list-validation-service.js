(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainPlantListValidationService
	 * @description provides validation methods for plant list
	 */
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainPlantListValidationService', ['$http', '$q', 'platformDataValidationService',
		function ($http, $q, platformDataValidationService) {
			let service = {};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsIndexHeaderService);
			};

			return service;
		}

	]);
})(angular);
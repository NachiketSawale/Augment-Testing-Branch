/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesCtrlGroupValidationService
	 * @description provides validation methods for controlling group entities
	 */
	angular.module(moduleName).factory('estimateAssembliesCtrlGroupValidationService', estimateAssembliesCtrlGroupValidationService);

	estimateAssembliesCtrlGroupValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'estimateAssembliesCtrlGroupService'];

	function estimateAssembliesCtrlGroupValidationService($http, $q, platformDataValidationService, estimateAssembliesCtrlGroupService) {
		let service = {};

		service.validateControllinggroupFk = function validateCtrlGroupFk(entity, value, field) {
			let result = platformDataValidationService.isMandatory(value, field);
			return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateAssembliesCtrlGroupService);
		};

		service.validateControllinggroupDetailFk = function validateCtrlGroupDetailFk(entity, value, field) {
			let result = platformDataValidationService.isMandatory(value, field);
			return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateAssembliesCtrlGroupService);
		};

		return service;
	}
})(angular);

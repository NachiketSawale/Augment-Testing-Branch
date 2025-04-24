/*
 * $Id:
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyBlackListValidationService
	 * @description
	 * Provides validation code for model property keys blacklist.
	 */
	angular.module(moduleName).service('modelAdministrationPropertyKeyBlackListValidationService',
		modelAdministrationPropertyKeyBlackListValidationService);

	modelAdministrationPropertyKeyBlackListValidationService.$inject = ['platformDataValidationService', 'modelAdministrationBlackListDataService'];

	function modelAdministrationPropertyKeyBlackListValidationService(platformDataValidationService, modelAdministrationBlackListDataService) {

		const service = {};

		service.validatePropertyKeyFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'PropertyKeyFk', service, modelAdministrationBlackListDataService);
		};

		return service;
	}
})(angular);
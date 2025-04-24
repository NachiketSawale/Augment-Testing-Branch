/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyValidationService
	 * @description
	 * Provides validation code for model property keys.
	 */
	angular.module(moduleName).service('modelAdministrationPropertyKeyValidationService',
		ModelAdministrationPropertyKeyValidationService);

	ModelAdministrationPropertyKeyValidationService.$inject = ['basicsCustomizeModelValueTypeUtilityService',
		'platformDataValidationService', 'modelAdministrationPropertyKeyDataService'];

	function ModelAdministrationPropertyKeyValidationService(basicsCustomizeModelValueTypeUtilityService,
		platformDataValidationService, modelAdministrationPropertyKeyDataService) {

		const service = {};

		service.validateUseDefaultValue = function (entity, value, model) {
			modelAdministrationPropertyKeyDataService.enableDefaultValue(entity, value);

			return platformDataValidationService.finishValidation(true, entity, value, model, this, modelAdministrationPropertyKeyDataService);
		};

		service.validateDefaultValue = function (entity, value, model) {
			const vtInfo = basicsCustomizeModelValueTypeUtilityService.getValueTypeInfo(entity.ValueType);
			if (vtInfo) {
				entity['DefaultValue' + vtInfo.typeSuffix] = value;
			}

			return platformDataValidationService.finishValidation(true, entity, value, model, this, modelAdministrationPropertyKeyDataService);
		};

		return service;
	}
})(angular);

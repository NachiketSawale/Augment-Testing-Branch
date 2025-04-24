/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.project';

	angular.module(moduleName).factory('modelProjectModelValidationProcessor', modelProjectModelValidationProcessor);
	modelProjectModelValidationProcessor.$inject = ['platformRuntimeDataService', '$injector'];
	function modelProjectModelValidationProcessor(platformRuntimeDataService, $injector) {
		var service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.invoke(['modelProjectModelValidationService', function (modelProjectModelValidationService) {
					modelProjectModelValidationService.validateLodFk(item, item.LodFk);
					modelProjectModelValidationService.validateStatusFk(item, item.StatusFk);
					modelProjectModelValidationService.validateTypeFk(item, item.TypeFk);
					modelProjectModelValidationService.validateCode(item, item.Code);
				}]);
			}
		};
		return service;
	}
})(angular);
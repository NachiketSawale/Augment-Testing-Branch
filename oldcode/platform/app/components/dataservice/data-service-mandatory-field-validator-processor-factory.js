/*
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformDataServiceMandatoryFieldsValidatorFactory
	 * @function
	 *
	 * @description
	 * The platformDataServiceMandatoryFieldsValidatorFactory converts date strings into real date variables.
	 */
	angular.module('platform').service('platformDataServiceMandatoryFieldsValidatorFactory', PlatformDataServiceMandatoryFieldsValidatorFactory);

	PlatformDataServiceMandatoryFieldsValidatorFactory.$inject = ['$injector', 'platformRuntimeDataService'];

	function PlatformDataServiceMandatoryFieldsValidatorFactory($injector, platformRuntimeDataService) {
		this.createValidator = function createValidator(serv, field) {
			var valFunc = 'validate' + field;
			return {
				validate: function validate(item) {
					if (item.Version === 0) {
						var result = $injector.get(serv)[valFunc](item, item[field], field);
						platformRuntimeDataService.applyValidationResult(result, item, field);
					}
				}
			};
		};
	}
})(angular);
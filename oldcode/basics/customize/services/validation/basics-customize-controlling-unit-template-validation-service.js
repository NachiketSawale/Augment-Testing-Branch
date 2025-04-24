/**
 * Created by Janas / Baedeker on 20.01.2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name modelMainContainerDValidationService
	 * @description provides validation methods for model container entities
	 */
	angular.module(moduleName).service('basicsCustomizeControllingUnitTemplateValidationService', BasicsCustomizeControllingUnitTemplateValidationService);

	function BasicsCustomizeControllingUnitTemplateValidationService() {

		this.validateCodevalidation = function validateCodevalidation(entity, newCodeValidation) {
			var parts = newCodeValidation.split('/'),
				regex = newCodeValidation,
				options = '';

			if (parts.length > 1) {
				regex = parts[1];
				options = parts[2];
			}
			try {
				new RegExp(regex, options);
				return true;
			}
			catch (e) {
				return false;
			}
		};

	}
})(angular);

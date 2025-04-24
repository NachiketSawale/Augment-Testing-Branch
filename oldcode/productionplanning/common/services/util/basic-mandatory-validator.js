/**
 * Created by zov on 6/28/2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicMandatoryValidator
	 * @function
	 * @requires platformDataValidationService, platformSchemaService
	 *
	 * @description validator of mandatory property
	 * #
	 *
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('basicMandatoryValidator', ['platformSchemaService',

	function (platformSchemaService) {
		var ignoreField = ['InsertedAt', 'InsertedBy', 'Version'];

		return {
			init: function (options) {
				var domains = platformSchemaService.getSchemaFromCache({
					typeName: options.typeName,
					moduleSubModule: options.moduleSubModule
				}).properties;

				var validationService = options.validationService;

				for (var prop in domains) {
					if(Object.prototype.hasOwnProperty.call(domains,prop)){
						var fn = 'validate' + prop.replace(/\./g, '$');
						if (domains[prop].mandatory && ignoreField.indexOf(prop) === -1 && !validationService[fn]) {
							validationService[fn] = options.validator;
						}
					}
				}
			}
		};
	}]);

})(angular);
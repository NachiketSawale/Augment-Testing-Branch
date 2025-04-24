/**
 * Created by joshi on 24.10.2016.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc service
	 * @name projectStructuresValidationService
	 * @description provides validation methods for project structures sortcodes properties
	 */
	angular.module('project.structures').service('projectStructuresValidationService', ['platformDataValidationService',

		function ( platformDataValidationService) {

			return {
				initValidation: initValidation
			};

			function initValidation(mainService){
				var service = {};
				service.validateCode = function validateCode(entity, value, model) {
					var res = platformDataValidationService.isMandatory(value, model);

					return platformDataValidationService.finishValidation(res, entity, value, model, service, mainService);
				};
				return service;
			}

		}
	]);

})(angular);

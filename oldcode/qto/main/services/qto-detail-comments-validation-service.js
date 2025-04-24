(function () {
	'use strict';

	let moduleName = 'qto.main';

	/**
	* @ngdoc service
	* @name qtoDetailCommentsValidationService
	* @description provides validation methods for qto detail comment
	*/
	angular.module(moduleName).factory('qtoDetailCommentsValidationService',
		['platformDataValidationService', 'qtoDetailCommentsService',
			function (platformDataValidationService, qtoDetailCommentsService) {
				let service = {};

				service.validateBasQtoCommentsTypeFk = function validateBasQtoCommentsTypeFk(entity, value, model) {
					entity.BasQtoCommentsTypeFk = value = value > 0 ? value : null;
					let result = platformDataValidationService.validateMandatory(entity, value, model, service, qtoDetailCommentsService);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, qtoDetailCommentsService);
				};
				return service;
			}
		]);
})();
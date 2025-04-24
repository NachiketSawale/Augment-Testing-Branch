( function (angular) {
	'use strict';

	angular.module('qto.formula').factory('qtoFormulaCommentValidationService',
		['platformDataValidationService', 'qtoFormulaCommentService',
			function ( platformDataValidationService, dataService) {
				let service = {};

				service.validateCode = function (entity, value, model) {
					let res =  platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);
					platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
					return res;
				};

				return service;
			}]);
})(angular);
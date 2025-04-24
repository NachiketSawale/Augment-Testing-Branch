( function (angular) {
	'use strict';
	angular.module('qto.main').factory('prjQtoCommentValidationService', ['prjQtoCommentDataService', 'platformDataValidationService', function (dataService, platformDataValidationService) {
		let service = {};
		service.validateCode = function (entity, value, model) {
			let res = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);
			platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
			return res;
		};
		return service;
	}]);
})(angular);
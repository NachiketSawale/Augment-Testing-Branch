(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name objectProjectHeaderValidationService
	 * @description provides validation methods for object header instances
	 */
	var moduleName='object.project';
	angular.module(moduleName).service('objectProjectHeaderValidationService', ObjectProjectHeaderValidationService);

	ObjectProjectHeaderValidationService.$inject = [ 'platformDataValidationService','objectProjectHeaderService'];

	function ObjectProjectHeaderValidationService(platformDataValidationService, objectProjectHeaderService) {
		var self = this;

		self.validateCode = function (entity, value, model) {
			var items = objectProjectHeaderService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, objectProjectHeaderService);
		};
	}

})(angular);

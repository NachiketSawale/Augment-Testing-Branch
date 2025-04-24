(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name objectProjectLevelValidationService
	 * @description provides validation methods for object level instances
	 */
	var moduleName='object.project';
	angular.module(moduleName).service('objectProjectLevelValidationService', ObjectProjectLevelValidationService);

	ObjectProjectLevelValidationService.$inject = [ 'platformDataValidationService','objectProjectLevelService'];

	function ObjectProjectLevelValidationService(platformDataValidationService, objectProjectLevelService) {
		var self = this;

		self.validateCode = function (entity, value, model) {
			var items = objectProjectLevelService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, objectProjectLevelService);
		};
	}

})(angular);

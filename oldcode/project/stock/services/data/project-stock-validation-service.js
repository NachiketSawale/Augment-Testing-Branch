/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	var modName = 'project.stock';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectStockValidationService
	 * @description provides validation methods for information request entities
	 */
	module.service('projectStockValidationService', ProjectStockValidationService);
	ProjectStockValidationService.$inject = ['platformDataValidationService', 'projectStockDataService'];

	function ProjectStockValidationService(platformDataValidationService, projectStockDataService) {
		this.validateCode = function validateCode(entity, value, model) {
			var items = projectStockDataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, this, projectStockDataService);
		};
	}

})(angular);

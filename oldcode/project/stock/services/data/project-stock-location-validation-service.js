/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	var modName = 'project.stock';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectStockLocationValidationService
	 * @description provides validation methods for information request entities
	 */
	module.service('projectStockLocationValidationService', ProjectStockLocationValidationService);
	ProjectStockLocationValidationService.$inject = ['platformDataValidationService', 'projectStockLocationDataService'];

	function ProjectStockLocationValidationService(platformDataValidationService, projectStockLocationDataService) {
		this.validateCode = function validateCode(entity, value, model) {
			var items = projectStockLocationDataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, this, projectStockLocationDataService);
		};
	}

})(angular);

/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	var modName = 'project.stock';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectStockMaterialValidationService
	 * @description provides validation methods for information request entities
	 */
	module.service('projectStockMaterialValidationService', ProjectStockMaterialValidationService);
	ProjectStockMaterialValidationService.$inject = ['platformDataValidationService', 'projectStockMaterialDataService'];

	function ProjectStockMaterialValidationService(platformDataValidationService, projectStockMaterialDataService) {
		this.validateMaterialFk = function validateMaterialFk(entity, value, model) {
			var items = projectStockMaterialDataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, this, projectStockMaterialDataService);
		};
	}

})(angular);

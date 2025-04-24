/**
 * Created by henkel on 11.11.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyCategoryValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyCategoryValidationService', BasicsCompanyCategoryValidationService);

	BasicsCompanyCategoryValidationService.$inject = ['basicsCompanyCategoryService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function BasicsCompanyCategoryValidationService(basicsCompanyCategoryService, platformDataValidationService) {
		var self = this;

		this.validateRubricFk = function validateRubricFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyCategoryService);
		};

		this.validateRubricCategoryFk = function validateRubricCategoryFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyCategoryService);
		};
	}

})(angular);
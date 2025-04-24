(function (angular) {
	'use strict';
	angular.module('qto.formula').factory('qtoFormulaRubricCategoryValidationService', ['validationService',
		function (validationService) {
			return validationService.create('qtoFormulaRubricCategory', 'qto/formula/header/schema');
		}
	]);
})(angular);

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectHierarchicalValidationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMainObjectHierarchicalValidationService', ModelMainObjectValidationService);

	ModelMainObjectValidationService.$inject = ['modelMainObjectHierarchicalDataService'];

	function ModelMainObjectValidationService() {
	}

})(angular);

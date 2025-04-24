(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectHierarchicalValidationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('constructionsystemMainObjectHierarchicalValidationService', constructionsystemMainObjectValidationService);

	constructionsystemMainObjectValidationService.$inject = ['modelMainObjectHierarchicalDataService'];

	function constructionsystemMainObjectValidationService() {
	}

})(angular);

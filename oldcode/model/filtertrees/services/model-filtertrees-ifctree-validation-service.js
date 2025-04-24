(function (angular) {
	'use strict';
	var moduleName = 'model.filtertrees';

	/**
	
	 * @ngdoc service
	 * @name modelFiltertreesIFCTreeValidationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelFiltertreesIFCTreeValidationService', modelFiltertreesValidationService);

	modelFiltertreesValidationService.$inject = ['modelFiltertreesIFCTreeDataService'];

	function modelFiltertreesValidationService() {
	}

})(angular);

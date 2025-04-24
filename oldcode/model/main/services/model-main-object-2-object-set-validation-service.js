/**
 * Created by leo on 20.09.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObject2ObjectSetValidationService
	 * @description provides validation methods for model object property entities
	 */
	angular.module(moduleName).service('modelMainObject2ObjectSetValidationService', modelMainObject2ObjectSetValidationService);

	modelMainObject2ObjectSetValidationService.$inject = ['platformDataValidationService', '$injector'];
	function modelMainObject2ObjectSetValidationService(platformDataValidationService, $injector) {

		var service = {};
		var dataService = $injector.get('modelMainObject2ObjectSetDataService');

		service.validateObjectSetFk = function (entity, value) {
			var items = dataService.getList();

			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'ObjectSetFk', items, service, dataService);
		};
		
		return service;
	}

})(angular);

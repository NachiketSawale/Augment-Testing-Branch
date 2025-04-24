/**
 * Created by leo on 20.09.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectSet2ObjectValidationService
	 * @description provides validation methods for model object property entities
	 */
	angular.module(moduleName).service('modelMainObjectSet2ObjectValidationService', modelMainObjectSet2ObjectValidationService);

	modelMainObjectSet2ObjectValidationService.$inject = ['platformDataValidationService', '$injector'];
	function modelMainObjectSet2ObjectValidationService(platformDataValidationService, $injector) {

		var service = {};
		var dataService = $injector.get('modelMainObjectSet2ObjectDataService');

		service.validateObjectFk = function (entity, value) {
			var items = dataService.getList();

			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'ObjectFk', items, service, dataService);
		};
		
		return service;
	}

})(angular);

/**
 * Created by leo on 20.09.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainPropertyValidationService
	 * @description provides validation methods for model object property entities
	 */
	angular.module(moduleName).service('modelMainLineItem2ObjectValidationService', modelMainLineItem2ObjectValidationService);

	modelMainLineItem2ObjectValidationService.$inject = ['platformDataValidationService', '$injector'];
	function modelMainLineItem2ObjectValidationService(platformDataValidationService, $injector) {

		var service = {};
		var dataService = $injector.get('modelMainEstLineItem2ObjectService');

		service.validateEstLineItemFk = function (entity, value) {
			var items = dataService.getList();

			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'EstLineItemFk', items, service, dataService);
		};
		
		return service;
	}

})(angular);

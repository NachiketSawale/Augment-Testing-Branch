/**
 * Created by leo on 19.11.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectModelValidationService
	 * @description provides validation methods for model entities
	 */
	angular.module(moduleName).factory('modelProjectModelValidationService', ['$injector', 'platformDataValidationService',

		function ($injector, platformDataValidationService) {

			var service = {};
			var dataService = $injector.get('modelProjectModelDataService');

			service.validateCode = function (entity, value) {
				var items = dataService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', items, service, dataService);
			};
			service.validateLodFk = function (entity, value) {
				return platformDataValidationService.validateMandatory(entity, value, 'LodFk', service, dataService);
			};
			service.validateStatusFk = function (entity, value) {
				return platformDataValidationService.validateMandatory(entity, value, 'StatusFk', service, dataService);
			};
			service.validateTypeFk = function (entity, value) {
				return platformDataValidationService.validateMandatory(entity, value, 'TypeFk', service, dataService);
			};

			return service;
		}

	]);

})(angular);

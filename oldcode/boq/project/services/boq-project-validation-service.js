/**
 * Created by Helmut Buck on 13.03.2015.
 */

(function () {
	/* global */
	'use strict';

	var moduleName = 'boq.project';

	/**
	 * @ngdoc service
	 * @name boqProjectValidationService
	 * @description provides validation methods for boq project entities
	 */
	angular.module(moduleName).factory('boqProjectValidationService', ['$injector', 'platformDataValidationService',

		function ($injector, platformDataValidationService) {

			var service = {};

			service.validateBoqRootItem$Reference = function (entity, value) {
				var dataService = $injector.get('boqProjectService');
				var items = dataService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'BoqRootItem.Reference', items, service, dataService);
			};

			return service;
		}

	]);

})();
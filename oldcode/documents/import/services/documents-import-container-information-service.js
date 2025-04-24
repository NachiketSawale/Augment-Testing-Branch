(function (angular) {

	'use strict';
	var moduleName = 'documents.import';

	/**
	 * @ngdoc service
	 * @name documentImportContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('documentsImportContainerInformationService', ['documentImportUIStandardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (documentImportUIStandardService) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '6880A128218D40CFB161194F4AC696DA':// documentImportOrphanController
						config = documentImportUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentImportUIStandardService';
						config.dataServiceName = 'documentImportDataService';
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);
(function (angular) {

	'use strict';
	var projectLocationModule = angular.module('project.location');

	/**
	 * @ngdoc service
	 * @name projectLocationContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	projectLocationModule.factory('projectLocationContainerInformationService', ['projectLocationStandardConfigurationService','projectLocationClipboardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (projectLocationStandardConfigurationService, projectLocationClipboardService) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '4B79EF1F51FF454494EEE799529AEFAF': // projectLocationListController
						config = getLocationListConfig(config);
						break;
					case '42FF27D7F0EA40EABA389D669BE3A1DF': // projectLocationListController
						config = getLocationListConfig(config);
						break;
					case '6A471BC4478043519083C2D8739B4C41': // projectLocationDetailController
						config = getLocationDetailConfig(config);
						break;
					case '33761E17BFB84451BD226BF2882BC11D': // projectLocationDetailController
						config = getLocationDetailConfig(config);
						break;
				}

				function getLocationListConfig(config) {
					config.layout = projectLocationStandardConfigurationService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'projectLocationStandardConfigurationService';
					config.dataServiceName = 'projectLocationMainService';
					config.validationServiceName = 'projectLocationValidationService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
						parentProp: 'LocationParentFk',
						childProp: 'Locations',
						type: 'location',
						dragDropService: projectLocationClipboardService
					};
					return config;
				}
				
				function getLocationDetailConfig(config) {
					config.layout = projectLocationStandardConfigurationService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'projectLocationStandardConfigurationService';
					config.dataServiceName = 'projectLocationMainService';
					config.validationServiceName = 'projectLocationValidationService';
					return config;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);
/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var modelFiltertreesModule = angular.module('model.filtertrees');

	/**
	 * @ngdoc service
	 * @name modelFiltertreesContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	modelFiltertreesModule.factory('modelFiltertreesContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '722a80284d6843a19d4ec83f5183cbaa': // modelFiltertreesIFCTreeListController
						config.layout = $injector.get('modelFiltertreesUIConfigurationService').getModelObjectIFCTreeDetailLayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'modelFiltertreesIFCTreeConfigurationService';
						config.dataServiceName = 'modelFiltertreesIFCTreeDataService';
						config.validationServiceName = 'modelFiltertreesIFCTreeValidationService';
						config.listConfig = {
							initCalled: false,
							columns: [],
							/*sortOptions: { initialSortColumn: { field: 'Code', id: 'code' }, isAsc: true },*/
							marker: {
								filterService: $injector.get('modelMainFilterService'),
								filterId: 'modelFiltertreesIFCTreeListController',
								dataService: $injector.get('modelFiltertreesIFCTreeDataService'),
								serviceName: 'modelFiltertreesIFCTreeDataService'
							},
							parentProp: '',
							childProp: 'children'
						};

				};

				/*
								switch (guid) {
									case 'mainEntityGuid': // modelFiltertreesMainEntityNameListController
										config.layout = $injector.get('modelFiltertreesMainEntityNameConfigurationService').getStandardConfigForListView();
										config.ContainerType = 'Grid';
										config.standardConfigurationService = 'modelFiltertreesMainEntityNameConfigurationService';
										config.dataServiceName = 'modelFiltertreesMainEntityNameDataService';
										config.validationServiceName = null;
										config.listConfig = {
											initCalled: false,
											grouping: true
										};
										break;
									case 'mainEntityDetailsGuid': // modelFiltertreesMainEntityNameDetailController
										config.layout = $injector.get('modelFiltertreesMainEntityNameConfigurationService').getStandardConfigForDetailView();
										config.ContainerType = 'Detail';
										config.standardConfigurationService = 'modelFiltertreesMainEntityNameConfigurationService';
										config.dataServiceName = 'modelFiltertreesMainEntityNameDataService';
										config.validationServiceName = null;
										break;
								}
				*/

				return config;
			};

			return service;
		}
	]);
})(angular);

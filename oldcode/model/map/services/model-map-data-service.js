/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.map';
	const module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelMapDataService
	 * @function
	 *
	 * @description
	 * modelMapDataService is the data service for model map related functionality.
	 */
	module.factory('modelMapDataService', modelMapDataService);

	modelMapDataService.$inject = ['_', 'platformDataServiceFactory',
		'modelViewerModelSelectionService', '$injector', 'cloudDesktopSidebarService'];

	function modelMapDataService(_, platformDataServiceFactory,
		modelViewerModelSelectionService, $injector, cloudDesktopSidebarService) {

		let serviceContainer;

		// The instance of the main service - to be filled with functionality below
		const exceptServiceOption = {
			flatRootItem: {
				module: module,
				serviceName: 'modelMapDataService',
				entityNameTranslationID: 'model.map.description',
				httpCreate: {
					route: globals.webApiBaseUrl + 'model/map/'
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'model/map/'
				},
				httpDelete: {
					route: globals.webApiBaseUrl + 'model/map/'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'model/map/',
					endRead: 'filtered',
					usePostForRead: true
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							// Get the current pinned Model Id
							const pinnedModelId = modelViewerModelSelectionService.getSelectedModelId();
							if (pinnedModelId) {
								creationData.PKey1 = pinnedModelId;
							}

						},
						incorporateDataRead: function incorporateDataRead(readData, data) {
							const pinnedModelId = modelViewerModelSelectionService.getSelectedModelId();

							if (pinnedModelId) {
								serviceContainer.data.pinnedModelId = pinnedModelId;
							}

							return serviceContainer.data.handleReadSucceeded(readData, data);

						}
					}

				},
				actions: {
					create: 'flat',
					delete: true,
					canCreateCallBackFunc: function () {
						// check if there is already model selected otherwise disable create button
						return Boolean(modelViewerModelSelectionService.getSelectedModelId());
					}
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						pinningOptions: {
							isActive: true,
							suppressButton: true,
							showPinningContext: [
								{token: 'project.main', show: true},
								{token: 'model.main', show: true}
							]
						},
						showProjectContext: false,
						withExecutionHints: false
					}
				},

				entityRole: {
					root: {
						itemName: 'ModelMaps',
						moduleName: 'cloud.desktop.moduleDisplayNameModelMap',
						mainItemName: 'ModelMap',
						useIdentification: true,
						handleUpdateDone: function (updateData, response) {
							const modelMapRuntimeDataService = $injector.get('modelMapRuntimeDataService');
							modelMapRuntimeDataService.forceReloadMap();

							serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
						}
					}
				},
				dataProcessor: [{
					processItem: function (item) {
						item.compositeId = item.ModelFk + '-' + item.Id;
					}

				}

				]
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

		serviceContainer.service.retrieveRefreshedModelMaps = function () {
			if (!_.isInteger(serviceContainer.data.pinnedModelId) || serviceContainer.data.pinnedModelId !== modelViewerModelSelectionService.getSelectedModelId()) {
				serviceContainer.service.load();
			}
		};

		serviceContainer.service.selectAfterNavigation = selectAfterNavigation;

		function selectAfterNavigation(item, triggerField) {
			if (item && triggerField && triggerField === 'Ids'){
				const ids = item.Ids.split(',').map(e => parseInt(e));
				cloudDesktopSidebarService.filterSearchFromPKeys(ids);
			}
		}

		return serviceContainer.service;
	}
})(angular);

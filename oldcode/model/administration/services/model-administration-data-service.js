/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const modelAdministrationModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationDataService
	 * @function
	 *
	 * @description
	 * The root data service that manages a dummy entity that any other data in the module is coupled to.
	 */
	modelAdministrationModule.factory('modelAdministrationDataService',
		modelAdministrationDataService);

	modelAdministrationDataService.$inject = ['platformDataServiceFactory', '_', '$q',
		'$injector','modelAdministrationViewerSettingsRuntimeService'];

	function modelAdministrationDataService(platformDataServiceFactory, _, $q,
		$injector,modelAdministrationViewerSettingsRuntimeService) {

		let serviceContainer;

		let modelAdministrationDataTreeNodeDataService;

		const dummyItems = [{
			Id: 1,
			Version: 1
		}];

		const serviceOptions = {
			flatRootItem: {
				module: modelAdministrationModule,
				serviceName: 'modelAdministrationDataService',
				entityNameTranslationID: 'model.administration.rootEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/',
					endRead: 'filtered',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'Dummy',
						moduleName: 'cloud.desktop.moduleDisplayNameModelAdministration',
						mainItemName: 'Dummy',
						handleUpdateDone: function (updateData, response, data) {
							const activeProfileId = modelAdministrationViewerSettingsRuntimeService.getActiveProfileId();
								if (activeProfileId > 0) {
									response.ModelAdministrationViewerSettingsToSave[0].Active =response.ModelAdministrationViewerSettingsToSave[0].Id == activeProfileId ? true : false;
								}
							if (updateData.DataTreesToSave) {
								if (!modelAdministrationDataTreeNodeDataService) {
									modelAdministrationDataTreeNodeDataService = $injector.get('modelAdministrationDataTreeNodeDataService');
								}
								modelAdministrationDataTreeNodeDataService.reloadTree();
							}	
							return data.handleOnUpdateSucceeded(updateData, response, data, true);
						},
					
					}
				},
				actions: {
					create: false,
					delete: false
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

		serviceContainer.data.setList(dummyItems);
		serviceContainer.data.selectedItem = dummyItems[0];

		serviceContainer.service.doPrepareUpdateCall = function (updateData) {
			updateData.MainItemId = 1;
			if (updateData.Dummy) {
				delete updateData.Dummy;
				updateData.EntitiesCount--;
			}
		};

		serviceContainer.data.needsMergeBecauseChildForcesUpdate = function () {
			return true;
		};

		_.assign(serviceContainer.data, {
			doCallHTTPRead: function () {
				serviceContainer.data.selectedItem = dummyItems[0];
				return $q.when(dummyItems);
			}
		});

		_.assign(serviceContainer.service, {
			getSelected: function () {
				return dummyItems[0];
			},
			getSelectedEntities: function () {
				return dummyItems;
			},
			hasSelection: function () {
				return true;
			},
			isSelection: function () {
				return true;
			}
		});

		return serviceContainer.service;
	}
})(angular);

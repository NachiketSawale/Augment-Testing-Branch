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
	 * @name modelAdministrationDataTreeDataService
	 * @function
	 *
	 * @description
	 * The data service for data trees.
	 */
	modelAdministrationModule.factory('modelAdministrationDataTreeDataService',
		modelAdministrationDataTreeDataService);

	modelAdministrationDataTreeDataService.$inject = ['modelAdministrationDataService',
		'platformDataServiceFactory'];

	function modelAdministrationDataTreeDataService(modelAdministrationDataService,
		platformDataServiceFactory) {

		let serviceContainer;

		const serviceOption = {
			flatNodeItem: {
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/datatree/',
					usePostForRead: false,
					endRead: 'listHeaders',
					initReadData: function initReadData(readData) {
						readData.filter = '';
					}
				},
				module: modelAdministrationModule,
				serviceName: 'modelAdministrationDataTreeDataService',
				entityNameTranslationID: 'model.administration.dataTree.dataTree',
				actions: {
					create: 'flat',
					delete: true
				},
				entityRole: {
					node: {
						itemName: 'DataTrees',
						parentService: modelAdministrationDataService
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		modelAdministrationDataService.registerRefreshRequested(function () {
			serviceContainer.service.load();
		});

		serviceContainer.service.registerSelectionChanged(function () {
			modelAdministrationDataService.update();
		});

		return serviceContainer.service;
	}
})(angular);

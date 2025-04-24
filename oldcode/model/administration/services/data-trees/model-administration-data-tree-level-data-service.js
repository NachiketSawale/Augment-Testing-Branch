/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationDataTreeLevelDataService
	 * @description Provides methods to access, create and update data tree levels.
	 */
	myModule.service('modelAdministrationDataTreeLevelDataService',
		ModelAdministrationDataTreeLevelDataService);

	ModelAdministrationDataTreeLevelDataService.$inject = ['platformDataServiceFactory',
		'modelAdministrationDataTreeDataService'];

	function ModelAdministrationDataTreeLevelDataService(platformDataServiceFactory,
		modelAdministrationDataTreeDataService) {

		const self = this;

		const serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationDataTreeLevelDataService',
				entityNameTranslationID: 'model.administration.dataTree.dataTreeLevel',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/datatreelevel/',
					endRead: 'list',
					usePostForRead: false
				},
				actions: {
					delete: true,
					create: 'flat'
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = modelAdministrationDataTreeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'DataTreeLevels',
						parentService: modelAdministrationDataTreeDataService
					}
				}
			}
		};

		platformDataServiceFactory.createService(serviceOption, self);
	}
})(angular);

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
	 * @name modelAdministrationDataTree2ModelDataService
	 * @description Provides methods to access, create and update data tree to model links.
	 */
	myModule.service('modelAdministrationDataTree2ModelDataService',
		modelAdministrationDataTree2ModelDataService);

	modelAdministrationDataTree2ModelDataService.$inject = ['platformDataServiceFactory',
		'modelAdministrationDataTreeDataService'];

	function modelAdministrationDataTree2ModelDataService(platformDataServiceFactory, modelAdministrationDataTreeDataService) {
		const self = this;
		const serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationDataTree2ModelDataService',
				entityNameTranslationID: 'model.administration.dataTree.dataTree2Model',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/datatree2model/',
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
						itemName: 'DataTree2Models',
						parentService: modelAdministrationDataTreeDataService
					}
				}
			}
		};

		platformDataServiceFactory.createService(serviceOption, self);
	}
})(angular);

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationDynHlItemDataService
	 * @description Provides methods to access, create and update dynamic highlighting items.
	 */
	myModule.service('modelAdministrationDynHlItemDataService', ModelAdministrationDynHlItemDataService);

	ModelAdministrationDynHlItemDataService.$inject = ['platformDataServiceFactory', 'modelAdministrationDynHlSchemeDataService'];

	function ModelAdministrationDynHlItemDataService(platformDataServiceFactory, modelAdministrationDynHlSchemeDataService) {
		var self = this;
		var serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationDynHlItemDataService',
				entityNameTranslationID: 'model.administration.dynHlItem',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/dynhlitem/',
					endRead: 'listbyscheme',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						var selected = modelAdministrationDynHlSchemeDataService.getSelected();
						readData.filter = '?schemeFk=' + (selected ? selected.Id : '0');
					}
				},
				actions: {
					delete: true,
					create: 'flat'
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = modelAdministrationDynHlSchemeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'DynHlItems',
						parentService: modelAdministrationDynHlSchemeDataService
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);

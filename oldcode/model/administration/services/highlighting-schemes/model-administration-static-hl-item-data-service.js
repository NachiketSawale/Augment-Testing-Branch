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
	 * @name modelAdministrationStaticHlItemDataService
	 * @description Provides methods to access, create and update static highlighting items.
	 */
	myModule.service('modelAdministrationStaticHlItemDataService', ModelAdministrationStaticHlItemDataService);

	ModelAdministrationStaticHlItemDataService.$inject = ['platformDataServiceFactory', 'modelAdministrationStaticHlSchemeDataService'];

	function ModelAdministrationStaticHlItemDataService(platformDataServiceFactory, modelAdministrationStaticHlSchemeDataService) {
		const self = this;
		const serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationStaticHlItemDataService',
				entityNameTranslationID: 'model.administration.staticHlItem',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/statichlitem/',
					endRead: 'listbyscheme',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						const selected = modelAdministrationStaticHlSchemeDataService.getSelected();
						readData.filter = '?schemeFk=' + (selected ? selected.Id : '0');
					}
				},
				actions: {
					delete: false,
					create: false
				},
				entityRole: {
					leaf: {
						itemName: 'StaticHlItems',
						parentService: modelAdministrationStaticHlSchemeDataService
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);

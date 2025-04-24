/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var modelAdministrationModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationDynHlSchemeDataService
	 * @function
	 * @requires modelAdministrationDataService, platformDataServiceFactory
	 *
	 * @description
	 * The data service for dynamic highlighting schemes.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	modelAdministrationModule.factory('modelAdministrationDynHlSchemeDataService', ['modelAdministrationDataService',
		'platformDataServiceFactory',
		function (modelAdministrationDataService, platformDataServiceFactory) {

			var serviceOption = {
				flatNodeItem: {
					httpCRUD: {
						route: globals.webApiBaseUrl + 'model/administration/dynhlscheme/',
						endRead: 'listschemes'
					},
					module: modelAdministrationModule,
					serviceName: 'modelAdministrationDynHlSchemeDataService',
					entityNameTranslationID: 'model.administration.dynHlScheme',
					actions: {
						create: 'flat',
						delete: true
					},
					entityRole: {
						node: {
							itemName: 'DynHlSchemes',
							parentService: modelAdministrationDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			modelAdministrationDataService.registerRefreshRequested(function () {
				serviceContainer.service.load();
			});
			serviceContainer.service.load();

			serviceContainer.service.registerSelectionChanged(function () {
				modelAdministrationDataService.update();
			});

			return serviceContainer.service;
		}
	]);
})(angular);

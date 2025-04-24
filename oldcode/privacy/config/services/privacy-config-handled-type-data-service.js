/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var privacyConfigModule = angular.module('privacy.config');

	/**
	 * @ngdoc service
	 * @name privacyConfigPrivacyHandleTypeDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	privacyConfigModule.factory('privacyConfigHandledTypeDataService', [ 'platformDataServiceFactory',
		function (platformDataServiceFactory) {

			var serviceOptions = {
				flatRootItem: {
					module: privacyConfigModule,
					serviceName: 'privacyConfigHandledTypeDataService',
					entityNameTranslationID: 'privacy.config.privacyHandledTypeEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'privacy/config/', // adapt to web API controller
						endRead: 'filtered',
						usePostForRead: true
					},
					entityRole: {
						root: {
							itemName: 'PrivacyHandledTypes',
							moduleName: 'cloud.desktop.moduleDisplayNamePrivacyConfig',
							mainItemName: 'PrivacyHandledType'
						}
					},
					actions: {
						create: 'flat',
						delete: true
					},
					sidebarSearch: {
						options: {
							moduleName: 'privacy.config',
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							pinningOptions: {
								isActive: false
							},
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			serviceContainer.service.load();

			return serviceContainer.service;
		}]);
})();

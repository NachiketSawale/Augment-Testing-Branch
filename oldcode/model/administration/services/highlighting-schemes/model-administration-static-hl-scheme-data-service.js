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
	 * @name modelAdministrationStaticHlSchemeDataService
	 * @function
	 * @requires modelAdministrationDataService, platformDataServiceFactory, $q
	 *
	 * @description
	 * The data service for static highlighting schemes.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	modelAdministrationModule.factory('modelAdministrationStaticHlSchemeDataService', ['modelAdministrationDataService',
		'platformDataServiceFactory', '$q', '_',
		function (modelAdministrationDataService, platformDataServiceFactory, $q, _) {

			const serviceOption = {
				flatNodeItem: {
					httpCRUD: {
						route: globals.webApiBaseUrl + 'model/administration/statichlscheme/',
						endRead: 'listschemes'
					},
					module: modelAdministrationModule,
					serviceName: 'modelAdministrationStaticHlSchemeDataService',
					entityNameTranslationID: 'model.administration.staticHlScheme',
					actions: {
						create: 'flat',
						delete: true
					},
					entityRole: {
						node: {
							itemName: 'StaticHlSchemes',
							parentService: modelAdministrationDataService
						}
					}
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			modelAdministrationDataService.registerRefreshRequested(function () {
				serviceContainer.service.load();
			});
			serviceContainer.service.load();

			serviceContainer.service.registerSelectionChanged(function () {
				modelAdministrationDataService.update();
			});

			let loadDeferred;

			serviceContainer.service.retrieveAllItems = function () {
				function listLoaded() {
					serviceContainer.service.unregisterListLoaded(listLoaded);
					loadDeferred.resolve(_.clone(serviceContainer.data.itemList));
					loadDeferred = null;
				}

				if (loadDeferred) {
					return loadDeferred.promise;
				} else if (_.isArray(serviceContainer.itemList)) {
					return $q.when(_.clone(serviceContainer.data.itemList));
				} else {
					loadDeferred = $q.defer();
					serviceContainer.service.registerListLoaded(listLoaded);
					serviceContainer.service.load();
					return loadDeferred.promise;
				}
			};

			return serviceContainer.service;
		}
	]);
})(angular);

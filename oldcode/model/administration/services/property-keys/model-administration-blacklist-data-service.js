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
	myModule.factory('modelAdministrationBlackListDataService', modelAdministrationBlackListDataService);

	modelAdministrationBlackListDataService.$inject = ['_', 'platformDataServiceFactory',
		'projectMainService', 'modelAdministrationDataService', '$q'];

	function modelAdministrationBlackListDataService(_, platformDataServiceFactory,
		projectMainService, modelAdministrationDataService, $q) {

		const serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationBlackListDataService',
				entityNameTranslationID: 'model.administration.blackList',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/blacklist/',
					endRead: 'list'
				},
				actions: {
					delete: true,
					create: 'flat'
				},

				entityRole: {
					leaf: {
						itemName: 'ModelComparePropertykeyBlackList',
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

		serviceContainer.service.registerSelectionChanged(onSelectionChanged);
		
		function onSelectionChanged(e, entity) {
			if (!entity) {
				return;
			}
			if (entity.PropertyKeyFk !== 0) {
				modelAdministrationDataService.update();
			}
		}

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
})(angular);

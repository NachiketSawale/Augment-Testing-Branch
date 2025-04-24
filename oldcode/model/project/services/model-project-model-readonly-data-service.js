/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var modelModule = angular.module('model.project');

	/**
	 * @ngdoc service
	 * @name modelProjectModelReadonlyDataService
	 * @function
	 *
	 * @description
	 * modelProjectModelReadonlyDataService is a data service for presentation of models.
	 */
	modelModule.service('modelProjectModelReadonlyDataService', modelProjectModelReadonlyDataService);

	modelProjectModelReadonlyDataService.$inject = ['_', 'platformDataServiceFactory', 'platformPermissionService', 'cloudDesktopPinningContextService', '$q'];

	function modelProjectModelReadonlyDataService(_, platformDataServiceFactory, platformPermissionService, cloudDesktopPinningContextService, $q) {

		// The instance of the main service - to be filled with functionality below

		var schedulingSchedulePresentServiceOption = {
			module: modelModule,
			serviceName: 'modelProjectModelReadonlyDataService',
			entityNameTranslationID: 'model.project.translationDescModel',
			httpRead: {route: globals.webApiBaseUrl + 'model/project/model/', endRead: 'list'},
			presenter: {list: {}},
			entitySelection: {}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingSchedulePresentServiceOption);

		var filter = 0;
		serviceContainer.service.setFilter('mainItemId=-1');

		serviceContainer.service.setNewFilter = function setNewFilter(id) {
			var deferred = $q.defer();
			if (id !== filter) {
				filter = id;
				serviceContainer.service.setFilter('mainItemId=' + filter);
				serviceContainer.service.load().then(function () {
					deferred.resolve(serviceContainer.data.itemList);
				});
			} else {
				deferred.resolve(serviceContainer.data.itemList);
			}
			return deferred.promise;
		};

		serviceContainer.service.setSelectedModel = function setSelectedModel(item) {
			var deferred = $q.defer();

			if (item) {
				var itemList = serviceContainer.service.getList();
				if (itemList) {
					var exist = _.find(itemList, item);
					if (!exist) {
						serviceContainer.service.load().then(function () {
							serviceContainer.service.setSelected(item);
							deferred.resolve();
						});
					} else {
						serviceContainer.service.setSelected(item);
						deferred.resolve();
					}
				}
			}
			return deferred.promise;
		};

		serviceContainer.service.getFilter = function getFilter() {
			return filter;
		};

		function getPinningContext() {
			var currentPinningContext = cloudDesktopPinningContextService.getContext();
			var pinnedItemFound = _.find(currentPinningContext, {token: 'project.main'});
			var newFilter = -1;
			if (pinnedItemFound) {
				if (pinnedItemFound.id.Id) {
					newFilter = pinnedItemFound.id.Id;
				} else {
					newFilter = pinnedItemFound.id;
				}
			}
			if (newFilter !== filter) {
				serviceContainer.service.setNewFilter(newFilter);
			}
		}

		cloudDesktopPinningContextService.onSetPinningContext.register(getPinningContext);
		cloudDesktopPinningContextService.onClearPinningContext.register(getPinningContext);

		serviceContainer.service.loadAllModels = function loadAllModels() {
			getPinningContext();
		};

		serviceContainer.service.getModelById = function (id) {
			var deferred = $q.defer();
			var itemList = serviceContainer.service.getList();
			if (itemList) {
				var exist = _.find(itemList, {Id: id});
				if (!exist) {
					serviceContainer.service.load().then(function () {
						exist = _.find(itemList, {Id: id});
						deferred.resolve(exist);
					});
				} else {
					deferred.resolve(exist);
				}
			}
			return deferred.promise;
		};

		return serviceContainer.service;
	}
})(angular);

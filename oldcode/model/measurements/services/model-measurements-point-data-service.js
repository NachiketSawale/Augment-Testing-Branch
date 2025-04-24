/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const modelMeasurementsModule = angular.module('model.measurements');
	const serviceName = 'modelMeasurementPointDataService';

	/**
	 * @ngdoc service
	 * @name modelMeasurementPointDataService
	 * @function
	 *
	 * @description
	 * DataService from Model Measurement Point.
	 */
	modelMeasurementsModule.factory(serviceName, modelMeasurementPointDataService);

	modelMeasurementPointDataService.$inject = ['_', '$injector', 'platformDataServiceFactory',
		'modelProjectPinnableEntityService', 'platformRuntimeDataService', 'PlatformMessenger', 'modelMeasurementDataService', '$http'];

	function modelMeasurementPointDataService(_, $injector, platformDataServiceFactory,
		modelProjectPinnableEntityService, platformRuntimeDataService, PlatformMessenger, modelMeasurementDataService, $http) {

		const serviceOptions = {
			flatLeafItem: {
				module: modelMeasurementsModule,
				serviceName: serviceName,
				entityNameTranslationID: 'model.measurements.modelMeasurementPointEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/measurement/point/',
					endRead: 'list',
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = modelMeasurementDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ModelMeasurementPoints',
						parentService: modelMeasurementDataService
					}
				},
				actions: {
					create: 'flat',
					delete: true,
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

		const onItemsDeleted = new PlatformMessenger();

		serviceContainer.service.addPoint = function (item) {
			if (item.MdlMeasurementPointEntities) {
				return $http.post(globals.webApiBaseUrl + 'model/measurement/point/createpoints', {
					measurementId: item.Id,
					points: _.map(item.MdlMeasurementPointEntities, function (item) {
						return {
							PosX: item.x,
							PosY: item.y,
							PosZ: item.z
						};
					})
				}).then(function response(res) {
					serviceContainer.data.itemList.push(...res.data);
					for (let item of res.data) {
						serviceContainer.service.markItemAsModified(item);
					}
					serviceContainer.service.gridRefresh();
				});
			}
		};

		serviceContainer.service.registerItemsDeleted = function (handler) {
			onItemsDeleted.register(handler);
		};

		serviceContainer.service.unregisterItemsDeleted = function (handler) {
			onItemsDeleted.unregister(handler);
		};

		const originalOnDeleteDone = serviceContainer.data.onDeleteDone;
		serviceContainer.data.onDeleteDone = function (deleteParams) {
			const delItems = Array.isArray(deleteParams.entities) ? deleteParams.entities : [deleteParams.entity];
			onItemsDeleted.fire(delItems);

			return originalOnDeleteDone.apply(this, arguments);
		};

		return serviceContainer.service;
	}
})(angular);

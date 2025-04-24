/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelMainModule = angular.module('model.main');

	modelMainModule.factory('modelMainLocationService', modelMainLocationService);

	modelMainLocationService.$inject = ['_', 'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension', 'modelMainFilterService',
		'modelMainObjectDataService', 'projectLocationMainImageProcessor',
		'modelMainFilterCommon'];

	function modelMainLocationService(_, platformDataServiceFactory,
		ServiceDataProcessArraysExtension, modelMainFilterService,
		modelMainObjectDataService, projectLocationMainImageProcessor,
		modelMainFilterCommon) {

		let projectSelected = modelMainObjectDataService.getSelectedProject();

		const locationServiceInfo = {
			module: modelMainModule,
			serviceName: 'modelMainLocationService',
			httpRead: {
				route: globals.webApiBaseUrl + 'project/location/',
				endRead: 'tree'
			},
			dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor],
			presenter: {tree: {parentProp: 'LocationParentFk', childProp: 'Locations'}},
			entitySelection: {}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(locationServiceInfo),
			service = serviceContainer.service;

		service.setFilter('projectId=' + projectSelected);

		service.markersChanged = function markersChanged(itemList) {
			if (_.isArray(itemList) && _.size(itemList) > 0) {
				modelMainFilterService.addFilter('modelMainLocationListController', service, function (objectItem) {
					let allIds = [];
					// get all child locations (for each item)
					_.each(itemList, function (item) {
						const Ids = _.map(modelMainFilterCommon.collectItems(item, 'Locations'), 'Id');
						allIds = allIds.concat(Ids);
					});
					return !_.isEmpty(objectItem.LocationIds) && _.some(allIds, lId => objectItem.LocationIds.includes(lId));
				}, {id: 'filterLocation', iconClass: 'tlb-icons ico-filter-location'});
			} else {
				modelMainFilterService.removeFilter('modelMainLocationListController');
			}
		};

		modelMainObjectDataService.onProjectContextUpdated.register(function () {
			const project = modelMainObjectDataService.getSelectedProject();
			if (project !== projectSelected) {
				projectSelected = project;
				service.setFilter('projectId=' + projectSelected);
				if (projectSelected !== -1) {
					service.load();
				} else {
					serviceContainer.data.itemTree.length = 0;
					serviceContainer.data.itemList.length = 0;
					serviceContainer.data.listLoaded.fire();
				}
			}
		});

		if (projectSelected !== -1) {
			service.load();
		}

		return service;
	}
})(angular);

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var modelMainModule = angular.module('model.main');
	/*jslint nomen:true */
	/*global angular, globals, _ */

	/**
	 * @ngdoc service
	 * @name controllingStructureMainService
	 * @function
	 *
	 * @description
	 * controllingStructureMainService is the data service for all structure related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	modelMainModule.factory('modelMainControllingService', ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'controllingStructureImageProcessor', 'modelMainFilterService', 'modelMainObjectDataService', 'modelMainFilterCommon',
		function (platformDataServiceFactory, ServiceDataProcessArraysExtension, controllingStructureImageProcessor, modelMainFilterService, modelMainObjectDataService, modelMainFilterCommon) {

			var projectSelected = modelMainObjectDataService.getSelectedProject();

			var controllingStructureServiceOption = {
					module: modelMainModule,
					serviceName: 'modelMainControllingService',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/structure/',
						endRead: 'tree'
					},
					presenter: {
						tree: {
							parentProp: 'ControllingunitFk',
							childProp: 'ControllingUnits',
							incorporateDataRead: function (readData, data) {
								return data.handleReadSucceeded(readData ? readData : [], data);
							}
						}
					},
					entitySelection: {},
					dataProcessor: [
						new ServiceDataProcessArraysExtension(['ControllingUnits']),
						controllingStructureImageProcessor],
					translation: {
						uid: 'controllingStructureMainService',
						title: 'Translation',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					}
				},

				serviceContainer = platformDataServiceFactory.createNewComplete(controllingStructureServiceOption),
				service = serviceContainer.service;

			service.setFilter('mainItemId=' + projectSelected);

			service.markersChanged = function markersChanged(itemList) {
				if (_.isArray(itemList) && _.size(itemList) > 0) {
					modelMainFilterService.addFilter('modelMainControllingListController', service, function (objectItem) {
						var allIds = [];
						// get all child controlling units (for each item)
						_.each(itemList, function (item) {
							var Ids = _.map(modelMainFilterCommon.collectItems(item, 'ControllingUnits'), 'Id');
							allIds = allIds.concat(Ids);
						});
						return allIds.indexOf(objectItem.ControllingUnitFk) >= 0;
					}, {id: 'filterControlling', iconClass: 'tlb-icons ico-filter-controlling'}, 'MdcControllingUnitFk');
				} else {
					modelMainFilterService.removeFilter('modelMainControllingListController');
				}
			};

			modelMainObjectDataService.onProjectContextUpdated.register(function () {
				var project = modelMainObjectDataService.getSelectedProject();
				if (project !== projectSelected) {
					projectSelected = project;
					if (projectSelected !== -1) {
						service.setFilter('mainItemId=' + projectSelected);
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
		}]);
})(angular);

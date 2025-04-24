/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var module = angular.module('model.map');

	/**
	 * @ngdoc service
	 * @name modelMapDataService
	 * @function
	 *
	 * @description
	 * modelMapDataService is the data service for model map area related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	module.factory('modelMapAreaDataService', ['platformDataServiceFactory', 'modelMapDataService',
		function (platformDataServiceFactory, modelMapDataService) {

			// The instance of the main service - to be filled with functionality below

			var exceptServiceOption = {
				flatNodeItem: {
					module: module,
					serviceName: 'modelMapAreaDataService',
					entityNameTranslationID: 'model.map.description',
					httpCreate: {
						route: globals.webApiBaseUrl + 'model/map/area/'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'model/map/area/',
						endRead: 'list',
						usePostForRead: false,
						initReadData: function (readData) {
							var selectedModelMap = modelMapDataService.getSelected();
							readData.filter = '?modelId=' + selectedModelMap.ModelFk + '&mapId=' + selectedModelMap.Id;
						}

					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedModelMap = modelMapDataService.getSelected();
								if (selectedModelMap) {
									creationData.PKey1 = selectedModelMap.ModelFk;
									creationData.PKey2 = selectedModelMap.Id;
								}
							}
						}

					},
					actions: {
						create: 'flat',
						delete: true,
						canCreateCallBackFunc: function () {
							// check if there is selected map otherwise disable creating map area
							var selectedModelMap = modelMapDataService.getSelected();
							if (selectedModelMap) {
								return true;
							} else {
								return false;
							}
						}
					},
					entityRole: {
						node: {
							itemName: 'ModelMapAreas',
							moduleName: 'cloud.desktop.moduleDisplayNameModelMap',
							mainItemName: 'ModelMapArea',
							useIdentification: true,
							parentService: modelMapDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

			return serviceContainer.service;
		}]);
})(angular);

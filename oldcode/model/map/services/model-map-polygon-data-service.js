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
	 * @name modelMapPolygonDataService
	 * @function
	 *
	 * @description
	 * modelMapPolygonDataService is the data service for model map polygon related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	module.factory('modelMapPolygonDataService', ['_', 'platformDataServiceFactory', 'modelMapAreaDataService',
		function (_, platformDataServiceFactory, modelMapAreaDataService) {

			// The instance of the main service - to be filled with functionality below

			var exceptServiceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'modelMapPolygonDataService',
					entityNameTranslationID: 'model.map.description',
					httpCreate: {
						route: globals.webApiBaseUrl + 'model/map/polygon/'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'model/map/polygon/',
						endRead: 'list',
						usePostForRead: false,
						initReadData: function (readData) {
							var selectedModelMapArea = modelMapAreaDataService.getSelected();
							var modelId = selectedModelMapArea.ModelFk;
							var selectedModelAreaMap = modelMapAreaDataService.getSelected();
							readData.filter = '?modelId=' + modelId + '&mapAreaId=' + selectedModelAreaMap.Id;
						}

					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedModelMapArea = modelMapAreaDataService.getSelected();
								if (selectedModelMapArea) {
									creationData.PKey1 = selectedModelMapArea.ModelFk;
									creationData.PKey2 = selectedModelMapArea.Id;
								}

							}
						}

					},
					actions: {
						create: 'flat',
						delete: true,
						canCreateCallBackFunc: function () {
							// check if there is already model selected otherwise disbale create button
							var selectedModelMapArea = modelMapAreaDataService.getSelected();
							if (selectedModelMapArea) {
								return true;
							} else {
								return false;
							}

						}
					},
					entityRole: {
						leaf: {
							itemName: 'ModelMapPolygons',
							moduleName: 'cloud.desktop.moduleDisplayNameModelMap',
							mainItemName: 'ModelMapPolygon',
							useIdentification: true,
							parentService: modelMapAreaDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

			/**
			 * @ngdoc function
			 * @name parsePointsStr
			 * @function
			 * @methodOf modelMapPolygonListController
			 * @description parse stringfied Points string to array of points.
			 * @param {String Points} String of polygon points which is extracted from Databse.
			 * @returns {Array Polygon.Points}.
			 */
			serviceContainer.service.parsePointsStr = function (pointsStr) {
				var parsedPoints = [];
				var pointsArr = _.isString(pointsStr) ? pointsStr.split(';') : [];

				for (var i = 0; i < pointsArr.length; i++) {
					var point = [];
					point.x = parseInt(pointsArr[i].split(',')[0]) / 1000;
					point.y = parseInt(pointsArr[i].split(',')[1]) / 1000;

					point.push(point.x);
					point.push(point.y);

					parsedPoints.push(point);
				}

				return parsedPoints;
			};
			return serviceContainer.service;
		}]);
})(angular);

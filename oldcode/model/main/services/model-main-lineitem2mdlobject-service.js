/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	/*global angular */
	/* global globals */
	'use strict';

	var moduleName = 'model.main';
	var modelMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name modelMainEstLineItem2ObjectService
	 * @function
	 * @description
	 * modelMainEstLineItem2ObjectService is the data service for estimate line item model object related functionality.
	 */
	modelMainModule.factory('modelMainEstLineItem2ObjectService',
		['_', '$http', 'platformDataServiceFactory', 'modelViewerModelSelectionService', 'modelMainObjectDataService',
			'cloudDesktopPinningContextService', 'platformRuntimeDataService',
			function (_, $http, platformDataServiceFactory, modelViewerModelSelectionService, modelMainObjectDataService,
			          cloudDesktopPinningContextService, platformRuntimeDataService) {

				var pinnedEstimate;
				pinnedEstimate = undefined;

				var modelMainEstLineItem2ObjectOption = {
					flatNodeItem: {
						module: modelMainModule,
						serviceName: 'modelMainEstLineItem2ObjectService',
						dataProcessor: [{processItem: processItem}],
						httpCreate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/',
							endRead: 'listlineitemsbyobjectid',
							initReadData: function initReadData(readData) {
								var selectedItem = modelMainObjectDataService.getSelected();
								var selectedModel = modelMainObjectDataService.getSelectedModel();
								// readData.EstHeaderFk = selectedModel.EstimateHeaderFk;
								readData.EstHeaderFk = -1;
								if (service.isEstimatePinned) {
									readData.EstHeaderFk = pinnedEstimate;
								}
								readData.MdlModelFk = selectedModel.Id;
								readData.MdlObjectFk = selectedItem.Id;
							},
							usePostForRead: true
						},
						actions: {
							delete: true, canDeleteCallBackFunc: function () {
								return true;
							},
							create: 'flat', canCreateCallBackFunc: function () {
								return service.isEstimatePinned();
							}
						},
						entitySelection: {},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									// var selectedItem = modelMainObjectDataService.getSelected();
									var selectedModel = modelMainObjectDataService.getSelectedModel();
									creationData.EstHeaderFk = pinnedEstimate;
									creationData.MdlModelFk = selectedModel.Id;
									// creationData.MdlObjectFk = selectedItem.Id;
								},
								handleCreateSucceeded: function (newData) {
									var selectedItem = modelMainObjectDataService.getSelected();
									var selectedModel = modelMainObjectDataService.getSelectedModel();
									newData.EstHeaderFk = pinnedEstimate;
									newData.MdlModelFk = selectedModel.Id;
									newData.MdlObjectFk = selectedItem.Id;
									return newData;
								}
							}
						},
						entityRole: {leaf: {itemName: 'EstLineItem2Object', parentService: modelMainObjectDataService}}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(modelMainEstLineItem2ObjectOption);
				var service = serviceContainer.service;

				service.isEstimatePinned = function () {
					return !angular.isUndefined(pinnedEstimate);
				};

				cloudDesktopPinningContextService.onSetPinningContext.register(getPinnedEstimate);

				function processItem(item) {
					var fields = null;
					fields = [
						{
							field: 'EstLineItemFk',
							readonly: item.Version > 0
						}
					];
					platformRuntimeDataService.readonly(item, fields);
				}

				function getPinnedEstimate() {
					var pinnedContext = cloudDesktopPinningContextService.getContext();
					var found = _.find(pinnedContext, {token: 'estimate.main'});
					if (found) {
						pinnedEstimate = found.id;
					} else {
						pinnedEstimate = undefined;
					}
				}

				getPinnedEstimate();

				return service;
			}]);
})(angular);

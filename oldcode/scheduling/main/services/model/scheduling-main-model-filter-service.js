/* global globals */
/*
 * $Id: scheduling-main-model-filter-service.js 634480 2021-04-28 12:48:05Z sprotte $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling.main.schedulingMainModelFilterService
	 * @function
	 * @requires _, $http, schedulingMainService, modelViewerModelSelectionService, modelViewerObjectTreeService,
	 *           modelViewerModelIdSetService
	 *
	 * @description Represents a filter function for the main entity filter in the Scheduling module.
	 */
	angular.module('scheduling.main').factory('schedulingMainModelFilterService', ['_', '$http',
		'schedulingMainService', 'modelViewerModelSelectionService', 'modelViewerObjectTreeService',
		'modelViewerModelIdSetService',
		function (_, $http, schedulingMainService, modelViewerModelSelectionService, modelViewerObjectTreeService,
			modelViewerModelIdSetService) {
			var data = {
				viewerPromise: null,
				filterFunc: function filterModelBySchedulingMain(results) {
					if (data.viewerPromise) {
						return data.viewerPromise;
					} else {
						var activities = schedulingMainService.getSelectedEntities();
						var selectedModelId = modelViewerModelSelectionService.getSelectedModelId();
						if (selectedModelId) {
							if (_.isEmpty(activities)) {
								activities = schedulingMainService.getList();
							}
							if (_.isEmpty(activities)) {
								results.excludeAll();
							} else {
								var modelData = {
									activityIds: _.map(activities, function (a) {
										return a.Id;
									}).join(':'),
									modelId: selectedModelId
								};

								data.viewerPromise = $http.get(globals.webApiBaseUrl + 'scheduling/main/activity2model/objects?modelId=' + modelData.modelId + '&activityIds=' + modelData.activityIds);
								return data.viewerPromise.then(function (response) {
									var treeInfo = modelViewerObjectTreeService.getTree();
									if (treeInfo) {
										data.viewerPromise = null;
										var objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds();
										var meshIds = treeInfo.objectToMeshIds(objectIds);
										results.setIncludedMeshIds(meshIds);
									}
								});
							}
						}
					}
				}
			};

			return data.filterFunc;
		}]);
})();
/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name estimate.main.estimateMainModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Estimate module.
	 */
	angular.module('estimate.main').factory('estimateMainModelFilterService', ['_', '$http', 'estimateMainService',
		'modelViewerModelSelectionService', 'modelViewerObjectTreeService', 'modelViewerModelIdSetService',
		function (_, $http, estimateMainService, modelViewerModelSelectionService, modelViewerObjectTreeService,
			modelViewerModelIdSetService) {
			let data = {
				viewerPromise: null,
				filterFunc: function filterModelByEstimateMain(results) {
					if (data.viewerPromise) {
						return data.viewerPromise;
					} else {
						let lineItems = estimateMainService.getSelectedEntities();
						let selectedModel = modelViewerModelSelectionService.getSelectedModel();
						if (selectedModel) {
							if (_.isEmpty(lineItems)) {
								lineItems = estimateMainService.getList();
							}
							if (_.isEmpty(lineItems)) {
								results.excludeAll();
							} else {
								let modelData = {
									EstLineItemFks: _.filter(_.map(lineItems, function (li) {
										return {
											PKey1: li.EstHeaderFk,
											Id: li.Id
										};
									}), li => _.isInteger(li.PKey1) && _.isInteger(li.Id)),
									MdlModelFk: selectedModel.info.modelId
								};
								data.viewerPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/allobjectids', [modelData]);
								return data.viewerPromise.then(function (response) {
									let treeInfo = modelViewerObjectTreeService.getTree();
									if (treeInfo) {
										data.viewerPromise = null;
										let objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds();
										let meshIds = treeInfo.objectToMeshIds(objectIds);
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

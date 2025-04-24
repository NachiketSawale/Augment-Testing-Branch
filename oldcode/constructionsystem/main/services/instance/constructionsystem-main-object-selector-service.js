/*
 * $Id: constructionsystem-main-object-selector-service.js 619717 2021-01-13 06:40:37Z lvy $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/* global globals */
	/**
	 * @ngdoc service
	 * @name constructionsystem.main.constructionsystemMainObjectSelectorService
	 * @function
	 * @requires modelViewerSelectorService
	 *
	 * @description Registers object selectors related to the COS module.
	 */
	angular.module('constructionsystem.main').factory('constructionsystemMainObjectSelectorService', ['modelViewerSelectorService',
		'$injector',
		'$http',
		'modelViewerModelIdSetService',
		'modelViewerObjectTreeService',
		'modelViewerModelSelectionService',
		function (modelViewerSelectorService,
			$injector,
			$http,
			modelViewerModelIdSetService,
			modelViewerObjectTreeService,
			modelViewerModelSelectionService) {
			var service = {
				constructionsystemCategoryId: 'constructionsystem'
			};

			modelViewerSelectorService.registerCategory({
				id: service.constructionsystemCategoryId,
				name: 'constructionsystem.main.modelObjectSelectors.category'
			});

			modelViewerSelectorService.registerSelector({
				name: 'constructionsystem.main.modelObjectSelectors.unassigned',
				category: service.constructionsystemCategoryId,
				isAvailable: function () {
					var mainService = $injector.get('constructionSystemMainInstanceService');
					var modelId = mainService.getCurrentSelectedModelId();
					var instanceHeaderId = mainService.getCurrentInstanceHeaderId();
					var selectedModel = modelViewerModelSelectionService.getSelectedModel();
					return modelId !== null && modelId !== undefined && instanceHeaderId !== null && instanceHeaderId !== undefined && selectedModel !== null && selectedModel !== undefined;
				},
				getObjects: function () {
					var selectedModel = modelViewerModelSelectionService.getSelectedModel();

					if (selectedModel) {
						var mainService = $injector.get('constructionSystemMainInstanceService');
						var data = {
							InstanceHeaderFk: mainService.getCurrentInstanceHeaderId(),
							ModelFk: selectedModel.info.modelId
						};
						if (!data.viewerPromise) {
							data.viewerPromise = $http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance2object/allobjectids', [data]);
							return data.viewerPromise.then(function (response) {
								var treeInfo = modelViewerObjectTreeService.getTree();
								if (treeInfo) {
									data.viewerPromise = null;
									var objectIds = treeInfo.invertObjectIds(modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds(), true);
									return {
										objectIds: objectIds
									};
								}
							});
						}
					}
				}
			});

			return service;
		}]);
})();
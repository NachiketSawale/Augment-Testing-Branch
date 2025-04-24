(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonModelFilterService', [
		'modelViewerStandardFilterService', '$http', '$q',
		'modelViewerModelSelectionService', 'modelViewerObjectTreeService', 'modelViewerModelIdSetService',
		'platformObjectHelper',
		function (modelViewerStandardFilterService, $http, $q,
		          modelSelectionService, modelViewerObjectTreeService, modelViewerModelIdSetService,
		          platformObjectHelper) {
			var moduleName2FilterProp = {
				'productionplanning.header': 'ppsHeaderIds',
				'productionplanning.item': 'ppsItemIds',
				'productionplanning.product': 'ppsProductIds',
				'productionplanning.report': 'ppsInstallationReportIds',
				'productionplanning.mounting': 'ppsInstallationIds',
				'productionplanning.activity': 'ppsInstallationActivityIds'
			};

			function updateFilter(resultController, compressedObjIds) {
				// when model selection service is ready then execute code below.
				if (modelSelectionService.getSelectedModelId()) {
					var treeInfo = modelViewerObjectTreeService.getTree();
					if (treeInfo) {
						var objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(compressedObjIds).useSubModelIds();
						var meshIds = treeInfo.objectToMeshIds(objectIds);
						resultController.setIncludedMeshIds(meshIds);
						return objectIds.useGlobalModelIds();
					}
				}
				return new modelViewerModelIdSetService.ObjectIdSet();
			}

			this.updateMainEntityFilter = function () {
				modelViewerStandardFilterService.updateMainEntityFilter();
			};

			var cache = {};
			this.getFilterFn = function (moduleName, dataService, entityIdsGetter){
				if(!cache[moduleName]) {
					cache[moduleName] = function (resultController) {
						var entityIdsPromise = $q.defer();
						// get selected entities
						if(!entityIdsGetter) {
							var ids = dataService.getSelectedEntities().map(function (entity) {
								return entity.Id;
							});
							entityIdsPromise.resolve(ids);
						} else {
							var getterResult = entityIdsGetter();
							if(!platformObjectHelper.isPromise(getterResult)) {
								entityIdsPromise.resolve(getterResult);
							} else {
								getterResult.then(function (entityIds) {
									entityIdsPromise.resolve(entityIds);
								});
							}
						}

						entityIdsPromise.promise.then(function (entityIds) {
							if(entityIds.length > 0) {
								var data = {};
								data[moduleName2FilterProp[moduleName]] = entityIds;
								return $http.post(globals.webApiBaseUrl + 'productionplanning/common/model/objectids', data).then(function (result) {
									if (result.status === 200) {
										return updateFilter(resultController, result.data);
									} else { // jshint ignore:line
										// TODO: error handling
									}
								});
							} else {
								return $q.when(updateFilter(resultController, ''));
							}
						});
					};
				}
				return cache[moduleName];
			};
		}
	]);
})();
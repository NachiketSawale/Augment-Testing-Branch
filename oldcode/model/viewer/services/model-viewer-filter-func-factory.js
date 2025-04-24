/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerFilterFuncFactory
	 * @function
	 *
	 * @description Generates a standard model object filter function.
	 */
	angular.module('model.viewer').factory('modelViewerFilterFuncFactory',
		modelViewerFilterFuncFactory);

	modelViewerFilterFuncFactory.$inject = ['_', '$injector', '$q',
		'modelViewerModelSelectionService', 'modelViewerObjectTreeService',
		'modelViewerModelIdSetService', 'modelViewerStandardFilterService'];

	function modelViewerFilterFuncFactory(_, $injector, $q,
		modelViewerModelSelectionService, modelViewerObjectTreeService,
		modelViewerModelIdSetService, modelViewerStandardFilterService) {

		const service = {};

		service.createForDataService = function (services) {
			const actualServices = _.isArray(services) ? services : (_.isObject(services) ? [services] : []);

			if (actualServices.length <= 0) {
				throw new Error('No data services specified.');
			}
			const svcInfoLists = _.map(actualServices, function (svcList) {
				if (!_.isArray(svcList)) {
					svcList = [svcList];
				}
				return _.map(svcList, function (svc) {
					if (!_.isObject(svc)) {
						throw new Error('Invalid configuration object.');
					}
					if (!_.isString(svc.serviceName)) {
						throw new Error('No data service specified.');
					}

					const result = {
						serviceName: svc.serviceName,
						retrieveObjectIds: svc.retrieveObjectIds,
						getDataService: function () {
							if (!this.dataService) {
								this.dataService = $injector.get(this.serviceName);
							}
							return this.dataService;
						}
					};

					if (!_.isFunction(svc.retrieveObjectIds)) {
						const ds = result.getDataService();
						if (_.isFunction(ds.retrieveModelObjectIds)) {
							result.retrieveObjectIds = function (info) {
								return ds.retrieveModelObjectIds(info);
							};
						} else {
							throw new Error('No retrieveObjectIds function supplied in config and no retrieveModelObjectIds function found on data service.');
						}
					}

					return result;
				});
			});

			function findRelevantItems() {
				let items = [];
				let i = 0;
				while (i < svcInfoLists.length) {
					const svcInfos = modelViewerStandardFilterService.orderServiceNamesByLastSelectionChange(svcInfoLists[i], function (svcInfo) {
						return svcInfo.serviceName;
					});

					let j = 0;
					while (j < svcInfos.length) {
						const svcInfo = svcInfos[j];
						const dataService = svcInfo.getDataService();
						items = dataService.getSelectedEntities();

						if (_.isEmpty(items)) {
							if (i === svcInfos.length - 1) {
								items = dataService.getList();
							}
						}

						if (!_.isEmpty(items)) {
							return {
								items: items,
								retrieveObjectIds: svcInfo.retrieveObjectIds
							};
						}

						j++;
					}

					i++;
				}
				return null;
			}

			const data = {
				viewerPromise: null,
				filterFunc: function filterModel(results) {
					if (data.viewerPromise) {
						return data.viewerPromise;
					} else {
						const selectedModelId = modelViewerModelSelectionService.getSelectedModelId();
						if (selectedModelId) {
							const relevantItems = findRelevantItems();
							if (relevantItems) {
								data.viewerPromise = $q.when(relevantItems.retrieveObjectIds({
									modelId: selectedModelId,
									items: relevantItems.items
								}));

								return data.viewerPromise.then(function (objectIdStr) {
									const treeInfo = modelViewerObjectTreeService.getTree();
									if (treeInfo) {
										data.viewerPromise = null;
										const objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(objectIdStr).useSubModelIds();
										const meshIds = treeInfo.objectToMeshIds(objectIds);
										results.setIncludedMeshIds(meshIds);
									}
								});
							} else {
								results.excludeAll();
							}
						}
					}
				}
			};

			return data.filterFunc;
		};

		return service;
	}
})(angular);

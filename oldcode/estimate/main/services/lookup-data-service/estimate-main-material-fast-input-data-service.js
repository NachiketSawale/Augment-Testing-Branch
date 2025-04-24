(function (angular) {
	'use strict';
	angular.module('estimate.main').factory('estimateMainMaterialFastInputDataService', [
		'_',
		'$q',
		'$http',
		'$translate',
		'$injector',
		'platformGridAPI',
		'estimateMainCommonService',
		'estimateMainConfigDetailService',
		'estimateMainPrjMaterialLookupService',
		'estimateMainResourceService',
		'cloudDesktopPinningContextService',
		function (_, $q, $http, $translate, $injector, platformGridAPI, estimateMainCommonService, estimateMainConfigDetailService, estimateMainPrjMaterialLookupService, estimateMainResourceService, cloudDesktopPinningContextService) {
			let cache = new Map();
			const service = {};
			const baseUrl = globals.webApiBaseUrl + 'basics/material/commoditysearch/';

			service.resolveStringValueCallback = function(){
				return function (value, options, item, column) {
					if (!item) {
						return $q.when([]);
					}
					return service.getSearchList(value, 'Code', item, column).then(function (returnValues) {
						if (returnValues && returnValues.length) {
							return {
								apply: true,
								valid: true,
								value: returnValues[0].Code,
							};
						}
						return {
							apply: true,
							valid: false,
							value: value,
							error: 'not found!',
						};
					});
				};
			};

			service.getItemById = function (id) {
				return cache.get(id);
			};

			service.getItemByIdAsync = function (id) {
				const item = cache.get(id);

				if (item) {
					return $q.when(item);
				}

				return $http.get(baseUrl + 'getcommoditybyid?materialId=' + id).then(function (response) {
					const data = response.data;

					if (data) {
						cache.set(id, data);
					}

					return data;
				});
			};

			service.getSearchList = function (value, options, item, column) {
				if (!value) {
					return $q.when([]);
				}

				const usageContext = getUsageContext(column);

				//because it can not distinguish between the estimate, the master assembly and the project material.
				//also it can not be refreshed when the material is changed.
				// const cacheItem = searchMaterialFromCache(value);
				//
				// if (cacheItem) {
				// 	setSelectedItem(usageContext, cacheItem);
				// 	return $q.when([cacheItem]);
				// }

				const fastSearchPayload = {
					Code: value,
				};

				if (usageContext === 'estimateAssembliesResourceService') {
					service.prepareSearchPayloadForAssembly(fastSearchPayload);
				} else if(usageContext === 'projectAssemblyResourceService'){
					service.prepareSearchPayloadForAssembly(fastSearchPayload);
					fastSearchPayload.HasProjectMaterial = true;
				} else {
					service.prepareSearchPayloadForEstimate(fastSearchPayload);
					fastSearchPayload.HasProjectMaterial = true;
				}

				return $http.post(baseUrl + 'fastsearch', fastSearchPayload).then(function (response) {
					const item = response.data;

					if (item) {
						cache.set(item.Id, item);
						setSelectedItem(usageContext, item);
						return [item];
					}

					return [];
				});
			};

			function getUsageContext(column) {
				return _.get(column, 'editorOptions.lookupOptions.usageContext', '');
			}

			function searchMaterialFromCache(code) {
				const items = [...cache.values()];

				return _.find(items, (item) => {
					return item.Code && item.Code.toLowerCase() === code.toLowerCase();
				});
			}

			function setSelectedItem(usageContext, selectedItem) {
				let usageContextService = usageContext ? $injector.get(usageContext) : null;
				if (usageContextService && angular.isFunction(usageContextService.setSelectedMaterialLookupItem)) {
					usageContextService.setSelectedMaterialLookupItem(selectedItem);
				} else {
					estimateMainCommonService.setSelectedLookupItem(selectedItem);
					estimateMainConfigDetailService.setSelectedLookupItem(selectedItem);
					estimateMainPrjMaterialLookupService.markPrjMaterialAsModified({ selectedItem: selectedItem }, estimateMainResourceService.getList());
				}
			}

			service.prepareSearchPayloadForAssembly = function (fastSearchPayload) {
				let isPrjAssembly = platformGridAPI.grids.exist('20c0401f80e546e1bf12b97c69949f5b');

				fastSearchPayload.isMaster = true;
				fastSearchPayload.CategoryIdsFilter = [];
				fastSearchPayload.MaterialTypeFilter = {
					IsForEstimate: true,
					IsPrjAssembly: isPrjAssembly,
				};

				if (isPrjAssembly) {
					let project = $injector.get('projectMainService').getSelected();
					fastSearchPayload.ProjectId = project ? project.Id : null;

					let itemSelected = $injector.get('projectAssemblyMainService').getSelected();
					fastSearchPayload.LgmJobFk = itemSelected ? itemSelected.LgmJobFk : null;
				}

				let assemblyService = isPrjAssembly ? $injector.get('projectAssemblyMainService') : $injector.get('estimateAssembliesService');
				let assemblyCategory = assemblyService.getAssemblyCategory();
				let estAssemblyTypeLogics = $injector.get('estimateMainCommonService').getEstAssemblyTypeLogics();
				if (assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly || assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated)) {
					fastSearchPayload.IsLabour = true;
				}
			};

			service.prepareSearchPayloadForEstimate = function (fastSearchPayload) {
				let item = cloudDesktopPinningContextService.getPinningItem('project.main');
				if (item) {
					fastSearchPayload.ProjectId = item.id;
					fastSearchPayload.LgmJobFk = estimateMainPrjMaterialLookupService.getJobFk();
				}
			};

			return service;
		},
	]);
})(angular);

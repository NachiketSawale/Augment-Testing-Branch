/**
 * Created by chi on 1/4/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogPriceListService', projectMainUpdatePriceFromCatalogPriceListService);

	projectMainUpdatePriceFromCatalogPriceListService.$inject = [
		'_',
		'globals',
		'platformDataServiceFactory',
		'projectMainUpdatePriceFromCatalogMainService',
		'ServiceDataProcessDatesExtension',
		'projectMainUpdatePriceFromCatalogPriceListSourceOption',
		'PlatformMessenger',
		'projectMainUpdatePriceFromCatalogAdditionalData',
		'platformRuntimeDataService'
	];

	function projectMainUpdatePriceFromCatalogPriceListService(
		_,
		globals,
		platformDataServiceFactory,
		projectMainUpdatePriceFromCatalogMainService,
		ServiceDataProcessDatesExtension,
		projectMainUpdatePriceFromCatalogPriceListSourceOption,
		PlatformMessenger,
		projectMainUpdatePriceFromCatalogAdditionalData,
		platformRuntimeDataService
	) {
		var localCache = {};
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'projectMainUpdatePriceFromCatalogPriceListService',
			httpRead: {
				useLocalResource: true,
				resourceFunction: function () {
					var prjMatId = projectMainUpdatePriceFromCatalogMainService.prjMaterialId;
					if (prjMatId) {
						return localCache[prjMatId];
					}

					return [];
				}
			},
			presenter: {
				list: {}
			},
			entitySelection: {},
			modification: {},
			actions: {
				delete: false,
				create: false
			},
			dataProcessor: [
				new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])
			]
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		var prjMat2SourceOption = null;

		var isLoading = new PlatformMessenger();
		serviceContainer.data.markItemAsModified = function () {
		};
		service.markItemAsModified = function () {
		};
		data.listLoaded.register(onListLoaded);
		service.registerListLoadStarted(onListLoadStarted);
		service.changeSourceOption = changeSourceOption;
		service.collectSourceInfo = collectSourceInfo;
		service.reset = reset;
		service.changeAllToSelected = changeAllToSelected;
		service.getSelection = getSelection;
		service.isLoading = isLoading;
		service.getListByPrjMaterialIds = getListByPrjMaterialIds;
		service.getSourceOptionsByPrjMaterialIds = getSourceOptionsByPrjMaterialIds;
		service.checkIsValid = checkIsValid;

		projectMainUpdatePriceFromCatalogMainService.priceListLoaded.register(onDataLoaded);
		projectMainUpdatePriceFromCatalogMainService.projectMaterialSelectionChanged.register(onProjectMaterialSelectionChanged);
		projectMainUpdatePriceFromCatalogMainService.specificPriceVersionSelected.register(onSpecificPriceVersionSelected);

		return service;

		//////////////////////////////
		function onProjectMaterialSelectionChanged() {
			service.load();
		}

		function changeSourceOption(prjMatId) {
			var list = prjMatId && localCache.hasOwnProperty(prjMatId) ? localCache[prjMatId] : service.getList();
			var total = 0; // 0: none; 1: only base material; 2: only one price version; >=3: mixed base material and price version
			var isBase = 1;
			var isVersion = 2;
			prjMatId = prjMatId || projectMainUpdatePriceFromCatalogMainService.prjMaterialId;
			if (!prjMatId) {
				return;
			}

			_.forEach(list, function (item) {
				if (item.Selected) {
					if (item.Id === -1) {
						total += isBase;
					} else {
						total += isVersion;
					}
				}
			});
			if (total === 0) {
				prjMat2SourceOption[prjMatId] = projectMainUpdatePriceFromCatalogPriceListSourceOption.None;
			} else if (total === 1) {
				prjMat2SourceOption[prjMatId] = projectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase;
			} else if (total === 2) {
				prjMat2SourceOption[prjMatId] = projectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyOneVersion;
			} else {
				prjMat2SourceOption[prjMatId] = projectMainUpdatePriceFromCatalogPriceListSourceOption.Mixed;
			}
		}

		function collectSourceInfo(prjMatId) {
			var list = prjMatId && localCache.hasOwnProperty(prjMatId) ? localCache[prjMatId] : service.getList();
			var selectedItems = _.filter(list, {Selected: true});
			var materialId = -1;
			prjMatId = prjMatId || projectMainUpdatePriceFromCatalogMainService.prjMaterialId;

			if (selectedItems.length > 0) {
				materialId = selectedItems[0].MaterialId;
			}

			return {
				selectedItems: selectedItems,
				sourceOption: prjMat2SourceOption[prjMatId],
				materialId: materialId
			};
		}

		function reset() {
			localCache = {};
			prjMat2SourceOption = null;
			data.clearContent(data);
		}

		function changeAllToSelected(check) {
			var list = service.getList();

			_.forEach(list, function (item) {
				item.Selected = check || false;
			});
		}

		function getSelection() {
			return _.filter(service.getList(), {Selected: true});
		}

		function onListLoaded() {
			isLoading.fire(null, false);
		}

		function onListLoadStarted() {
			isLoading.fire(null, true);
		}

		function onDataLoaded(e, data) {

			const mergedObj = Object.assign({}, localCache, data);
			const uniqueKeys = Array.from(new Set(Object.keys(mergedObj)));
			const uniqueObj = {};
			uniqueKeys.forEach(key => {
				uniqueObj[key] = mergedObj[key];
			});
			localCache = uniqueObj;
			prjMat2SourceOption = {};
			for (var prop in localCache) {
				if (localCache.hasOwnProperty(prop)) {
					var foundBase = _.find(localCache[prop], {PriceVersionFk: -1});
					if (foundBase) {
						foundBase.PriceVersionFk = projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId;
					}
					prjMat2SourceOption[prop] = projectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase;
				}
			}
		}

		function getListByPrjMaterialIds(ids) {
			if (!localCache || !angular.isArray(ids) || ids.length === 0) {
				return null;
			}

			var selection = null;
			_.forEach(ids, function (id) {
				if (angular.isArray(localCache[id]) && localCache[id].length > 0) {
					selection = selection || {};
					selection[id] = _.filter(localCache[id], {Selected: true});
				}
			});

			return selection;
		}

		function getSourceOptionsByPrjMaterialIds(ids) {
			if (!localCache || !angular.isArray(ids) || ids.length === 0) {
				return null;
			}

			var options = null;
			_.forEach(ids, function (id) {
				if (prjMat2SourceOption[id]) {
					options = options || {};
					options[id] = prjMat2SourceOption[id];
				}
			});

			return options;
		}

		function onSpecificPriceVersionSelected(e, args) {
			var versionFk = args.priceVersionFk;
			var ProjectMaterials = args.ProjectMaterials;
			var prjMaterials = null;
			var prjMat2PriceList = null;
			_.forEach(ProjectMaterials, function (prjMat) {
				var priceList = localCache[prjMat.Id];
				if (angular.isArray(priceList) && priceList.length > 0) {
					var found = _.find(priceList, {PriceVersionFk: versionFk});
					if (found) {
						_.forEach(priceList, function (item) {
							item.Selected = false;
						});
						found.Selected = true;
						if (versionFk !== projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId &&
							versionFk !== projectMainUpdatePriceFromCatalogAdditionalData.weightedPriceVersionId) {
							prjMat2SourceOption[prjMat.Id] = projectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyOneVersion;
						} else {
							prjMat2SourceOption[prjMat.Id] = projectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase;
						}
						prjMaterials = prjMaterials || [];
						prjMat2PriceList = prjMat2PriceList || {};
						prjMaterials.push(prjMat);
						prjMat2PriceList[prjMat.Id] = found;
					}
				}
			});

			service.gridRefresh();
			if (prjMaterials && prjMat2PriceList) {
				projectMainUpdatePriceFromCatalogMainService.priceListWithSpecVersionUpdated.fire(null, {
					priceVersionFk: versionFk,
					prjMaterials: prjMaterials,
					prjMat2PriceList: prjMat2PriceList
				});
			}
		}

		function checkIsValid(selections) {
			if (!selections) {
				return true;
			}
			for (var prop in selections) {
				if (selections.hasOwnProperty(prop)) {
					var list = selections[prop];
					if (hasError(list)) {
						return false;
					}
				}
			}
			return true;
		}

		function hasError(list) {
			if (!angular.isArray(list)) {
				return false;
			}
			for (var i = 0; i < list.length; ++i) {
				var item = list[i];
				for (var field in item) {
					if (item.hasOwnProperty(field)) {
						var _hasError = platformRuntimeDataService.hasError(item, field);
						if (_hasError) {
							return true;
						}
					}
				}
			}
			return false;
		}
	}
})(angular);

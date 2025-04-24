/**
 * Created by jie on 12/27/2023.
 */
(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceByMaterialCatalogService', projectMainUpdatePriceByMaterialCatalogService);

	projectMainUpdatePriceByMaterialCatalogService.$inject = [
		'_',
		'$injector',
		'$http',
		'$translate',
		'globals',
		'platformDataServiceFactory',
		'projectMainUpdatePriceFromCatalogMainService',
		'projectMainUpdatePriceFromCatalogPriceListSourceOption',
		'PlatformMessenger',
		'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService',
		'projectMainUpdatePriceFromCatalogAdditionalData'
	];

	function projectMainUpdatePriceByMaterialCatalogService(
		_,
		$injector,
		$http,
		$translate,
		globals,
		platformDataServiceFactory,
		projectMainUpdatePriceFromCatalogMainService,
		projectMainUpdatePriceFromCatalogPriceListSourceOption,
		PlatformMessenger,
		platformRuntimeDataService,
		basicsLookupdataLookupFilterService,
		basicsLookupdataLookupDescriptorService,
		projectMainUpdatePriceFromCatalogAdditionalData
	) {

		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'projectMainUpdatePriceFromCatalogProjectMaterialService',
			httpRead: {
				route: globals.webApiBaseUrl + 'project/material/', endRead: 'getprojectmaterialsf4updatepricesbycatalog',
				initReadData: initReadData,
			},
			presenter: {
				tree: {
					parentProp: 'StructureFk',
					childProp: 'Children',
					incorporateDataRead: incorporateDataRead
				}
			},
			entitySelection: {},
			modification: {},
			actions: {
				delete: false,
				create: false
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		var calculating = new PlatformMessenger();

		data.markItemAsModified = function () {
		};
		service.markItemAsModified = function () {
		};
		service.markersChanged = markersChanged;
		service.reset = reset;
		service.getMarked = getMarked;
		service.calculating = calculating;
		service.changeSourceOptionByPriceVersionId = changeSourceOptionByPriceVersionId;
		service.selectAll = selectAll;
		service.calculateVariance = calculateVariance;
		service.getListSelectedWithModification = getListSelectedWithModification;
		projectMainUpdatePriceFromCatalogMainService.priceListSelectionChanged.register(onPriceListSelectionChanged);
		projectMainUpdatePriceFromCatalogMainService.priceListWithSpecVersionUpdated.register(onPriceListWithSpecVersionUpdated);

		var filters = [
			{
				key: 'project-material-update-price-price-version-filter',
				serverSide: false,
				fn: function (item) {
					var prjMaterial = service.getSelected();
					return !(item.MaterialCatalogFk !== projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId &&
						item.MaterialCatalogFk !== prjMaterial.CatalogId);
				}
			},
			{
				key: 'update-material-by-catalog-price-version-filter',
				serverSide: false,
				fn: function (item) {
					var prjMaterial = service.getSelected();
					return !(item.MaterialCatalogFk !== projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId &&
						item.MaterialCatalogFk !== prjMaterial.MaterialCatalogFk);
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);
		return service;

		//////////////////////////

		function initReadData(readData) {
			let selectedEstHeaderItem = $injector.get ('estimateMainService').getSelectedEstHeaderItem ();
			readData.filter = '?projectId=' + projectMainUpdatePriceFromCatalogMainService.projectId+'&pageSize=10000000&pageIndex=0&estHeaderFk='+(selectedEstHeaderItem ? selectedEstHeaderItem.Id : null);
		}

		function incorporateDataRead(responseData, data) {
			var projectMaterials = responseData.ProjectMaterials;

			var prjMaterial2PriceListMap = responseData.PrjMaterial2PriceListMap;
			projectMainUpdatePriceFromCatalogMainService.priceListLoaded.fire(null, prjMaterial2PriceListMap);
			basicsLookupdataLookupDescriptorService.updateData('MaterialPriceVersion', projectMainUpdatePriceFromCatalogAdditionalData.additionalPriceVersions);
			return data.handleReadSucceeded(projectMaterials, data);

		}

		function markersChanged(checkedItems) {
			if (_.isArray(checkedItems) && checkedItems.length > 0) {
				projectMainUpdatePriceFromCatalogMainService.prjMaterialId = checkedItems[0].Id;
				projectMainUpdatePriceFromCatalogMainService.materialId = checkedItems[0].MaterialId;
				projectMainUpdatePriceFromCatalogMainService.markersChanged.fire();
			}
		}

		function onPriceListSelectionChanged(e, arg) {
			if (!arg || !_.isArray(arg.selectedItems)) {
				return;
			}

			var marked = service.getSelected();
			if (!marked) {
				return;
			}

			var projectId = projectMainUpdatePriceFromCatalogMainService.projectId;
			var type = arg.sourceOption;
			var selectedItems = arg.selectedItems;
			if (arg.sourceOption === projectMainUpdatePriceFromCatalogPriceListSourceOption.None) {
				marked.Source = $translate.instant('project.main.prjMaterialSource.none');
				marked.NewPrjEstimatePrice = marked.CurPrjEstimatePrice;
				marked.NewPrjDayworkRate = marked.CurPrjDayworkRate;
				marked.NewPrjFactorHour = marked.CurPrjFactorHour;
				marked.MaterialPriceVersionFk = null;
				calculateVariance(marked);
			} else if (type === projectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase) {
				marked.Source = $translate.instant('project.main.prjMaterialSource.onlyBase');
				marked.NewPrjEstimatePrice = selectedItems[0].EstimatePrice;
				marked.NewPrjDayworkRate = selectedItems[0].DayworkRate;
				marked.NewPrjFactorHour = selectedItems[0].FactorHour;
				marked.MaterialPriceVersionFk = projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId;
				calculateVariance(marked);
			} else if (type === projectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyOneVersion) {
				marked.Source = $translate.instant('project.main.prjMaterialSource.onlyOneVersion');
				calculatePriceByWeighting(marked.CurrencyFk, projectId, selectedItems)
					.then(function (data) {
						marked.NewPrjEstimatePrice = data.EstimatePrice;
						marked.NewPrjDayworkRate = data.DayworkRate;
						marked.MaterialPriceVersionFk = selectedItems[0].PriceVersionFk;
						if (angular.isNumber(data.FactorHour)) {
							marked.NewPrjFactorHour = data.FactorHour;
						}
						else {
							marked.NewPrjFactorHour = marked.CurPrjFactorHour;
						}
						calculateVariance(marked);
						service.gridRefresh();
					});
			} else {
				marked.Source = $translate.instant('project.main.prjMaterialSource.mixed');
				calculatePriceByWeighting(marked.CurrencyFk, projectId, selectedItems)
					.then(function (data) {
						marked.NewPrjEstimatePrice = data.EstimatePrice;
						marked.NewPrjDayworkRate = data.DayworkRate;
						marked.MaterialPriceVersionFk = projectMainUpdatePriceFromCatalogAdditionalData.weightedPriceVersionId;
						if (angular.isNumber(data.FactorHour)) {
							marked.NewPrjFactorHour = data.FactorHour;
						}
						else {
							marked.NewPrjFactorHour = marked.CurPrjFactorHour;
						}
						calculateVariance(marked);
						service.gridRefresh();
					});
			}

			service.gridRefresh();
		}

		function calculatePriceByWeighting(baseMatCurrencyFk, projectId, list) {
			calculating.fire(null, true);
			return $http.post(globals.webApiBaseUrl + 'project/material/calculateestimatepricewithweight?baseMatCurrencyFk=' + baseMatCurrencyFk + '&projectId=' + projectId, list)
				.then(function (response) {
					return response.data;
				})
				.finally(function () {
					calculating.fire(null, false);
				});
		}

		function reset() {
			data.clearContent(data);
		}

		function getMarked() {
			return _.find(service.getList(), {IsMarked: true});
		}

		function changeSourceOptionByPriceVersionId(entity, versionId) {
			var list = service.getList();
			var prjMaterials = list;
			if (entity) {
				var structureFk = getCatalogId(entity.JobId, entity.CatalogId);
				prjMaterials = _.filter(list, {StructureFk: structureFk});
			}
			projectMainUpdatePriceFromCatalogMainService.specificPriceVersionSelected.fire(null, {
				priceVersionFk: versionId,
				ProjectMaterials: prjMaterials
			});
		}


		function getCatalogId(jobId, catalogId) {
			return 'j-' + jobId + '.c-' + catalogId;
		}

		function onPriceListWithSpecVersionUpdated(e, args) {
			var prjMaterials = args.prjMaterials;
			var prjMat2PriceList = args.prjMat2PriceList;
			var priceVersionFk = args.priceVersionFk;
			var projectId = projectMainUpdatePriceFromCatalogMainService.projectId;
			var data = {
				ProjectId: projectId,
				ProjectMaterials: prjMaterials,
				PrjMaterial2PriceList: prjMat2PriceList
			};
			if (priceVersionFk === projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId) {
				_.forEach(prjMaterials, function (prjMat) {
					var found = prjMat2PriceList[prjMat.Id];
					if (found) {
						prjMat.NewPrjEstimatePrice = found.EstimatePrice;
						prjMat.NewPrjDayworkRate = found.DayworkRate;
						prjMat.NewPrjFactorHour = found.FactorHour;
						prjMat.MaterialPriceVersionFk = priceVersionFk;
						prjMat.Source = $translate.instant('project.main.prjMaterialSource.OnlyBase');
						calculateVariance(prjMat);
					}
				});
				service.gridRefresh();
			} else {
				calculating.fire(null, true);
				$http.post(globals.webApiBaseUrl + 'project/material/updateestimatepricewithspecversion', data)
					.then(function (response) {
						var updates = response.data;
						_.forEach(prjMaterials, function (prjMat) {
							var found = _.find(updates, {Id: prjMat.Id});
							if (found) {
								prjMat.NewPrjEstimatePrice = found.NewPrjEstimatePrice;
								prjMat.NewPrjFactorHour = found.NewPrjFactorHour;
								prjMat.MaterialPriceVersionFk = priceVersionFk;
								prjMat.Source = $translate.instant('project.main.prjMaterialSource.onlyOneVersion');
								calculateVariance(prjMat);
							}
						});
						service.gridRefresh();
					})
					.finally(function () {
						calculating.fire(null, false);
					});
			}
		}

		function selectAll(selected) {
			var list = service.getList();

			_.forEach(list, function (item) {
				item.Selected = selected;
				if(item.hasOwnProperty('isIndeterMinate')){
					if(item.isIndeterMinate){
						item.isIndeterMinate = false;
					}
				}
				if(item.hasOwnProperty('isIndeterMinateAll')){
					item.isIndeterMinateAll = false;
				}
			});
		}

		function calculateVariance(prjMat) {
			prjMat.Variance = prjMat.NewPrjEstimatePrice - prjMat.CurPrjEstimatePrice;
		}

		function getListSelectedWithModification() {
			let list=service.getList();
			let modifications=_.filter(list, function (item) {
				var prjDayworkRateVarianceFlg=item.isProjectMaterial&&((item.NewPrjDayworkRate - item.CurPrjDayworkRate)!==0);
				var priceUnitVarianceFlg=item.isProjectMaterial&&((item.NewPriceUnit-item.CurPriceUnit)!==0);
				var priceUnitFactorVarianceFlg=item.isProjectMaterial&&angular.isNumber(item.NewFactorPriceUnit) && angular.isNumber(item.CurFactorPriceUnit)&&((item.NewFactorPriceUnit-item.CurFactorPriceUnit)!==0);
				return item.Selected && item.isProjectMaterial&& (item.Variance !== 0|| prjDayworkRateVarianceFlg || priceUnitVarianceFlg || priceUnitFactorVarianceFlg ||
					(angular.isNumber(item.NewPrjFactorHour) && angular.isNumber(item.CurPrjFactorHour) && item.NewPrjFactorHour - item.CurPrjFactorHour !== 0)||item.IsMaterialPortionChange);
			});
			return modifications;
		}
	}
})(angular);

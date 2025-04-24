/**
 * Created by chi on 1/4/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogProjectMaterialService', projectMainUpdatePriceFromCatalogProjectMaterialService);

	projectMainUpdatePriceFromCatalogProjectMaterialService.$inject = [
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

	function projectMainUpdatePriceFromCatalogProjectMaterialService(
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
				route: globals.webApiBaseUrl + 'project/material/', endRead: 'getprojectmaterialsf4updatepricesfromcatalog',
				initReadData: initReadData
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
		var co2AttrId = new Set();

		data.markItemAsModified = function () {
		};
		service.markItemAsModified = function () {
		};
		service.markersChanged = markersChanged;
		service.reset = reset;
		service.getMarked = getMarked;
		service.MarkSelected = MarkSelected;
		service.tempData = [];
		service.calculating = calculating;
		service.changeSourceOptionByPriceVersionId = changeSourceOptionByPriceVersionId;
		service.selectAll = selectAll;
		service.calculateVariance = calculateVariance;
		service.getListSelectedWithModification = getListSelectedWithModification;
		projectMainUpdatePriceFromCatalogMainService.priceListSelectionChanged.register(onPriceListSelectionChanged);
		service.registerSelectionChanged(onSelectionChanged);
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
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);
		return service;

		//////////////////////////

		function initReadData(readData) {
			let selectedEstHeaderItem = $injector.get ('estimateMainService').getSelectedEstHeaderItem ();
			readData.filter = '?projectId=' + projectMainUpdatePriceFromCatalogMainService.projectId+'&estHeaderFk='+(selectedEstHeaderItem ? selectedEstHeaderItem.Id : null+'&pageSize=100&pageIndex=0');
		}

		function incorporateDataRead(responseData, data) {
			var projectMainUpdatePricesWizardCommonService = $injector.get('projectMainUpdatePricesWizardCommonService');
			var isUsingInEstimateResourceSummary = projectMainUpdatePricesWizardCommonService.isUsingInEstimateResourceSummary();

			//To filter only cost codes with resources
			var estimateMainService = $injector.get('estimateMainService');
			var estimateResourcesSummaryService = $injector.get('estimateResourcesSummaryService');

			var resourcesMaterialJobs = [];

			var projectMaterials = responseData.ProjectMaterials;

			if(responseData.VersionJobIds && responseData.VersionJobIds.length){
				projectMaterials = _.filter(projectMaterials,function (d) {
					return !responseData.VersionJobIds.includes(d.JobId);
				});
			}

			var prjMaterial2PriceListMap = responseData.PrjMaterial2PriceListMap;
			//projectMainUpdatePriceFromCatalogMainService.priceListLoaded.fire(null, prjMaterial2PriceListMap);
			basicsLookupdataLookupDescriptorService.updateData('MaterialPriceVersion', projectMainUpdatePriceFromCatalogAdditionalData.additionalPriceVersions);
			var result = [];
			if (angular.isArray(projectMaterials) && projectMaterials.length > 0) {

				_.forEach(projectMaterials, function (item) {

					if (isUsingInEstimateResourceSummary) {
						resourcesMaterialJobs = _.map(_.filter(estimateResourcesSummaryService.getList(), function (resource) {
							return resource.EstResourceTypeFk === 2;
						}), function (resource) {
							return {
								MdcMaterialFk: resource.MdcMaterialFk,
								LgmJobFk: resource.LgmJobFk ? resource.LgmJobFk : estimateMainService.getLgmJobId(resource)
							};
						});
					}

					var readonlyFields = [];
					var jobItem = _.find(result, {tempId: getJobId(item.JobId)});
					var catItem = {};
					var tempItem = {};
					if (!jobItem) {
						readonlyFields = [];
						jobItem = {};
						jobItem.tempId = getJobId(item.JobId);
						jobItem.Id = jobItem.tempId;
						jobItem.JobId = item.JobId;
						jobItem.JobCode = $translate.instant('project.main.updatePriceFromCatalogWizard.lgmJobPrefix') + item.JobCode;
						jobItem.JobDescription = $translate.instant('project.main.updatePriceFromCatalogWizard.lgmJobPrefix') + item.JobDescription;
						jobItem.StructureFk = null;
						jobItem.Selected = true;
						jobItem.MaterialPriceVersionFk = null;
						jobItem.Children = [];
						jobItem.isProjectMaterial = false;
						result.push(jobItem);
						readonlyFields.push({field: 'MaterialPriceVersionFk', readonly: true});
						readonlyFields.push({field: 'NewPrjEstimatePrice', readonly: true});
						readonlyFields.push({field: 'NewPrjDayworkRate', readonly: true});
						readonlyFields.push({field: 'NewPrjFactorHour', readonly: true});
						platformRuntimeDataService.readonly(jobItem, readonlyFields);
					}

					catItem = _.find(jobItem.Children, {tempId: getCatalogId(item.JobId, item.CatalogId)});
					if (!catItem) {
						readonlyFields = [];
						catItem = {};
						catItem.tempId = getCatalogId(item.JobId, item.CatalogId);
						catItem.Id = catItem.tempId;
						catItem.JobId = item.JobId;
						catItem.JobCode = item.CatalogCode;
						catItem.JobDescription = item.CatalogDescription;
						catItem.CatalogId = item.CatalogId;
						catItem.StructureFk = jobItem.tempId;
						catItem.Selected = true;
						catItem.MaterialPriceVersionFk = null;
						catItem.Children = [];
						catItem.isProjectMaterial = false;
						jobItem.Children.push(catItem);
						jobItem.HasChildren = true;
						readonlyFields.push({field: 'NewPrjEstimatePrice', readonly: true});
						readonlyFields.push({field: 'NewPrjDayworkRate', readonly: true});
						readonlyFields.push({field: 'NewPrjFactorHour', readonly: true});
						platformRuntimeDataService.readonly(catItem, readonlyFields);
					}

					tempItem = _.find(catItem.Children, {tempId: item.Id});
					if (!tempItem) {
						readonlyFields = [];
						tempItem = angular.copy(item);
						tempItem.tempId = item.Id;
						tempItem.JobCode = null;
						tempItem.JobDescription = null;
						tempItem.StructureFk = catItem.tempId;
						tempItem.Selected = true;
						tempItem.MaterialPriceVersionFk = null;
						tempItem.Children = [];
						tempItem.isProjectMaterial = true;
						catItem.Children.push(tempItem);
						catItem.HasChildren = true;
						readonlyFields.push({field: 'MaterialPriceVersionFk', readonly: true});
						platformRuntimeDataService.readonly(tempItem, readonlyFields);
					}

					if (isUsingInEstimateResourceSummary) {
						if (jobItem.HasChildren) {
							_.forEach(jobItem.Children, function (prjMaterialCatalog) {

								_.forEach(prjMaterialCatalog.Children, function (prjMaterial) {
									prjMaterial.existsInResources = _.findIndex(resourcesMaterialJobs, {
										MdcMaterialFk: prjMaterial.MaterialId,
										LgmJobFk: jobItem.JobId
									}) > -1;
								});

								//overwrite list with only existing resources materials
								prjMaterialCatalog.Children = _.filter(prjMaterialCatalog.Children, {existsInResources: true});
								prjMaterialCatalog.existsInResources = _.size(prjMaterialCatalog.Children) > 0;
								//
								////job level to evaluate project matarial catalogs
								//jobItem.existsInResources = prjMaterialCatalog.Children && prjMaterialCatalog.Children.length > 0;
							});

							//overwrite list with only existing resources cost codes
							jobItem.Children = _.filter(jobItem.Children, {existsInResources: true});
						}
					}

				});
			}

			// if (isUsingInEstimateResourceSummary) {
			// 	var filteredList = _.filter(result, function (item) {
			// 		return item.Children && item.Children.length > 0;
			// 	});
			// 	return data.handleReadSucceeded(filteredList, data);
			// } else {
			// 	return data.handleReadSucceeded(result, data);
			// }
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
			let list=service.getList();
			if(selectedItems.length >=1) {
				let modifications = _.filter(list, function (item) {
					return item.Selected && item.MaterialId === selectedItems[0].MaterialId;
				});
				for (let i = 0; i < selectedItems.length; i++) {
					if(_.isNil(modifications[0].Co2Project)){
						modifications[0].Co2Project = 0;
					}
					if(_.isNil(selectedItems[i].Co2Project)){
						selectedItems[i].Co2Project = 0;
					}
					if(_.isNil(modifications[0].Co2Source)){
						modifications[0].Co2Source = 0;
					}
					if(_.isNil(selectedItems[i].Co2Source)){
						selectedItems[i].Co2Source = 0;
					}
					if (modifications[0].Co2Project !== selectedItems[i].Co2Project || modifications[0].Co2Source !== selectedItems[i].Co2Source || modifications[0].Co2SourceFk !== selectedItems[i].Co2SourceFk) {
						co2AttrId.add(modifications[0].MaterialId);
						break;
					}else{
						co2AttrId.clear();
					}
				}
			}else{
				co2AttrId.clear();
			}

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
			service.tempData = [];
		}

		function getMarked() {
			return _.find(service.getList(), {IsMarked: true});
		}

		function MarkSelected(tempDatas) {
			var list = service.getList();
			const tempDatasMap = _.keyBy(tempDatas, 'Id');
			_.forEach(list, function (item) {
				const tempData = tempDatasMap[item.Id];
				if (tempData) {
					item.Selected = true;
					item.MaterialPriceVersionFk = tempData.MaterialPriceVersionFk;
					item.NewPrjEstimatePrice = tempData.NewPrjEstimatePrice;
					item.NewPrjDayworkRate = tempData.NewPrjDayworkRate;
					item.NewPrjFactorHour = tempData.NewPrjFactorHour;
					item.CommentText = tempData.CommentText;
				}
			});
			service.gridRefresh();
		}

		function syncSelectedItems() {
			let list = service.getList();
			if (service.tempData.length > 0) {
				for (let i = 0; i < service.tempData.length; i++) {
					let tempData = service.tempData[i];
					let item = _.find(list, {Id: tempData.Id});
					if (item) {
						tempData.MaterialPriceVersionFk = item.MaterialPriceVersionFk;
						tempData.NewPrjEstimatePrice = item.NewPrjEstimatePrice;
						tempData.NewPrjDayworkRate = item.NewPrjDayworkRate;
						tempData.NewPrjFactorHour = item.NewPrjFactorHour;
						tempData.NewPriceUnit = item.NewPriceUnit;
						tempData.NewFactorPriceUnit = item.NewFactorPriceUnit;
						tempData.IsMaterialPortionChange = item.IsMaterialPortionChange;
						tempData.CommentText = item.CommentText;
					}
				}
			}
		}

		function onSelectionChanged() {
			var prjMaterial = service.getSelected();
			projectMainUpdatePriceFromCatalogMainService.prjMaterialId = prjMaterial ? prjMaterial.Id : null;
			projectMainUpdatePriceFromCatalogMainService.projectMaterialSelectionChanged.fire();
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

		function getJobId(id) {
			return 'j-' + id;
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
				let dataIndex = service.tempData.findIndex((temp)=>{
					return temp.Id === item.Id;
				});
				if(dataIndex === -1 && selected){
					let saveData = angular.copy(item);
					service.tempData.push(saveData);
				}else if(dataIndex !== -1 && !selected) {
					service.tempData.splice(dataIndex,1);
				}
			});
		}

		function calculateVariance(prjMat) {
			prjMat.Variance = prjMat.NewPrjEstimatePrice - prjMat.CurPrjEstimatePrice;
		}

		function getListSelectedWithModification(co2Attr=0) {
			let list = [];
			if (service.tempData.length > 0) {
				syncSelectedItems();

				for (let i = 0; i < service.tempData.length; i++) {
					list.push(service.tempData[i]);
				}
				return getModification(co2Attr, list);
			}
			return list;
		}

		function getModification(co2Attr,list) {
				if(co2Attr.size > 0){
					co2AttrId = co2Attr;
				}
				let modifications=_.filter(list, function (item) {
					var prjDayworkRateVarianceFlg = (item.NewPrjDayworkRate - item.CurPrjDayworkRate) !== 0;
					var priceUnitVarianceFlg = (item.NewPriceUnit - item.CurPriceUnit) !== 0;
					var priceUnitFactorVarianceFlg = angular.isNumber(item.NewFactorPriceUnit) && angular.isNumber(item.CurFactorPriceUnit) && ((item.NewFactorPriceUnit - item.CurFactorPriceUnit) !== 0);
					if (co2AttrId.has(item.MaterialId)) {
						return item.Selected && (item.Variance !== 0 || prjDayworkRateVarianceFlg || priceUnitVarianceFlg || priceUnitFactorVarianceFlg ||
							(angular.isNumber(item.NewPrjFactorHour) && angular.isNumber(item.CurPrjFactorHour) && item.NewPrjFactorHour - item.CurPrjFactorHour !== 0) || item.IsMaterialPortionChange);
					}
					return item.Selected && (item.Variance !== 0 || prjDayworkRateVarianceFlg || priceUnitVarianceFlg || priceUnitFactorVarianceFlg ||
						(angular.isNumber(item.NewPrjFactorHour) && angular.isNumber(item.CurPrjFactorHour) && item.NewPrjFactorHour - item.CurPrjFactorHour !== 0) || item.IsMaterialPortionChange);
				});
				return modifications;
		}
	}
})(angular);

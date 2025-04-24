/**
 * $Id: estimate-main-plant-assembly-dialog-service.js 108905 2024-02-20 15:47:59Z badugula $
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainPlantAssemblyDialogService
	 * @function
	 * @description
	 * estimateMainPlantAssemblyDialogService is the data service for estimate plant assembly dialog controller..
	 */
	angular.module(moduleName).factory('estimateMainPlantAssemblyDialogService', [
		'$http', '$q', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainPlantDialogService', 'basicsLookupdataLookupDescriptorService', 'mainViewService',
		function ($http, $q, $injector, PlatformMessenger, platformDataServiceFactory, estimateMainPlantDialogService, basicsLookupdataLookupDescriptorService, mainViewService) {
			const plantAssemblyLookupType = 'estplantassemblyfk';
			let serviceOptions = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainPlantAssemblyDialogService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/assemblies/',
						endRead: 'getplantassemblysearchlist',
						usePostForRead: true,
						initReadData: function initReadData(filterRequest) {
							filterRequest.LgmJobFk = null;
							let groupIds =  estimateMainPlantDialogService.getPlantGroupIds();
							filterRequest.ItemsPerPage = 200;
							filterRequest.filterByCatStructure = JSON.stringify(groupIds);
							if (mainViewService.getCurrentModuleName() === moduleName) {
								let estMainServ = $injector.get('estimateMainService');
								filterRequest.ProjectId = estMainServ.getSelectedProjectId();
								let options = getOptions();
								filterRequest.LgmJobFk = options.usageContext === 'estimateMainService' ? estMainServ.getLineItemJobId(estMainServ.getSelected()) : estMainServ.getLgmJobId($injector.get('estimateMainResourceService').getSelected());
								if(options && options.filterPlantAssemblyKey === 'plant-assembly-filter-by-estimate'){
									filterRequest.estHeaderFk = estMainServ.getSelected() ? estMainServ.getSelected().EstHeaderFk : null;
									filterRequest.filterByEstimate = true;
								}
							}
							else if (mainViewService.getCurrentModuleName() === 'project.main'){
								filterRequest.ProjectId = $injector.get('projectMainService').getSelected().Id;
								filterRequest.EstLineItem = $injector.get('projectPlantAssemblyMainService').getSelected();
								filterRequest.LgmJobFk = $injector.get('estimateAssembliesResourceValidationService').getAssemblyLgmJobId(filterRequest.EstLineItem);
							}
							else if (mainViewService.getCurrentModuleName() === 'resource.equipment'){
								let plant2EstPriceListItem = $injector.get('resourceEquipmentPlant2EstimatePriceListDataService').getSelected();
								filterRequest.ProjectId = null;
								filterRequest.EstimatePriceListFk = plant2EstPriceListItem ? plant2EstPriceListItem.EstimatePricelistFk : -1;
							}
							else if (mainViewService.getCurrentModuleName() === 'resource.equipmentgroup'){
								let plantGrp2EstPriceListItem = $injector.get('resourceEquipmentGroupPlantGroup2EstimatePriceListDataService').getSelected();
								filterRequest.ProjectId = null;
								filterRequest.EstimatePriceListFk = plantGrp2EstPriceListItem ? plantGrp2EstPriceListItem.EstimatePricelistFk : -1;
							}
							else if (mainViewService.getCurrentModuleName() === 'estimate.assemblies'){
								filterRequest.ProjectId = null;
								filterRequest.LgmJobFk = null;
							}
							else{
								filterRequest.ProjectId = null;
							}

							return filterRequest;
						}
					},
					actions: {}, presenter: {list: {
							incorporateDataRead: incorporateDataRead
						}},
					entityRole: { leaf: { itemName: 'EstPlantAssemblies', parentService: estimateMainPlantDialogService, parentFilter: 'PlantGroupFk' } },
					useItemFilter: true
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			serviceContainer.data.updateOnSelectionChanging = false;

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let multipleSelected = {};

			data.clearContent = function clearContent(){};

			let mdcAssembliesByCodeDictionary = {}; // get assembly on cell change

			let searchResult = null;

			angular.extend(service, {
				getAssemblyById: getPlantAssemblyById,
				getAssemblyByIdAsync: getPlantAssemblyByIdAsync,
				getAssemblyByIdBulkEditorAsync: getPlantAssemblyByIdBulkEditorAsync,
				init: init,
				setOptions: setOptions,
				getOptions:getOptions,
				search: search,
				getSearchListResult: getSearchListResult,
				setSearchListResult: setSearchListResult,
				getSearchList: getSearchList,
				getAssemblyByCodeAsync: getPlantAssemblyByCodeAsync,
				onMultipleSelection: onMultipleSelection,
				setMultipleSelectedItems: setMultipleSelectedItems,
				getMultipleSelectedItems: getMultipleSelectedItems,
				getIsListBySearch: getIsListBySearch,
				setIsListBySearch: setIsListBySearch,
				onFetchPlantAssemblies: new PlatformMessenger()
			});

			angular.extend(multipleSelected, {
				items: [],
				isListBySearch: false
			});

			return service;

			function init(){
				data.itemList = [];
				data.selectedItem = null;

				searchResult = null;

				data.itemFilter = null;
				data.itemFilterEnabled = false;

				setIsListBySearch(false);
			}

			function setOptions(options){
				data.gridOptionsFilter = options;
			}

			function getOptions(){
				return data.gridOptionsFilter;
			}

			function getPlantAssemblyByCodeAsync(code){
				let costCode = mdcAssembliesByCodeDictionary[code];
				if (!_.isEmpty(costCode)){
					return $q.when(costCode);
				}else{
					let postData = {
						Code: code,
						Id: -1
					};
					if (mainViewService.getCurrentModuleName() === moduleName){
						let estMainServ = $injector.get('estimateMainService');
						postData.ProjectId = estMainServ.getSelectedProjectId();
						let options = getOptions();
						postData.LgmJobFk = options.usageContext === 'estimateMainService' ? estMainServ.getLineItemJobId(estMainServ.getSelected()) : estMainServ.getLgmJobId($injector.get('estimateMainResourceService').getSelected());
						if(options && options.filterPlantAssemblyKey === 'plant-assembly-filter-by-estimate'){
							postData.estHeaderFk = estMainServ.getSelected() ? estMainServ.getSelected().EstHeaderFk : null;
							postData.filterByEstimate = true;
						}
					}

					return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/getplantassemblybycode'+ postData).then(function (response) {
						let data = response.data;
						if (!_.isEmpty(data)){
							basicsLookupdataLookupDescriptorService.updateData(plantAssemblyLookupType, [data]);
							mdcAssembliesByCodeDictionary[data.Code] = data;
						}
						return data;
					});
				}
			}

			function filterByCircularDependency(list, options){
				list = list || [];
				let defer = $q.defer();
				let lookupOptions = options.lookupOptions;
				if (lookupOptions && lookupOptions.filterPlantAssemblyKey === 'resource-equipment-resources-self-assignment-filter' && !_.isEmpty(list)){
					let assembly = !_.isEmpty(lookupOptions.plantAssembliesService) ? $injector.get(lookupOptions.plantAssembliesService).getSelected() : null;
					if(!assembly || !assembly.Id){
						defer.resolve(list);
					}
					let ids = _.map(list, 'Id');
					let postData = {
						ids : ids,
						estAssemblyHeaderFk : assembly.EstHeaderFk,
						estAssemblyFk : assembly.Id,
						EstResourceType : 3
					};
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/filterassignedassemblies_new', postData).then(function(response){
						let circleDependencyAssemblies = response.data && _.isArray(response.data) && response.data.length ? response.data : [];
						circleDependencyAssemblies.push(assembly.Id);
						let listFiltered = list.filter(function(item){
							return _.indexOf(circleDependencyAssemblies, item.Id) === -1;
						});
						defer.resolve(listFiltered);
					});
				}else if(options && options.usageContext === 'projectPlantAssemblyResourceService' && !_.isEmpty(list)){
					//defer.resolve(list);
					let projectPlantAssemblies = _.filter(list, function (projectPlantAssembly) {
						return (projectPlantAssembly.EstAssemblyFk || 0) > 0;
					});
					let projectPlantAssembliesKeys = _.map(projectPlantAssemblies, 'EstAssemblyFk');

					let prjPlantAssembly = $injector.get('projectPlantAssemblyMainService').getSelected() || {};

					let filteredEstAssembliesFromProjectPlantAssembly = _.filter(list, function (masterPlantAssembly) {
						return projectPlantAssembliesKeys.indexOf(masterPlantAssembly.Id) === -1;
					});

					if (lookupOptions.filterPrjAssemblyKey) {
						filteredEstAssembliesFromProjectPlantAssembly = _.filter(filteredEstAssembliesFromProjectPlantAssembly, function (item) {
							return prjPlantAssembly.Id !== item.Id;
						});
					}

					estimateMainPlantDialogService.filterAssemblyByPlantGroup(filteredEstAssembliesFromProjectPlantAssembly);

					let prjPlantAssemblyids = _.map(filteredEstAssembliesFromProjectPlantAssembly, 'Id');
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/filterassignedassemblies_new', {
						assemblyId: prjPlantAssembly.Id,
						ids: prjPlantAssemblyids,
						estAssemblyHeaderFk: prjPlantAssembly.EstHeaderAssemblyFk,
						estAssemblyFk: prjPlantAssembly.EstAssemblyFk,
						EstResourceType : 3
					}).then(function (response) {
						let circleDependencyAssemblies = response.data;
						let listFiltered = filteredEstAssembliesFromProjectPlantAssembly.filter(function (item) {
							return _.indexOf(circleDependencyAssemblies, item.Id) === -1;
						});
						defer.resolve(listFiltered);
					});
				}
				else{
					defer.resolve(list);
				}
				return defer.promise;
			}

			function search(searchString, entity, parentScope){
				searchString = searchString && searchString.length > 0 ? searchString.toLowerCase() : '';

				let groupSelected = estimateMainPlantDialogService.getSelected();
				if (groupSelected && groupSelected.Id){
					// if category is selected and search string has value, search only affects to assemblies from the selected category
					// 1. display only category selected
					estimateMainPlantDialogService.setItemFilter(function (groupEntity) {
						return groupEntity.Id === groupSelected.Id;
					});
					estimateMainPlantDialogService.enableItemFilter(true);
				}

				let groupsFilteredList = estimateMainPlantDialogService.getFilteredList(parentScope.options, parentScope.entity);
				if (_.isEmpty(groupsFilteredList)){
					parentScope.isLoading = false;
				}else{
					setIsListBySearch(true);
					getSearchList(searchString, null, entity, null, false, parentScope.options).then(function(list){
						data.itemList = list;
						data.listLoaded.fire(list, true); // Search result is going to be loaded

						if (!_.isEmpty(searchString)){
							estimateMainPlantDialogService.filterGroups.fire(service.getList());
						}
						parentScope.isLoading = false;
					});
				}
			}

			function getSearchListResult(){
				return searchResult;
			}

			function setSearchListResult(result){
				searchResult = result;
			}
			function updateByLookupType (dtos){
				basicsLookupdataLookupDescriptorService.updateData(plantAssemblyLookupType, dtos);
				_.forEach(dtos, function(assembly){
					mdcAssembliesByCodeDictionary[assembly.Code] = assembly;
				});
			}

			function splitSearchString(searchString){
				if(searchString && searchString.indexOf('#') > -1){
					let split = searchString.split('#');
					return {
						value: split[split.length - 1],
						headerCodes: split.slice(0, -1)
					};
				}else{
					return {
						value: searchString,
						headerCodes: [searchString + "#PlantCode"]
					};
				}
			}

			function getSearchList(value, field, entity, pagination, isPopup, options,itemsTotalCount, isLoadCat){ // on Scroll // todo done
				let promise = $q.when(true);
				if (!isLoadCat){
					let isSetOptions = service.getOptions();
					if(!isSetOptions){
						service.setOptions(options);
					}
					promise = estimateMainPlantDialogService.loadAllPlantGroup();
				}

				return promise.then(function(){
					let projectFk = null;
					let lgmJobFk = null;
					let estimatePriceListFk;
					let estHeaderFk = null;
					let filterByEstimate = false;
					let estLineItem=null;
					let plantGroupIds = estimateMainPlantDialogService.getFilteredGroupIds(options, entity, isPopup);

					if (mainViewService.getCurrentModuleName() === moduleName){
						let estMainServ = $injector.get('estimateMainService');
						projectFk = estMainServ.getSelectedProjectId();
						let options = getOptions();
						lgmJobFk = options.usageContext === 'estimateMainService' ? estMainServ.getLineItemJobId(estMainServ.getSelected()) : estMainServ.getLgmJobId($injector.get('estimateMainResourceService').getSelected());
						if(options && options.filterPlantAssemblyKey === 'plant-assembly-filter-by-estimate'){
							estHeaderFk = estMainServ.getSelected() ? estMainServ.getSelected().EstHeaderFk : null;
							filterByEstimate = true;
						}
					}else if (mainViewService.getCurrentModuleName() === 'resource.equipment'){
						let plant2EstPriceListItem = $injector.get('resourceEquipmentPlant2EstimatePriceListDataService').getSelected();
						projectFk = null;
						estimatePriceListFk = plant2EstPriceListItem ? plant2EstPriceListItem.EstimatePricelistFk : -1;
					}
					else if (mainViewService.getCurrentModuleName() === 'resource.equipmentgroup'){
						let plantGrp2EstPriceListItem = $injector.get('resourceEquipmentGroupPlantGroup2EstimatePriceListDataService').getSelected();
						projectFk = null;
						estimatePriceListFk = plantGrp2EstPriceListItem ? plantGrp2EstPriceListItem.EstimatePricelistFk : -1;
					}else if (mainViewService.getCurrentModuleName() === 'project.main'){
						projectFk = $injector.get('projectMainService').getSelected().Id;
						estLineItem = $injector.get('projectPlantAssemblyMainService').getSelected();
						lgmJobFk = $injector.get('estimateAssembliesResourceValidationService').getAssemblyLgmJobId(estLineItem);
					}

					let searchSplit = options && options.splitSearchString ? splitSearchString(value) : { value: value, headerCodes: [] };

					let postData = {
						'SearchValue': searchSplit.value,
						'Field': field,
						'CurrentPage': pagination ? pagination.CurrentPage || 0 : 0,
						'ItemsPerPage': 200,
						'FilterByCatStructure': _.isEmpty(searchSplit.value) ? JSON.stringify(plantGroupIds) : JSON.stringify([]), // string with plant ids
						'ProjectId': projectFk,
						'LgmJobFk': lgmJobFk,
						'EstimatePriceListFk':estimatePriceListFk,
						'EstHeaderFk':estHeaderFk,
						'FilterByEstimate': filterByEstimate,
						'EstLineItem': estLineItem,
						'PlantCodes':searchSplit.headerCodes
					};

					// shift this to est assemblies module
					return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/getplantassemblysearchlist', postData).then(function (response) {
						let data = response.data;
						let dtos = _.uniqBy(data.dtos, 'Id');

						setSearchListResult(data.filterResult);
						return filterByCircularDependency(dtos, getOptions()).then(function (listFilteredByCircularDependency) {
							updateByLookupType(listFilteredByCircularDependency);
							service.setList(listFilteredByCircularDependency);
							data.filterResult.ItemsTotalCount = listFilteredByCircularDependency.length;
							setSearchListResult(data.filterResult);
							return $q.when(listFilteredByCircularDependency);
						});
					});
				});
			}

			function onMultipleSelection(grid, rows){ // todo done
				let items = rows.map(function (row) {
					return grid.instance.getDataItem(row);
				});

				let groupSelected = estimateMainPlantDialogService.getSelected() || {};
				if (groupSelected && groupSelected.Id){
					if (_.isEmpty(rows)){
						if(groupSelected.IsPlantGroup){
							_.remove(multipleSelected.items, { 'PlantGroupFk': _.toInteger(groupSelected.Id) });
						}else{
							_.remove(multipleSelected.items, { 'PlantFk': _.toInteger(groupSelected.Id) });
						}
					}

					// Get Items from the current selected plant or plant group
					// 1. It can be parent plant or plant group
					// 2 Remove based on the current displayed list selection
					let currentItemsDisplayedIds = _.map(grid.instance.getData().getItems(), 'Id');
					_.remove(multipleSelected.items, function(mSelectedItem){
						return currentItemsDisplayedIds.indexOf(mSelectedItem.Id) > -1;
					});

					// Plant Master
					let plants = _.groupBy(items, 'PlantFk');
					_.forEach(plants, function(assemblies, plantId){
						_.remove(multipleSelected.items, { 'PlantFk': _.toInteger(plantId) });
						_.forEach(assemblies, function(assembly){
							if (assembly && assembly.Id){
								multipleSelected.items.push(assembly);
							}
						});
					});
				}else{
					_.forEach(service.getList(), function(item){
						_.remove(multipleSelected.items, { 'Id': item.Id });
					});
					_.forEach(items, function(assembly){
						if (assembly && assembly.Id){
							multipleSelected.items.push(assembly);
						}
					});
				}
				multipleSelected.items = _.uniqBy(multipleSelected.items, 'Id');
				return multipleSelected.items;
			}

			function setMultipleSelectedItems(items){
				multipleSelected.items = items;
			}

			function getMultipleSelectedItems(){
				return multipleSelected.items;
			}

			function getIsListBySearch(){
				return multipleSelected.isListBySearch;
			}

			function setIsListBySearch(value){
				multipleSelected.isListBySearch = value;
			}

			function getPlantAssemblyById(id){
				return _.find(basicsLookupdataLookupDescriptorService.getData(plantAssemblyLookupType), {Id: id});
			}

			function getPlantAssemblyByIdAsync(id, sendHttpRequest){
				if (basicsLookupdataLookupDescriptorService.hasLookupItem(plantAssemblyLookupType, id) && !sendHttpRequest){
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(plantAssemblyLookupType, id));
				}else{
					return $http.get(globals.webApiBaseUrl+'estimate/assemblies/getplantassemblybyid?id='+ id).then(function(response){
						if(response.data && response.data.Id){
							basicsLookupdataLookupDescriptorService.updateData(plantAssemblyLookupType, [response.data]);
							return response.data;
						}
						return {};
					});
				}
			}

			function getPlantAssemblyByIdBulkEditorAsync(id, scope){
				let service = $injector.get(scope.options.usageContext);
				let projectId = service.getSelectedProjectId();
				if (projectId){
					let postData = {
						Id: id,
						ProjectId: projectId,
						Code: ''
					};
					if (mainViewService.getCurrentModuleName() === moduleName){
						let estMainServ = $injector.get('estimateMainService');
						let options = getOptions();
						postData.LgmJobFk = options.usageContext === 'estimateMainService' ? estMainServ.getLineItemJobId(estMainServ.getSelected()) : estMainServ.getLgmJobId($injector.get('estimateMainResourceService').getSelected());
					}
					return $http.get(globals.webApiBaseUrl+'estimate/assemblies/getplantitembyidbulkeditor'+ postData).then(function(response){
						let assembly = response.data;
						if (_.isEmpty(assembly)){
							scope.ngModel = null;
						}
						return response.data;
					});
				}
				return $q.when({});
			}

			function incorporateDataRead(readData){
				let dtos = readData.dtos || [];

				// update the assemblies cache
				return filterByCircularDependency(dtos, getOptions()).then(function(listFilteredByCircularDependency){
					updateByLookupType(listFilteredByCircularDependency);
					readData.filterResult.ItemsTotalCount = listFilteredByCircularDependency.length;
					setSearchListResult(readData.filterResult);
					return service.setList(listFilteredByCircularDependency);
				});
			}
		}
	]);
})(angular);

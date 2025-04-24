/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
/* global globals, _ */
(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainAssemblycatTemplateService
	 * @function
	 * @description
	 * estimateMainAssemblyTemplateService is the data service for estimate assembly lookup controller..
	 */
	angular.module(moduleName).factory('estimateMainAssemblyTemplateService', [
		'$http', '$q', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainAssemblycatTemplateService', 'basicsLookupdataLookupDescriptorService', 'mainViewService',
		function ($http, $q, $injector, PlatformMessenger, platformDataServiceFactory, estimateMainAssemblycatTemplateService, basicsLookupdataLookupDescriptorService, mainViewService) {

			let serviceOptions = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainAssemblyTemplateService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/assemblies/',
						endRead: 'getsearchlist',
						usePostForRead: true,
						initReadData: function initReadData(filterRequest) {
							let categoryIds =  estimateMainAssemblycatTemplateService.getAssemblyCategoryIds().join(',');
							filterRequest.itemsPerPage = 200;
							filterRequest.filterByCatStructure = categoryIds;

							if (mainViewService.getCurrentModuleName() === moduleName){
								let estimateMainService = $injector.get('estimateMainService');
								let selectedLineItem = estimateMainService.getSelected();
								let headerItem = estimateMainService.getSelectedEstHeaderItem();
								filterRequest.ProjectId = estimateMainService.getSelectedProjectId();
								filterRequest.LoadLimitedProperties = true;
								if (data.gridOptionsFilter.usageContext === 'estimateMainResourceService') {
									filterRequest.HeaderJobFk = headerItem ? headerItem.LgmJobFk : null;
									filterRequest.LineItemJobFk = selectedLineItem.LgmJobFk;
									let selectedResource = $injector.get(data.gridOptionsFilter.usageContext).getSelected();
									filterRequest.LgmJobFk = estimateMainService.getLgmJobId(selectedResource);
									filterRequest.AssemblyType = selectedResource && Object.prototype.hasOwnProperty.call(selectedResource, 'EstAssemblyTypeFk') ? selectedResource.EstAssemblyTypeFk: null;
								} else if (data.gridOptionsFilter.usageContext === 'estimateMainService'){
									filterRequest.HeaderJobFk = headerItem ? headerItem.LgmJobFk : null;
									filterRequest.LgmJobFk = estimateMainService.getLineItemJobId(selectedLineItem);
								}
							}
							else if (mainViewService.getCurrentModuleName() === 'project.main'){
								filterRequest.LoadLimitedProperties = true;
								filterRequest.ProjectId = $injector.get('projectMainService').getSelected().Id;
								filterRequest.EstLineItem = $injector.get('projectAssemblyMainService').getSelected();
								if (data.gridOptionsFilter.usageContext === 'projectAssemblyResourceService') {
									let selectedResource = $injector.get(data.gridOptionsFilter.usageContext).getSelected();
									filterRequest.AssemblyType = selectedResource && Object.prototype.hasOwnProperty.call(selectedResource, 'EstAssemblyTypeFk') ? selectedResource.EstAssemblyTypeFk: null;
								}
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
					entityRole: { leaf: { itemName: 'Assemblies', parentService: estimateMainAssemblycatTemplateService, parentFilter: 'assemblyCatFk' } },
					useItemFilter: true
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let multipleSelected = {};
			let assemblyPromise = {};
			service.transferAssemblyIds	= [];
			data.clearContent = function clearContent(){};

			let mdcAssembliesByCodeDictionary = {}; // get assembly on cell change

			let searchResult = null;

			angular.extend(service, {
				getAssemblyById: getAssemblyById,
				getAssemblyByIdAsync: getAssemblyByIdAsync,
				getItemByIdAsync: getAssemblyByIdAsync,
				getAssemblyByIdBulkEditorAsync: getAssemblyByIdBulkEditorAsync,

				init: init,
				setOptions: setOptions,

				search: search,

				getSearchListResult: getSearchListResult,
				setSearchListResult: setSearchListResult,

				getSearchList: getSearchList,

				getAssemblyByCodeAsync: getAssemblyByCodeAsync,

				onMultipleSelection: onMultipleSelection,
				setMultipleSelectedItems: setMultipleSelectedItems,
				getMultipleSelectedItems: getMultipleSelectedItems,

				getIsListBySearch: getIsListBySearch,
				setIsListBySearch: setIsListBySearch,

				onFetchAssemblies: new PlatformMessenger()
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

			function getAssemblyByCodeAsync(code){

				let costCode = mdcAssembliesByCodeDictionary[code];

				if (!_.isEmpty(costCode) && costCode.AllColumnsPresent === true){
					return $q.when(costCode);
				}else{
					const postData = {
						code : code
					};

					let projectFk = null;
					if (mainViewService.getCurrentModuleName() === moduleName){
						projectFk = $injector.get('estimateMainService').getSelectedProjectId();
					} else if (mainViewService.getCurrentModuleName() === 'project.main'){
						projectFk = $injector.get('projectMainService').getSelected().Id;
					}
					if (projectFk !== null){
						postData.projectId = projectFk;
					}

					return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/getitembycode', postData).then(function (response) {
						let data = response.data;
						if (!_.isEmpty(data)){
							basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', [data]);
							data.AllColumnsPresent = true;
							mdcAssembliesByCodeDictionary[data.Code] = data;
						}
						return data;
					});
				}
			}

			function filterByAssembly(list, options){
				let lookupOptions = options.lookupOptions;
				if (lookupOptions && lookupOptions.filterAssemblyKey){
					let filter = $injector.get('basicsLookupdataLookupFilterService').getFilterByKey(lookupOptions.filterAssemblyKey);
					return filter ? list.filter(filter.fn): list;
				}
				return list;
			}

			function filterByCircularDependency(list, options){
				list = list || [];
				let defer = $q.defer();
				let lookupOptions = options.lookupOptions;
				if (lookupOptions && lookupOptions.filterAssemblyKey === 'estimate-assemblies-resources-self-assignment-filter' && !_.isEmpty(list)){
					let assembly = $injector.get('estimateAssembliesService').getSelected() || {}; // TODO: move service to UI settings
					let ids = _.map(list, 'Id');
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/filterassignedassemblies_new', {assemblyId: assembly.Id, ids: ids}).then(function(response){
						let circleDependencyAssemblies = response.data;
						let listFiltered = list.filter(function(item){
							return _.indexOf(circleDependencyAssemblies, item.Id) === -1;
						});
						defer.resolve(listFiltered);
					});
				}
				else if (lookupOptions && lookupOptions.filterAssemblyKey === 'estimate-main-resources-prj-assembly-priority-filter' && !_.isEmpty(list)) {
					let projectAssemblies = _.filter(list, function (projectAssembly) {
						return (projectAssembly.EstAssemblyFk || 0) > 0;
					});
					let projectAssembliesKeys = _.map(projectAssemblies, 'EstAssemblyFk');

					let prjAssembly = $injector.get('projectAssemblyMainService').getSelected() || {}; // TODO: move service to UI settings

					let filteredEstAssembliesFromProjectAssembly = _.filter(list, function (masterAssembly) {
						return projectAssembliesKeys.indexOf(masterAssembly.Id) === -1;
					});

					if (lookupOptions.filterPrjAssemblyKey) {
						filteredEstAssembliesFromProjectAssembly = _.filter(filteredEstAssembliesFromProjectAssembly, function (item) {
							return prjAssembly.Id !== item.Id;
						});
					}

					estimateMainAssemblycatTemplateService.filterAssemblyByCats(filteredEstAssembliesFromProjectAssembly);

					let prjAssemblyids = _.map(filteredEstAssembliesFromProjectAssembly, 'Id');
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/filterassignedassemblies_new', {
						assemblyId: prjAssembly.Id, ids: prjAssemblyids,
						estAssemblyHeaderFk: prjAssembly.EstHeaderAssemblyFk, estAssemblyFk: prjAssembly.EstAssemblyFk
					}).then(function (response) {
						let circleDependencyAssemblies = response.data;
						let listFiltered = list.filter(function (item) {
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

				let categorySelected = estimateMainAssemblycatTemplateService.getSelected();
				if (categorySelected && categorySelected.Id){
					// if category is selected and search string has value, search only affects to assemblies from the selected category
					// 1. display only category selected
					estimateMainAssemblycatTemplateService.setItemFilter(function (assemblyCatEntity) {
						return assemblyCatEntity.Id === categorySelected.Id;
					});
					estimateMainAssemblycatTemplateService.enableItemFilter(true);
				}

				let categoriesFilteredList = estimateMainAssemblycatTemplateService.getFilteredList(parentScope.options, parentScope.entity);
				if (_.isEmpty(categoriesFilteredList)){
					parentScope.isLoading = false;
				}else{
					let isLoadCat = estimateMainAssemblycatTemplateService.isLoadCat;
					setIsListBySearch(true);
					getSearchList(searchString, null, entity, null, false, parentScope.options, null, isLoadCat, true).then(function(list){
						data.itemList = list;
						data.listLoaded.fire(list, true); // Search result is going to be loaded

						if (!_.isEmpty(searchString)){
							estimateMainAssemblycatTemplateService.filterCategories.fire(service.getList());

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
						headerCodes: []
					};
				}
			}

			function getSearchList(value, field, entity, pagination, isPopup, options, itemsTotalCount, isLoadCat, loadLimitedProperties){ // on Scroll

				let promise = $q.when(true);
				if (!isLoadCat){
					promise = estimateMainAssemblycatTemplateService.loadAllAssemblyCategories();
				}

				return promise.then(function(){ // load and cache categories data
					let assemblyLookupType = 'estassemblyfk';
					let categoryIds = estimateMainAssemblycatTemplateService.getFilteredCategoryIds(options, entity, isPopup).join(',');
					let assemblyType = entity && Object.prototype.hasOwnProperty.call(entity, 'EstAssemblyTypeFk') ? entity.EstAssemblyTypeFk: null;
					let projectFk = null;
					let parentItem;
					let headerJobId, lineItemJobId, jobId = null;
					let estimateMainService = $injector.get('estimateMainService');
					if (mainViewService.getCurrentModuleName() === moduleName){
						let selectedLineItem = estimateMainService.getSelected();
						let headerItem = estimateMainService.getSelectedEstHeaderItem();
						projectFk = estimateMainService.getSelectedProjectId();
						if (options.usageContext === 'estimateMainResourceService') {
							headerJobId = headerItem.LgmJobFk;
							lineItemJobId = selectedLineItem.LgmJobFk;
							let selectedResource = $injector.get(options.usageContext).getSelected();
							jobId = estimateMainService.getLgmJobId(selectedResource);
						} else if (options.usageContext === 'estimateMainService'){
							headerJobId = headerItem.LgmJobFk;
							jobId = estimateMainService.getLineItemJobId(selectedLineItem);
						}
					} else if (mainViewService.getCurrentModuleName() === 'project.main'){
						projectFk = $injector.get('projectMainService').getSelected().Id;
						parentItem = $injector.get('projectAssemblyMainService').getSelected();
					}

					let searchSplit = options && options.splitSearchString ? splitSearchString(value) : { value: value, headerCodes: [] };
					let postData = {
						'SearchValue': searchSplit.value,
						'Field': field,
						'CurrentPage': pagination ? pagination.CurrentPage || 0 : 0,
						'ItemsPerPage': 200,
						'ItemsTotalCount': itemsTotalCount ? itemsTotalCount : 0,
						'AssemblyType': assemblyType,
						'FilterByCatStructure': categoryIds,
						'ProjectId': projectFk,
						'EstLineItem': parentItem,
						'HeaderJobFk': headerJobId,
						'LineItemJobFk': lineItemJobId,
						'LgmJobFk': jobId,
						'AssemblyCategoryCodes': searchSplit.headerCodes,
						'LineItemContextEstHeader': estimateMainService.getLineItemContextEstHeaderId(),
						'LoadLimitedProperties': loadLimitedProperties || false
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/getsearchlist', postData).then(function (response) {
						let data = response.data;
						let dtos = _.uniqBy(data.dtos, 'Id');
						setSearchListResult(data.filterResult);

						let listFilteredByAssembly = filterByAssembly(dtos, options);
						return filterByCircularDependency(listFilteredByAssembly, options).then(function(listFilteredByCircularDependency){
							basicsLookupdataLookupDescriptorService.updateData(assemblyLookupType, listFilteredByCircularDependency);
							_.forEach(dtos, function(assembly){
								mdcAssembliesByCodeDictionary[assembly.Code] = assembly;
							});
							return $q.when(listFilteredByCircularDependency);
						});
					});
				});
			}

			function onMultipleSelection(grid, rows){
				let items = rows.map(function (row) {
					return grid.instance.getDataItem(row);
				});

				let categorySelected = estimateMainAssemblycatTemplateService.getSelected() || {};
				if (categorySelected && categorySelected.Id){

					if (_.isEmpty(rows)){
						_.remove(multipleSelected.items, { 'EstAssemblyCatFk': _.toInteger(categorySelected.Id) });
					}

					// Get Items from the current selected category
					// 1. It can be parent category
					// 2 Remove based on the current displayed list selection
					let currentItemsDisplayedIds = _.map(grid.instance.getData().getItems(), 'Id');
					_.remove(multipleSelected.items, function(mSelectedItem){
						return currentItemsDisplayedIds.indexOf(mSelectedItem.Id) > -1;
					});

					let categories = _.groupBy(items, 'EstAssemblyCatFk');

					_.forEach(categories, function(assemblies, categoryId){

						_.remove(multipleSelected.items, { 'EstAssemblyCatFk': _.toInteger(categoryId) });

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

			function getAssemblyById(id){
				return _.find(basicsLookupdataLookupDescriptorService.getData('estassemblyfk'), {Id: id});
			}

			function getAssemblyByIdAsync(id, sendHttpRequest) {
				let estassemblyfk = 'estassemblyfk';
				if (basicsLookupdataLookupDescriptorService.hasLookupItem(estassemblyfk, id) && sendHttpRequest !== true) {
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(estassemblyfk, id));
				} else {
					let assemblyPromiseWithId = 'assemblyPromise' + id.toString();
					if (!Object.prototype.hasOwnProperty.call(assemblyPromise, assemblyPromiseWithId)) {
						assemblyPromise[assemblyPromiseWithId] = getAssemblyByIdPromise(id);
					}

					return assemblyPromise[assemblyPromiseWithId].then(function (data) {
						assemblyPromise = {};
						return data;
					});
				}
			}

			function getAssemblyByIdPromise (id) {
				return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getassemblybyid?id=' + id).then(function (response) {
					basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', [response.data]);
					return response.data;
				});
			}

			function getAssemblyByIdBulkEditorAsync(id, scope){
				let service = $injector.get(scope.options.usageContext);
				let projectId = service.getSelectedProjectId();
				if (projectId){
					return $http.get(globals.webApiBaseUrl+'estimate/assemblies/getitembyidbulkeditor?id='+ id + '&projectId=' + projectId).then(function(response){
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

				setSearchListResult(readData.filterResult);

				// update the assemblies cache
				basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', dtos);

				let listFilteredByAssembly = filterByAssembly(dtos, getOptions());
				filterByCircularDependency(listFilteredByAssembly, getOptions()).then(function(listFilteredByCircularDependency){
					return service.setList(listFilteredByCircularDependency);
				});
			}
		}
	]);
})(angular);

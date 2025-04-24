
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResResourceDialogLookupService', [
		'$http', '$log', '$q', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainResGroupDialogLookupService', 'estimateMainResourceService',
		function ($http, $log, $q, $injector, PlatformMessenger, platformDataServiceFactory, estimateMainResGroupDialogLookupService, estimateMainResourceService) {

			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainResResourceDialogLookupService',
					httpRead: { route: globals.webApiBaseUrl + 'resource/master/resource/', endRead: 'listforestimate' },
					actions: {}, presenter: {list: {
						incorporateDataRead: incorporateDataRead
					}},
					entityRole: { leaf: { itemName: 'ResResources', parentService: estimateMainResGroupDialogLookupService, parentFilter : 'groupFk'} }
					// useItemFilter: false
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let multipleSelected = {};
			let options = { isInit: true };

			data.doNotLoadOnSelectionChange = true;
			data.clearContent = function clearContent(){};

			let allResResources = [];

			angular.extend(service, {
				getAllResResources: getAllResResources,
				getResResourceById: getResResourceById,
				getResResourceByIdAsync: getResResourceByIdAsync,
				getFilteredList: getFilteredList,
				init: init,
				isInit: isInit,
				getIsInit: getIsInit,
				doNotLoadOnSelectionChange: doNotLoadOnSelectionChange,
				loadAllResResources: loadAllResResources,
				refresh: refresh,
				filterResResources: filterResResources,
				// search: search,
				clearSearch: clearSearch,
				onMultipleSelection: onMultipleSelection,
				setMultipleSelectedItems: setMultipleSelectedItems,
				getMultipleSelectedItems: getMultipleSelectedItems,
				getIsListBySearch: getIsListBySearch,
				setIsListBySearch: setIsListBySearch,
				resetMultipleSelection: new PlatformMessenger(),
				showLoadingIndicator: new PlatformMessenger(),
				setMultiSelection: new PlatformMessenger()
			});

			angular.extend(multipleSelected, {
				items: [],
				isListBySearch: false
			});

			return service;

			function init(opts){
				options = opts;
			}

			function doNotLoadOnSelectionChange(loadOnSelectionChange){
				data.doNotLoadOnSelectionChange = loadOnSelectionChange;
			}

			function getAllResResources(){
				let result = $q.defer();
				$http.get(globals.webApiBaseUrl + 'resource/master/resource/lookuplist').then(function (response) {
					result.resolve(response.data);
				}, function (error) {
					$log.error('fail to load data for lookup type: estresresourcefk ' + globals.webApiBaseUrl + 'resource/master/resource/lookuplist');
					result.reject(error);
					result = null;
				});
				return result.promise;
			}

			function loadAllResResources(){
				let defer = $q.defer();
				if (_.isEmpty(allResResources)){
					getAllResResources().then(function(data){
						defer.resolve(data);
						allResResources = data || [];
					});
				}else{
					defer.resolve(allResResources);
				}
				return defer.promise;
			}

			function refresh(){
				allResResources = [];
				return loadAllResResources();
			}

			function filterResResources(list, ResGroupFk){
				let unfilteredList = list || _.filter(getUnfilteredList(), { GroupFk: ResGroupFk });
				let listFilteredByResKind = filterByResKind(unfilteredList);
				return listFilteredByResKind;
			}

			function getUnfilteredList(){
				return allResResources;
			}

			function filterByResKind(list){
				let selectedItem = estimateMainResourceService.getSelected();
				let kindFk = selectedItem.EstResKindFk;
				return list && list.length ? _.filter(list, {KindFk:kindFk}) : [];
			}

			function clearSearch(){
				options.searchString = '';
			}

			function onMultipleSelection(grid, rows){

				let items = rows.map(function (row) {
					return grid.instance.getDataItem(row);
				});

				let grpSelected = estimateMainResGroupDialogLookupService.getSelected() || {};
				if (grpSelected && grpSelected.Id){

					if (_.isEmpty(rows)){
						_.remove(multipleSelected.items, { 'GroupFk': _.toInteger(grpSelected.Id) });
					}
					let groups = _.groupBy(items, 'GroupFk');

					_.forEach(groups, function(resources, grpId){
						_.remove(multipleSelected.items, { 'GroupFk': _.toInteger(grpId) });
						_.forEach(resources, function(res){
							if (res && res.Id){
								multipleSelected.items.push(res);
							}
						});
					});
				}else{
					_.forEach(service.getList(), function(item){
						_.remove(multipleSelected.items, { 'Id': item.Id });
					});
					_.forEach(items, function(res){
						if (res && res.Id){
							multipleSelected.items.push(res);
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

			function getResResourceById(id){
				return _.find(allResResources, {Id: id});
			}

			function getResResourceByIdAsync(id){
				return loadAllResResources().then(function(){
					return $q.when(_.find(allResResources, {Id: id}));
				});
			}

			function getFilteredList(){
				let grpSelected = estimateMainResGroupDialogLookupService.getSelected();
				let isGrpEmpty = _.isEmpty(estimateMainResGroupDialogLookupService.getSelected());
				let list = isGrpEmpty ? getUnfilteredList() : _.filter(getUnfilteredList(), { GroupFk: grpSelected.Id });
				return filterByResKind(list);
			}

			function isInit(value){
				options.isInit = value;
			}

			function getIsInit(){
				return options.isInit;
			}

			function incorporateDataRead(readData, data){
				readData = readData || [];
				return data.handleReadSucceeded(filterByResKind(readData), data);
			}
		}
	]);
})(angular);

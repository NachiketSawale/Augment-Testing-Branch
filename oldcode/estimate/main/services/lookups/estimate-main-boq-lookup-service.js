/**
 * Created by joshi on 14.04.2015.
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainBoqLookupService
	 * @function
	 *
	 * @description
	 * estimateMainBoqLookupService provides all lookup data for estimate module boq lookup
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainBoqLookupService', ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService', 'estimateMainService',
		'cloudCommonGridService', 'procurementPackageDataService', 'estimateMainCommonLookupService','platformGridAPI',
		function ($http, $q, $injector, basicsLookupdataLookupDescriptorService, estimateMainService, cloudCommonGridService,
			procurementPackageDataService, estimateMainCommonLookupService, platformGridAPI) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estBoqItems:[],
				isSource:false,
				estSourceBoqItems:[]
			};

			let getProjectId = function getProjectId(){

				if (platformGridAPI.grids.exist('681223e37d524ce0b9bfa2294e18d650') && !lookupData.isSource){
					return estimateMainService.getSelectedProjectId();
				}
				else if (platformGridAPI.grids.exist('35b7329abce3483abaffd5a437c392dc') && lookupData.isSource){
					return $injector.get('estimateMainCopySourceFilterService').getSelectedProjectId();
				}
				else if (platformGridAPI.grids.exist('067be143d76d4ad080660ef147349f1d')){
					let packageItems = procurementPackageDataService.getList();
					return _.uniq(_.map(packageItems,'ProjectFk'));
				}
				else if (platformGridAPI.grids.exist('8fbb8f4fb42343149666a3d7c24dc1b4')){
					let projectMainService = $injector.get('projectMainService');
					let selectedItem = projectMainService.getSelected();
					if (selectedItem && selectedItem.Id) {
						return selectedItem.Id;
					}
					return null;
				}
				else if (platformGridAPI.grids.exist('13120439d96c47369c5c24a2df29238d') || platformGridAPI.grids.exist('98239ba315374530a1e28ad333c6a7ee') ||
					platformGridAPI.grids.exist('3a1a26c46b9e4e35af5ad60fd2f49679') || platformGridAPI.grids.exist('0fcbaf8c89ac4493b58695cfa9f104e2') ||
					platformGridAPI.grids.exist('f455b2b78f094d2a9be03beb70116d0f')){
					let schedulingMainService = $injector.get('schedulingMainService');
					let selectedItem = schedulingMainService.getSelected();
					if (selectedItem && selectedItem.ProjectFk) {
						return selectedItem.ProjectFk;
					}
					return null;
				}
				else if(platformGridAPI.grids.exist('021c5211c099469bb35dcf68e6aebec7')){
					let projectMainForCOStructureService = $injector.get('projectMainForCOStructureService');
					if(projectMainForCOStructureService) {
						return projectMainForCOStructureService.getSelected() ? projectMainForCOStructureService.getSelected().Id : -1;
					}
				}
				else{
					return estimateMainService.getProjectId();
				}
			};

			let getEstBoqItems = function(){
				let projectIds = getProjectId();
				if(projectIds && _.isArray(projectIds)){
					let projectSearchValue = {};
					projectSearchValue.ProjectIds = projectIds;
					return $http.post(globals.webApiBaseUrl + 'boq/project/getboqsearchlist', projectSearchValue);
				}
				else if(projectIds){
					return $http.get(globals.webApiBaseUrl + 'boq/project/getboqsearchlist?projectId='+ getProjectId());
				}
				else{
					return $q.when([]);
				}

			};

			// get data list of the estimate Boq items
			service.getList = function getList() {
				if(lookupData.isSource){
					return lookupData.estSourceBoqItems && lookupData.estSourceBoqItems.length ? lookupData.estSourceBoqItems : [];
				} else {
					return lookupData.estBoqItems && lookupData.estBoqItems.length ? lookupData.estBoqItems : [];
				}
			};

			// get data list of the estimate Boq items
			service.getListAsync = function getListAsync() {

				let list = service.getList();
				if(list && list.length >0){
					// return $q.when((angular.copy(_.uniqBy(list, 'Id'))));
					return $q.when(_.uniqBy(list, 'Id'));
				}
				else{
					if(!lookupData.estBoqListAsyncPromise) {
						lookupData.estBoqListAsyncPromise = getEstBoqItems();
					}
					return lookupData.estBoqListAsyncPromise.then(function(response){
						lookupData.estBoqListAsyncPromise = null;
						if(lookupData.isSource){
							lookupData.estSourceBoqItems = _.uniq(response.data, 'Id');
							return lookupData.estSourceBoqItems;
						} else {
							lookupData.estBoqItems = _.uniq(response.data, 'Id');
							return lookupData.estBoqItems;
						}
					});
				}
			};

			// get list of the estimate boq item by Id
			service.getItemById = function getItemById(value) {
				let item = {};
				let list = lookupData.isSource ? lookupData.estSourceBoqItems : lookupData.estBoqItems;
				if(list && list.length>0){
					let output = [];
					list = cloudCommonGridService.flatten(list, output, 'BoqItems');
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item && item.Id ? item : null;
			};

			// get list of the estimate boq item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value,options) {
				lookupData.isSource = options && options.isSourceLineItem;
				if(lookupData.isSource) {

					if (lookupData.estSourceBoqItems && lookupData.estSourceBoqItems.length) {
						return $q.when(service.getItemById(value));
					} else {
						if (!lookupData.estSourceBoqItemsPromise) {
							lookupData.estSourceBoqItemsPromise = service.getListAsync();
						}

						return lookupData.estSourceBoqItemsPromise.then(function () {
							lookupData.estSourceBoqItemsPromise = null;
							return service.getItemById(value);
						});
					}

				} else {

					if (lookupData.estBoqItems && lookupData.estBoqItems.length) {
						return $q.when(service.getItemById(value));
					} else {
						if (!lookupData.estBoqItemsPromise) {
							lookupData.estBoqItemsPromise = service.getListAsync();
						}

						return lookupData.estBoqItemsPromise.then(function () {
							lookupData.estBoqItemsPromise = null;
							return service.getItemById(value);
						});
					}

				}

			};

			// get list of the estimate boq items by filter value
			service.getSearchList = function getSearchList(value) {
				if (value) {
					let list = service.getList();
					if(list && list.length >0){
						let filterParams = {
							'codeProp': 'SearchPattern',
							'descriptionProp': null,
							'isSpecificSearch': null,
							'searchValue': value
						};
						let existItems = estimateMainCommonLookupService.getSearchData(filterParams, list, 'BoqItems', 'BoqItemFk', true);
						return $q.when(existItems);
					} else {
						if (!lookupData.searchBoqItemsPromise) {
							lookupData.searchBoqItemsPromise = $http.get(globals.webApiBaseUrl + 'boq/project/getboqsearchlist?projectId=' + getProjectId() + '&filterValue=' + value);
						}
						return lookupData.searchBoqItemsPromise.then(function (response) {
							lookupData.searchBoqItemsPromise = null;
							return _.uniq(response.data, 'Id');
						});
					}
				} else {
					return $q.when([]);
				}
			};

			// estimate look up data service call
			service.loadLookupData = function() {
				if(lookupData.estBoqItems === null || (lookupData.estBoqItems && lookupData.estBoqItems.length === 0)){
					lookupData.estBoqItemsPromise = getEstBoqItems();
					if(!lookupData.estBoqItemsPromise){return;}
					lookupData.estBoqItemsPromise.then(function(response){
						lookupData.estBoqItemsPromise = null;
						// lookupData.estBoqItems = angular.copy(response.data);
						lookupData.estBoqItems = response.data;
						let output = [];
						if(lookupData.estBoqItems){
							cloudCommonGridService.flatten(lookupData.estBoqItems, output, 'BoqItems');
						}
						basicsLookupdataLookupDescriptorService.updateData('estboqitems', output);
					});
				}
			};

			service.loadData = function loadData() {
				if (!lookupData.estBoqListAsyncPromise) {
					lookupData.estBoqListAsyncPromise = getEstBoqItems();
				}
				return lookupData.estBoqListAsyncPromise.then(function (response) {
					lookupData.estBoqListAsyncPromise = null;
					// lookupData.estBoqItems = angular.copy(_.uniq(response.data, 'Id'));
					lookupData.estBoqItems = _.uniq(response.data, 'Id');
					return lookupData.estBoqItems;
				});
			};

			// General stuff
			service.reload = function(){
				service.loadLookupData();
			};

			// force to reload
			service.forceReload = function(){
				return getEstBoqItems();
			};

			service.setLookupData = function(data){
				lookupData.estBoqItems = data;
			};

			service.addLookupData = function(data){
				lookupData.estBoqItems = lookupData.estBoqItems.concat(data);
			};

			service.clear = function (){
				lookupData.estBoqItems = [];
			};


			service.loadDataByBoqHeaderId = function (headerIds) {
				if (!headerIds || !headerIds.length) {
					return;
				}

				return $http.post(globals.webApiBaseUrl + 'boq/main/getboqrootitemsbyboqheaderids', headerIds).then(function (res) {
					if (res && res.data && res.data.length > 0) {
						service.appendCacheData(res.data);
					}

					return null;
				});
			};

			service.appendCacheData = function (boqList){
				if(!lookupData.estBoqItems || lookupData.estBoqItems.length <= 0){
					lookupData.estBoqItems = boqList;
				}else{
					for(let i= 0; i < lookupData.estBoqItems.length; i++){
						let boq = lookupData.estBoqItems[i];
						let newBoq = _.find(boqList, {BoqHeaderFk: boq.BoqHeaderFk});
						lookupData.estBoqItems[i] = newBoq || boq;
					}
				}

				_.forEach(boqList, function(boq){
					!_.find(lookupData.estBoqItems, {BoqHeaderFk: boq.BoqHeaderFk}) && lookupData.estBoqItems.push(boq);
				});
			};

			return service;
		}]);
})();

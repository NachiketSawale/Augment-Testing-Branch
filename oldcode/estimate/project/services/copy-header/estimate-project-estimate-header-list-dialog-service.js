/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */

(function () {
	'use strict';
	let moduleName = 'estimate.project';
	let estimateProjectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateProjectEstimateHeaderListDialogService
	 * @function
	 *
	 * @description
	 * This is the data service for project estimate Header Copy functionality during Deep Copy Project.
	 */
	angular.module(moduleName).factory('estimateProjectEstimateHeaderListDialogService', ['$http', 'platformDataServiceFactory', 'projectMainService', 'PlatformMessenger',
		function ($http, platformDataServiceFactory, projectMainService, PlatformMessenger) {

			let service = {};
			let dataList  =[];
			let projectEntity = null;

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}
			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function getList(){
				return  dataList;
			}

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				getList: getList
			});

			let estimateProjectHeaderListServiceOptions = {
				module: estimateProjectModule,
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainRemovePackageWiyardDetailService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				},
				entitySelection: {}
			};

			let container = platformDataServiceFactory.createNewComplete(estimateProjectHeaderListServiceOptions);

			container.data.usesCache = false;

			angular.extend(service, container.service);

			service.addItems = function addItems(items) {
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = dataList ? dataList : [];
				angular.forEach(items, function(item){
					let matchItem = _.find(dataList, {Id : item.Id});
					item.IsChecked = item.IsChecked ? item.IsChecked : false;
					if(!matchItem){
						dataList.push(item);
					}else{
						angular.merge(matchItem, item);
					}
				});
				container.data.itemList = dataList;
				service.refreshGrid();
			};

			service.getDataItem = function getDataItem() {
				return dataList;
			};

			service.setProject = function(entity){
				projectEntity = entity;
			};

			service.setDataList= function(isWizardOpen) {

				if(isWizardOpen){

					let projectFk = projectEntity ? projectEntity.Id : projectMainService.getIfSelectedIdElse(null);

					return $http.get(globals.webApiBaseUrl + 'estimate/main/header/lookup?projectId=' +projectFk ).then(function(response){
						if(response && response.data  ){
							let estHeaders =_.filter(response.data,{'IsGCOrder':false});
							service.addItems( estHeaders);
						}else{
							return null;
						}
					});
				}else{
					dataList= null;
				}
			};

			service.getItemsToCopy = function getItemsToCopy() {
				let list = service.getList();
				return _.find(list, {IsChecked : true});
			};

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			service.parentService = function(){
				return projectMainService;
			};

			service.setValueToDataList = function setValueToDataList(col, value){
				dataList = dataList ? dataList : [];
				angular.forEach(dataList, function(item){
					item[col] = value;
				});
			};

			return service;
		}]);
})();

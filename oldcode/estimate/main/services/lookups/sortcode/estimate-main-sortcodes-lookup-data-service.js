/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCodesLookupDataService
	 * @function
	 * @description
	 * estimateMainSortCodesLookupDataService is the data service for all project sort-code01 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCodesLookupDataService', ['$injector', 'platformLookupDataServiceFactory','estimateMainService',

		function ($injector, platformLookupDataServiceFactory, estimateMainService) {
			let service = {
				createDataService : createDataService,
				getService: getService
			};

			function getProjectId() {
				let projectId = estimateMainService.getSelectedProjectId() > 0 ? estimateMainService.getSelectedProjectId()  : 0;
				return '?projectId=' + projectId;
			}
			function doProcessData(itemList, data){
				let existingData = data.dataCache.get(data.filter);
				_.forEach(existingData, function (existingItem) {
					let item = _.find(itemList, {Code :existingItem.Code});
					if(!item){
						itemList.push(existingItem);
					}
				});
			}
			function createDataService (route){
				let sortcodeLookupDataServiceConfig = {
					httpRead: { route: globals.webApiBaseUrl + 'project/structures/'+ route +'/', endPointRead: 'list' },
					filterParam: 'projectId',
					prepareFilter : function(){
						return getProjectId();
					}
				};
				let container =  platformLookupDataServiceFactory.createInstance(sortcodeLookupDataServiceConfig);
				let service = container.service;
				// will get 0 at the first time loaded!!
				// container.data.filter = estimateMainService.getSelectedProjectId() > 0 ? estimateMainService.getSelectedProjectId()  : 0;
				container.data.filter = getProjectId;
				container.data.doProcessData = doProcessData;

				function getItemByVal (value, list){
					let item = {};
					if(_.isString(value)){
						item = _.find(list, {Code :value.trim()});
						if(!item){
							item = _.find(list, {Id : 0});
							item = item ? item : {Id:0, Code : '', Version:0};
							item.Code = value.trim();
						}
					}else{
						item = _.find(list, {Id:value});
					}
					return item;
				}

				service.getItemById = function getItemById(value, opt){
					if(!container.data.filter){
						container.data.filter = estimateMainService.getSelectedProjectId() > 0 ? estimateMainService.getSelectedProjectId()  : 0;
					}
					return getItemByVal (value, service.getListSync(opt));
				};

				service.setItem = function setItem(opt, item){
					if(!container.data.filter){
						container.data.filter = estimateMainService.getSelectedProjectId() > 0 ? estimateMainService.getSelectedProjectId() : 0;
					}
					var scList = service.getListSync(opt);
					scList.push(item);
					service.setCache(opt, scList);
				};

				service.removeItemByCode = function removeItemByCode(opt, code){
					var scList = service.getListSync(opt);
					_.remove(scList, {Code : code});
					service.setCache(opt, scList);
				};

				service.updateItemIdByCode = function updateItemByCode(opt, code, Id,description){
					var scList = service.getListSync(opt);
					var scitem = _.remove(scList, {Code : code});
					if(scitem.length){
						scitem[0].Id=Id;
						scList.push(scitem[0]);
					}
					else{
						var scObject = {
							Id: Id,
							Code: code,
							DescriptionInfo: {
								Description: description,
								Translated: description,
								Modified: false
							}
						};
						scList.push(scObject);
					}
					service.setCache(opt, scList);
				};

				service.getMaxId = function getMaxId(opt){
					var maxId = 0;
					var scList = service.getListSync(opt);
					if(scList.length){
						maxId = _.maxBy(scList, 'Id').Id;
					}
					return maxId;
				};

				service.getItemByIdAsync = function getItemByIdAsync(value, opt){
					return service.getList(opt).then(function(list){
						return getItemByVal (value, list);
					});
				};

				service.clear = function clear(){
					container.data.dataCache.data = {};
				};

				service.reload = function reload(route){
					return createDataService(route);
				};

				return service;
			}

			function getService(sortCodeId) {
				sortCodeId = sortCodeId<10? '0'+sortCodeId : sortCodeId;
				return $injector.get('estimateMainSortCode'+sortCodeId.toString()+'LookupDataService');
			}

			return service;
		}]);
})(angular);

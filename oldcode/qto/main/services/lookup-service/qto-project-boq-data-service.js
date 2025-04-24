/**
 * Created by xia on 12/27/2016.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'qto.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('qtoProjectBoqDataService', ['$http', '$q', 'platformGridAPI', 'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService', 'qtoMainHeaderDataService', 'qtoMainHeaderProjectDataService',
		function ( $http, $q, platformGridAPI, basicsLookupdataLookupDescriptorService, cloudCommonGridService, qtoMainHeaderDataService, qtoMainHeaderProjectDataService) {

			// Object presenting the service
			var service = {};

			let headerGrid = '7cbac2c0e6f6435aa602a72dccd50881';

			// private code
			var lookupData = {
				boqHeaderInfo:[]
			};

			var getboqHeaderInfo = function(){
				let dataService = platformGridAPI.grids.exist(headerGrid) ? qtoMainHeaderDataService : qtoMainHeaderProjectDataService;
				var qtoHeaders =  dataService.getList();
				var boqHeaderIds = (_.uniq((_.map(qtoHeaders, 'BoqHeaderFk'))));
				var param ={
					boqHeaderIds :boqHeaderIds
				};
				return $http.post(globals.webApiBaseUrl + 'boq/main/GetBoqHeadersInfoByIds',param);
			};

			// get data list of the estimate Boq items
			service.getList = function getList() {
				return lookupData.boqHeaderInfo && lookupData.boqHeaderInfo.length ? lookupData.boqHeaderInfo : [];
			};

			// get data list of the estimate Boq items
			service.getListAsync = function getListAsync() {
				var list = service.getList();
				if(list && list.length >0){
					return $q.when(_.uniqBy(list, 'Id'));
				}
				else{
					if(!lookupData.rootBoqListAsyncPromise) {
						lookupData.rootBoqListAsyncPromise = getboqHeaderInfo();
					}
					return lookupData.rootBoqListAsyncPromise.then(function(response){
						lookupData.rootBoqListAsyncPromise = null;
						lookupData.boqHeaderInfo = _.uniq(response.data, 'Id');
						return lookupData.boqHeaderInfo;
					});
				}
			};

			// get list of the estimate boq item by Id
			service.getItemById = function getItemById(value) {
				var item = null;
				var list = lookupData.boqHeaderInfo;
				if(list && list.length>0){
					item = _.find(list,{'Id':value});
				}
				return item && item.Id ? item: null;
			};

			service.getItemByIdAsync = function getItemByIdAsync(value) {
				var item = null;
				if(lookupData.boqHeaderInfo && lookupData.boqHeaderInfo.length){
					item = service.getItemById(value);
				}
				if(!item){
					if(!lookupData.boqHeaderInfoPromise){
						let dataService = platformGridAPI.grids.exist(headerGrid) ? qtoMainHeaderDataService : qtoMainHeaderProjectDataService;
						var qtoHeaders =  dataService.getList();
						var boqHeaderIds = (_.uniq((_.map(qtoHeaders, 'BoqHeaderFk'))));
						boqHeaderIds.push(value);
						var param ={
							boqHeaderIds :boqHeaderIds
						};
						lookupData.boqHeaderInfoPromise =  $http.post(globals.webApiBaseUrl + 'boq/main/GetBoqHeadersInfoByIds',param);
					}
					return lookupData.boqHeaderInfoPromise.then(function(response){
						lookupData.boqHeaderInfoPromise = null;
						item = _.find(response.data,{'Id':value});
						lookupData.boqHeaderInfo = lookupData.boqHeaderInfo.concat(response.data);
						lookupData.boqHeaderInfo = _.uniq(lookupData.boqHeaderInfo, 'Id');
						return item;
					});
				}else{
					return $q.when(item);
				}

			};

			service.getSearchList = function getSearchList(value) {
				if (value) {
					if(value.includes('PrjProjectFk')) { // lookup project boq
						if(value.includes('isCrb')){
							let filters = value.split('&&');
							let project = filters[0].substring(filters[0].indexOf('=') + 1, filters[0].lastIndexOf(')'));
							let isCrb = filters[1].substring(filters[1].indexOf('=') + 1, filters[1].lastIndexOf(')'));
							return $http.get(globals.webApiBaseUrl + 'qto/main/header/getprojectboq', {
								params: {
									project: project,
									isCrb: isCrb
								}}).then(function (response) {
								return _.uniq(response.data, 'Id');
							});
						}else {
							return $http.get(globals.webApiBaseUrl + 'boq/project/getsearchlist?filterValue=' + value).then(function (response) {
								return _.uniq(response.data, 'Id');
							});
						}
					}
					else if(value.includes('OrdHeaderFk')){ // lookup sales contract boq
						if(value.includes('isCrb')){
							let filters = value.split('&&');
							let contractId = filters[0].substring(filters[0].indexOf('=') + 1, filters[0].lastIndexOf(')'));
							let isCrb = filters[1].substring(filters[1].indexOf('=') + 1, filters[1].lastIndexOf(')'));
							return $http.get(globals.webApiBaseUrl + 'qto/main/header/getcontractprjboqlist',{
								params: {
									contractId: contractId,
									isCrb: isCrb
								}}).then(function (response) {
								if(response && response.data) {
									return _.uniq(response.data, 'Id');
								}
							});
						}else {
							let contractId = value.substring(value.indexOf('=') + 1, value.lastIndexOf(')'));
							return $http.get(globals.webApiBaseUrl + 'sales/contract/boq/prjboqlist?contractId=' + contractId).then(function (response) {
								if(response && response.data) {
									return _.uniq(response.data, 'Id');
								}
							});
						}
					}
					else {
						return $q.when([]);
					}
				} else {
					return $q.when([]);
				}
			};

			service.loadData = function loadData() {
				if (!lookupData.rootBoqListAsyncPromise) {
					lookupData.rootBoqListAsyncPromise = getboqHeaderInfo();
				}
				return lookupData.rootBoqListAsyncPromise.then(function (response) {
					lookupData.rootBoqListAsyncPromise = null;
					lookupData.boqHeaderInfo = _.uniq(response.data, 'Id');
					return lookupData.boqHeaderInfo;
				});
			};

			// force to reload
			service.forceReload = function(){
				return getboqHeaderInfo();
			};

			service.setLookupData = function(data){
				lookupData.boqHeaderInfo = data;
			};

			service.clear = function (){
				lookupData.boqHeaderInfo = [];
			};
			return service;
		}]);
})(angular);


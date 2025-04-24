/**
 * Created by joshi on 05.04.2016.
 */
(function () {
	/* global globals, _ */
	'use strict';
	let modulename = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstConfigTypeService
	 * @description
	 * estimateMainEstConfigTypeService is the data service for estimate config type list.
	 */
	angular.module(modulename).factory('estimateMainEstConfigTypeService', ['$q', '$http',
		function ($q, $http) {

			let data = [];
			let service = {};
			let editType = '', isReload;

			service.loadData = function (type) {
				let url;
				editType = type;
				if(type === 'customizeforall'){
					url = 'basics/customize/EstConfigType/list';
				}else{
					url = 'estimate/main/configtype/list';
				}
				return $http.post(globals.webApiBaseUrl + url)
					.then(function (response) {
						data = response.data;
						data = _.filter(data, function(item){
							return item.Id !== 0;
						});
						angular.forEach(data, function(d){
							d.Description = d.DescriptionInfo.Translated;
						});
						// make sure the data is reload by this selection
						isReload = true;
						return data;
					});
			};

			service.getList = function getList() {
				let defer = $q.defer();
				defer.resolve(data);

				return defer.promise;
			};

			service.getListAsync = function getListAsync() {
				return service.loadData();
			};

			service.getItemById = function getItemById(id) {
				return _.find(data, {'Id': id});
			};

			service.getItemByIdAsync = function getItemByIdAsync(id) {
				return service.getListAsync().then(function(){
					return service.getItemById(id);
				});
			};

			service.getItemByKey = function getItemByKey(id) {
			// return lookupDescriptorService.getLookupItem(lookupType, key);
				if(data && data.length > 0 && isReload){
					isReload = false;
					return _.find(data, {'Id': id});
				}
				else{
					return service.loadData(editType).then(function(){
						isReload = false;
						return _.find(data, {'Id': id});
					});
				}
			};

			return service;
		}
	]);
})();

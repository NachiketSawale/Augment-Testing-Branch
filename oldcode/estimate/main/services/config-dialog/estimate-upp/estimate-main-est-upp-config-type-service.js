/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let modulename = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstUppConfigTypeService
	 * @description
	 * estimateMainEstUppConfigTypeService is the data service for estimate upp config type list.
	 */
	angular.module(modulename).factory('estimateMainEstUppConfigTypeService', ['$q', '$http', function ($q, $http) {

		// selectedItemId the item will be showed
		let data = [], selectedItemId = '', filterByMdcContextId = false,isReload;
		let service = {};

		service.setFilterByMdcContextId = function (isFilterByMdcContextId) {
			filterByMdcContextId = isFilterByMdcContextId;
			data = [];
		};

		service.clearFilterByMdcContextId = function () {
			filterByMdcContextId = false;
			data = [];
		};

		service.loadData = function () {
			// load data each time
			let url = '';
			if (filterByMdcContextId) {
				url = globals.webApiBaseUrl + 'estimate/main/upptype/list';
			} else {
				url = globals.webApiBaseUrl + 'basics/customize/estuppconfigtype/list';
			}
			return $http.post(url).then(function (response) {
				data = response.data;
				angular.forEach(data, function (d) {
					d.Description = d.DescriptionInfo.Translated;
				});
				if (filterByMdcContextId) {
					data = _.filter(data, function (item) {
						return (item.Islive || item.IsLive);
					});
				}
				// make sure the data is reload by this selection
				isReload = true;
				return data;
			});
		};

		service.getList = function getList() {
			angular.forEach(data, function (d) {
				d.Description = d.DescriptionInfo.Translated;
			});
			// need to filter only islive->true data in estimate module, but not the being used one
			// if the item being used, then will set to readonly
			data = _.filter(data, function (item) {
				return (item.Islive || item.IsLive || item.Id === selectedItemId);
			});
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
			return service.getListAsync().then(function () {
				let item = service.getItemById(id);
				if(item && filterByMdcContextId){
					item.UppConfigFk = item.UppConfigFk || item.EstUppConfigFk;
				}
				return item;
			});
		};

		service.getItemByContextIdAsync = function getItemByContextIdAsync(id) {
			if(data && data.length > 0){
				return $.when(service.getItemById(id));
			}

			return service.loadData().then(function () {
				return service.getItemById(id);
			});
		};

		service.setSelectedItemId = function setSelectedItemId(itemId) {
			selectedItemId = itemId;
		};

		service.getItemByKey = function getItemByKey(id) {
			if(data && data.length > 0 && isReload){
				isReload = false;
				return _.find(data, {'Id': id});
			}
			else{
				return service.loadData().then(function(){
					isReload = false;
					return _.find(data, {'Id': id});
				});
			}
		};

		return service;
	}
	]);
})();

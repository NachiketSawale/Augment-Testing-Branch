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
	 * @name estimateMainReplaceResourceFunctionTypeLookupDataService
	 * @description
	 * estimateMainReplaceResourceFunctionTypeLookupDataService is the data service for estimate replace resource function type list.
	 */
	angular.module(modulename).factory('estimateMainReplaceResourceFunctionTypeLookupDataService', ['$q', '$http',
		function ($q, $http) {

			// selectedItemId the item will be showed
			let data = [], selectedItemId = '', isReload;
			let service = {};

			service.loadData = function () {
				return $http.get(globals.webApiBaseUrl + 'estimate/main/modify/getselectfunction')
					.then(function (response) {
						data = response.data;
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

			service.setSelectedItemId = function setSelectedItemId(itemId){
				selectedItemId = itemId;
			};

			service.getSelectedItemId = function getSelectedItemId(){
				return selectedItemId;
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

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
	 * @name estimateMainEstStructureTypeService
	 * @description
	 * estimateMainEstStructureTypeService is the data service for estimate structure type list.
	 */
	angular.module(modulename).factory('estimateMainEstRuleLevelService', ['$q', '$http',
		function ($q, $http) {

			// selectedItemId the item will be showed
			let data = [], selectedItemId = '', isReload;
			let service = {};

			service.loadData = function () {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/estrootassignmentlevel/list')
					.then(function (response) {
						data = response.data;
						angular.forEach(data, function(d){
							d.Description = d.DescriptionInfo.Translated;
						});
						// need to filter only islive->true data in estimate module, but not the being used one
						// if the item being used, then will set to readonly
						data = _.filter(data, function(item){
							return (item.IsLive || item.Id === selectedItemId);
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
				let item = _.find(data, {'Id': id});
				return item;
			};

			service.getItemByIdAsync = function getItemByIdAsync(id) {
				return service.getListAsync().then(function(){
					return service.getItemById(id);
				});
			};

			service.setSelectedItemId = function setSelectedItemId(itemId){
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

			service.getDefaultId = function getDefaultId() {
				let item = _.find(data, { 'IsLive': true, 'IsDefault': true});

				if (item){
					return item.Id;
				}else{
				// Try to return first element from root assignment level
					let firstItem = _.first(data);
					if (firstItem){
						return firstItem.Id;
					}

					// If it reaches here, then there is no root assignment level added
					// eslint-disable-next-line no-console
					console.error('Add Root Assignment level not found. No default Root Assignment Level Found.');
				}
			};

			return service;
		}
	]);
})();

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainColumnConfigTypeService
	 * @function
	 *
	 * @description
	 * estimateMainColumnConfigTypeService provides all lookup data for estimate module column config type lookup
	 */
	angular.module(moduleName).factory('estimateMainColumnConfigTypeService', ['$q', '$http',
		function ($q, $http) {

			// selectedItemId the item will be showed
			let data = [], selectedItemId = '', mdcContextId, isReload;
			let service = {
				getList: getList,
				getItemById: getItemById,
				loadData: loadData,
				getItemByIdAsync: getItemByIdAsync,
				setSelectedItemId: setSelectedItemId,
				setMdcContextId: setMdcContextId,
				clearMdcContextId: clearMdcContextId,
				getItemByKey : getItemByKey
			};

			function setSelectedItemId(itemId) {
				selectedItemId = itemId;
			}

			function setMdcContextId(id) {
				if(id !== 0){
					mdcContextId = id;
				}
			}

			function clearMdcContextId(){
				mdcContextId = null;
			}

			function loadData() {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/EstColumnConfigType/list')
					.then(function (response) {
						data = response.data;
						if (mdcContextId) {
							data = _.filter(data, {'ContextFk': mdcContextId});
						}
						angular.forEach(data, function (d) {
							d.Description = d.DescriptionInfo.Translated;
						});
						// need to filter only islive->true data in estimate module, but not the being used one
						// if the item being used, then will set to readonly
						data = _.filter(data, function (item) {
							return (item.IsLive || item.Id === selectedItemId);
						});
						// make sure the data is reload by this selection
						isReload = true;
						return data;
					});
			}

			function getList() {
				let defer = $q.defer();
				defer.resolve(data);

				return defer.promise;
			}

			function getListAsync() {
				return service.loadData();
			}

			function getItemById(id) {
				return _.find(data, {'Id': id});
			}

			function getItemByIdAsync(id) {
				return getListAsync().then(function () {
					return getItemById(id);
				});
			}

			function getItemByKey(id) {
				if(data && data.length > 0 && isReload){
					isReload = false;
					return _.find(data, {'Id': id});
				}
				else{
					return loadData().then(function(){
						isReload = false;
						return _.find(data, {'Id': id});
					});
				}
			}

			return service;
		}]);
})();

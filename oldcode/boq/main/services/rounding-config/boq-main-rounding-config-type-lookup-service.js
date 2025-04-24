/**
 * $Id: boq-main-rounding-config-type-lookup-service.js 44255 2022-07-01 12:51:53Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let modulename = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainRoundingConfigTypeLookupService
	 * @description
	 * This is the data service for boq rounding config type list.
	 */
	angular.module(modulename).factory('boqMainRoundingConfigTypeLookupService', ['$q', '$http',
		function ($q, $http) {

			let data = [], selectedItemId = '', mdcContextId, isReload;
			let service = {
				getList: getList,
				getItemById: getItemById,
				loadData: loadData,
				getItemByIdAsync: getItemByIdAsync,
				setSelectedItemId: setSelectedItemId,
				setMdcContextId: setMdcContextId,
				getMdcContextId: getMdcContextId,
				clearMdcContextId: clearMdcContextId,
				getItemByKey : getItemByKey
			};

			return service;

			function setSelectedItemId(itemId){
				selectedItemId = itemId;
			}

			function getMdcContextId(){
				return mdcContextId;
			}

			function setMdcContextId(id) { // todo  check?
				if(id !== 0){
					mdcContextId = id;
				}
			}

			function clearMdcContextId(){
				mdcContextId = null;
			}

			function loadData() {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/boqroundingconfigurationtype/list')
					.then(function (response) {
						data = response.data;
						if (mdcContextId) {
							data = _.filter(data, {'LineItemContextFk': mdcContextId}); // For we use the "customize api" for calling the rounding config types we have to follow its property naming rules
						}
						angular.forEach(data, function (d) {
							d.Description = d.DescriptionInfo.Description;
						});
						// need to filter only islive->true data in boq module, but not the being used one
						// if the item being used, then will set to readonly
						data = _.filter(data, function(item){
							return (item.IsLive || item.Id === selectedItemId);
						});
						// make sure the data is reloaded by this selection
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
				let item = _.find(data, {'Id': id});
				return item;
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
		}
	]);
})();


(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateAllowanceAssignmentConfigTypeDataService', ['$q', '$http','basicsLookupdataLookupDescriptorService',
		function ($q, $http,basicsLookupdataLookupDescriptorService) {

			// selectedItemId the item will be showed
			let data = [], selectedItemId = '', mdcContextId;
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
				return $http.post(globals.webApiBaseUrl + 'basics/customize/estallowanceconfigtype/list')
					.then(function (response) {
						data = response.data;
						basicsLookupdataLookupDescriptorService.updateData('allowanceassignmenttype', data);
						if (mdcContextId) {
							data = _.filter(data, {'MasterdataContextFk': mdcContextId});
						}
						angular.forEach(data, function (d) {
							d.Description = d.DescriptionInfo.Translated;
						});
						data = _.filter(data, function (item) {
							return (item.IsLive || item.Id === selectedItemId);
						});
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
				if(data && data.length > 0){
					return _.find(data, {'Id': id});
				}
				else{
					return loadData().then(function(){
						return _.find(data, {'Id': id});
					});
				}
			}

			return service;
		}]);
})();

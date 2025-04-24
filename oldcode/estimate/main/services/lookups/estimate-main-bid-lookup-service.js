/**
 */
(function () {
	/* global globals, _ */
	'use strict';

	angular.module('estimate.main').factory('estimateMainBidLookupService', [
		'$q', '$http', 'estimateMainService',
		function ($q, $http, estimateMainService
		) {

			let service = {
				getList: getList,
				getItemByKey: getItemByKey,
				getSearchList: getSearchList,
				getCacheDataList: getCacheDataList
			};

			let dataList = [];

			function getList(){

				let rs = null;
				let estHeaderId = parseInt(estimateMainService.getSelectedEstHeaderId());
				let projectId = estimateMainService.getSelectedProjectId() || -1;
				if(!isNaN(estHeaderId) && estHeaderId > -1) {
					let paras = 'estHeaderId=' + estHeaderId + '&projectId=' + projectId;
					rs = $http.get(globals.webApiBaseUrl + 'sales/bid/getlistbyestimate?' + paras).then(function (response) {
						if (response.data) {
							dataList = _.uniqBy(response.data.dto, 'Id');
							if (response.data.readOnlyStatusIds) {
								dataList = _.filter(response.data.dto, function (e) {
									return !response.data.readOnlyStatusIds.includes(e.BidStatusFk);
								});
							}
							return dataList;
						}
						return [];
					});
				}else {
					rs = $q.when([]);
				}

				return rs;

			}

			function getCacheDataList() {
				return dataList;
			}


			function getItemByKey (value) {
				let deferred = $q.defer();
				let list = getCacheDataList();
				for (let i = 0; i < list.length; i++) {
					if (list[i].Code === value) {
						deferred.resolve(list[i]);
						break;
					}
				}
				return deferred.promise;
			}

			function getSearchList() {
				// no use.
				// return $q.when([]);
				return getList();
			}


			return service;


		}
	]);
})();

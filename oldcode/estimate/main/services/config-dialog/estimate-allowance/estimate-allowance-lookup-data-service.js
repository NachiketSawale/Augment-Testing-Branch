/**
 */
(function () {
	/* global globals, _ */
	'use strict';

	angular.module('estimate.main').factory('estimateAllowanceLookupDataService', ['$q', '$http', '$injector',
		function ($q, $http,$injector) {

			let service = {
				getList: getList,
				setList:setList,
				getItemById: getItemById,
				getItemByIdAsync:getItemByIdAsync,
				getItemByKey:getItemByKey,
				getLookupData:getLookupData,
				getSearchList: getSearchList,
			};

			let lookupPrimse = null;

			let dataList = [];
			function getLookupData() {
				return getSearchList ();
			}

			function setList(items) {
				dataList = items;
			}

			function getList(){
				return  dataList;
			}

			function getItemByKey(value) {
				return getItemByIdAsync(value);
			}

			function getItemById (value) {
				return _.find(dataList, {Id: value});
			}

			function getItemByIdAsync(value) {
				let deferred = $q.defer();
				let item = _.find(dataList,{'Id':value});
				if(item){
					deferred.resolve(item);
					return deferred.promise;
				}

				if(!lookupPrimse){
					lookupPrimse = getSearchList();
				}

				lookupPrimse.then(function () {
					item = _.find(dataList,{'Id':value});
					lookupPrimse = null;
					deferred.resolve(item);
				});
				return deferred.promise;
			}

			function getSearchList() {
				let masterdataContextFk = $injector.get('estimateAllowanceAssignmentGridService').getMdcContextId();
				masterdataContextFk = masterdataContextFk? masterdataContextFk:-1;
				let url = globals.webApiBaseUrl + 'estimate/main/mdcAllowance/getMdcAllowancesByContextFk?masterContextFk=' +masterdataContextFk;

				return $http.get(url).then(function(result){
					dataList = result.data;
					return result.data;
				});
			}

			return service;
		}
	]);
})();

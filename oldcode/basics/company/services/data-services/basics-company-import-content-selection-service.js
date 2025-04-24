/**
 * Created by ysl on 12/8/2017.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyImportContentSelectionService
	 * @function
	 *
	 * @description
	 * basicsCompanyImportContentService is the data service for all import content settings celection result data.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCompanyImportContentSelectionService', ['_', '$q', '$http', 'globals',

		function (_, $q, $http, globals) {
			var service = {};
			var companyList = [];
			service.saveSelections = function (selections) {
				return $http.post(globals.webApiBaseUrl + 'basics/company/importcontent/savecontentselections', selections);
			};

			service.getSelections = function () {
				return $http.get(globals.webApiBaseUrl + 'basics/company/importcontent/contentselections');
			};
			service.clearSourceCompanyList = function () {
				companyList.length = 0;
			};
			service.getCompanyListAsync = function () {
				var deferred = $q.defer();
				if (companyList.length === 0) {
					$http.get(globals.webApiBaseUrl + 'basics/company/importcontent/getsourcecompanylist').then(function (response) {
						if (!_.isNil(response.data)) {
							if(!angular.isObject(response.data)){
								companyList = JSON.parse(response.data);
							}
							else{
								companyList = response.data;
							}
							if (_.isNil(companyList)) {
								companyList = [];
							}
						}
						deferred.resolve(companyList);
					});
				}
				else {
					deferred.resolve(companyList);
				}

				return deferred.promise;
			};

			//find node in the company tree
			function searchCompanyNode(list, key) {
				var item = _.find(list, key);
				if (_.isNil(null)) {
					for (var idx = 0; idx < list.length; idx++) {
						if (!_.isNil(list[idx].Children)) {
							item = searchCompanyNode(list[idx].Children, key);
						}
						if (!_.isNil(item)) {
							break;
						}
					}
				}

				return item;
			}

			service.getCompanyListAsyncByKey = function (key) {
				var deferred = $q.defer();
				if (companyList.length === 0) {
					$http.get(globals.webApiBaseUrl + 'basics/company/importcontent/getsourcecompanylist').then(function (response) {
						if (!_.isNil(response.data)) {
							companyList = JSON.parse(response.data);
							if (_.isNil(companyList)) {
								companyList = [];
							}
						}
						deferred.resolve(searchCompanyNode(companyList, {Code: key}));
					});
				}
				else {
					deferred.resolve(searchCompanyNode(companyList, {Code: key}));
				}

				return deferred.promise;
			};


			service.getLevel1 = function getLevel1(rowInfo, companyCode, internalImport) {
				var deferred = $q.defer();
				if (rowInfo.level1Url) {
					var url = globals.webApiBaseUrl + rowInfo.level1Url;
					url += '?companyCode=' + companyCode;
					if (rowInfo.code === 'basics.material') {
						if (internalImport === true) {
							url += '&onlyNeutralMaterial=false';
						}
					}
					return $http.get(url);
				} else if (rowInfo.level1Data) {
					deferred.resolve({data: rowInfo.level1Data});
				} else {
					deferred.resolve();
				}
				return deferred.promise;
			};

			service.getLevel2 = function getLevel2(rowInfo, level1Item, companyCode) {
				var deferred = $q.defer();
				if (rowInfo.level2Url) {
					var url = globals.webApiBaseUrl + rowInfo.level2Url;
					url += '?companyCode=' + companyCode;
					if (rowInfo.code === 'basics.material') {
						url += '&catalogId=' + level1Item.id;
					}
					return $http.get(url);
				} else {
					deferred.resolve();
				}
				return deferred.promise;
			};

			return service;
		}]);
})(angular);

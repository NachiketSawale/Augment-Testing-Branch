/**
 * Created by lst on 23/9/2019.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyCompanyForWorkflowLookupService
	 * @function
	 *
	 * @description
	 * basicsCompanyCompanyForWorkflowLookupService
	 */
	angular.module(moduleName).factory('basicsCompanyCompanyForWorkflowLookupService', ['_', '$q', '$http', 'globals',

		function (_, $q, $http, globals) {
			var service = {};
			var companyList = [];

			service.clearSourceCompanyList = function () {
				companyList.length = 0;
			};
			service.getCompanyListAsync = function () {
				var deferred = $q.defer();
				if (companyList.length === 0) {
					$http.get(globals.webApiBaseUrl + 'basics/company/tree?depth=10').then(function (response) {
						if (!_.isNil(response.data)) {
							companyList = response.data;
							if (!_.isArray(companyList)){
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
				if (_.isNil(item)) {
					for (var idx = 0; idx < list.length; idx++) {
						if (!_.isNil(list[idx].Companies)){
							item = searchCompanyNode(list[idx].Companies, key);
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
					service.getCompanyListAsync().then(function () {
						deferred.resolve(searchCompanyNode(companyList, {Code: key}));
					});
				}
				else {
					deferred.resolve(searchCompanyNode(companyList, {Code: key}));
				}
				return deferred.promise;
			};

			return service;
		}]);
})(angular);

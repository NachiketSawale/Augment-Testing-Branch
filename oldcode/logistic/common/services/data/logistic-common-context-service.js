/**
 * Created by nitsche on 17.05.2020.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var logisticCommonModule = angular.module('logistic.common');

	/**
	 * @ngdoc service
	 * @name logisticCommonContextService
	 * @function
	 *
	 * @description
	 * logisticCommonContextService contains context information like current company, current master data context, ...
	 */
	logisticCommonModule.factory('logisticCommonContextService', ['$http', 'platformContextService',
		function ($http, platformContextService) {

			// data
			var company;

			var service = {};

			service.init = function init() {
				// get company
				var companyId = platformContextService.getContext().clientId;
				return $http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId).then(function (response) {
					company = response.data;
					return company;
				});
			};

			service.getCompany = function getCompany() {
				return company;
			};

			service.getLogisticContextFk = function () {
				return company !== null ? company.LogisticContextFk : null;
			};

			return service;
		}]);
})(angular);

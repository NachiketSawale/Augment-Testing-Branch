/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesCommonContextService
	 * @function
	 *
	 * @description
	 * salesCommonContextService contains context information like current company ...
	 */
	salesCommonModule.factory('salesCommonContextService', ['_', '$injector', 'globals', '$q', '$http', 'platformContextService',
		function (_, $injector, globals, $q, $http, platformContextService) {

			// data
			var company;
			var companyRubricCategories; // only Sales

			var service = {};

			service.init = function init() {
				// get company
				var companyId = platformContextService.getContext().clientId;
				var promiseCompany = $http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId);

				var rubric = $injector.get('salesCommonRubric');
				var promiseRubricCategories = $http.get(globals.webApiBaseUrl + 'basics/company/category/list?mainItemId=' + companyId);

				return $q.all([promiseCompany, promiseRubricCategories]).then(function (promiseData) {
					company = _.get(promiseData[0], 'data') || [];
					companyRubricCategories = _.filter(_.get(promiseData[1], 'data'), function (category) {
						return _.includes([rubric.Bid, rubric.Contract, rubric.Wip, rubric.Billing], category.RubricFk);
					});
				});
			};

			service.getCompany = function getCompany() {
				return company;
			};

			service.isCompanyCurrency = function (currencyId) {
				var isSameCurrency = _.get(company, 'CurrencyFk') === currencyId;
				return isSameCurrency;
			};

			service.loadCompanyCategoryList = function loadCompanyCategories(rubricId) {
				return $q.when(_.filter(companyRubricCategories, { 'RubricFk': rubricId }));
			};

			service.getCompanyCategoryListByRubric = function getCompanyCategoryListByRubric(rubricId) {
				return _.filter(companyRubricCategories, { 'RubricFk': rubricId });
			};

			return service;
		}]);
})();

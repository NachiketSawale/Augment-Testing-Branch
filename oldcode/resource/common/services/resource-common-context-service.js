/**
 * Created by nitsche on 17.05.2020.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var logisticCommonModule = angular.module('resource.common');

	/**
	 * @ngdoc service
	 * @name resourceCommonContextService
	 * @function
	 *
	 * @description
	 * resourceCommonContextService contains context information like current company, current master data context, ...
	 */
	logisticCommonModule.factory('resourceCommonContextService', ['$http', 'platformContextService',
		function ($http, platformContextService) {

			// data
			let company = null;
			let divisions = null;

			let service = {};

			service.init = function init() {
				// get company
				var companyId = platformContextService.getContext().clientId;
				return $http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId).then(function (response) {
					company = response.data;
					return $http.post(globals.webApiBaseUrl + 'basics/customize/EquipmentDivision/list',{filter: ''}).then(function (response) {
						divisions = _.filter(response.data, d => d.PlantContextFk === company.EquipmentContextFk);
						return company;
					});
				});
			};

			service.getCompany = function getCompany() {
				return company;
			};

			service.getLogInEquipmentDivisons = function getLogInEquipmentDivisons() {
				return divisions;
			};


			service.getMasterDataContext = function getMasterDataContext() {
				return company !== null ? company.ContextFk : null;
			};

			service.getResourceContextFk = function getResourceContextFk() {
				return company !== null ? company.ResourceContextFk : null;
			};

			service.getEquipmentContextFk = function getEquipmentContextFk() {
				return company !== null ? company.EquipmentContextFk : null;
			};

			service.getEquipmentDivisonContextFk = function getEquipmentDivisonContextFk() {
				return company !== null ? company.EquipmentDivisionFk : null;
			};

			service.getEquipmentDivisonContextFk = function getEquipmentDivisonContextFk() {
				return company !== null ? company.EquipmentDivisionFk : null;
			};

			return service;
		}]);
})(angular);

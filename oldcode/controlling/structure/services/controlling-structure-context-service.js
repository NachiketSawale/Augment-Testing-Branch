/**
 * Created by janas on 05.03.2018.
 */

(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureContextService
	 * @function
	 *
	 * @description
	 * controllingStructureContextService contains context information like current company, current master data context, ...
	 */
	controllingStructureModule.factory('controllingStructureContextService', ['_', 'globals', '$http', 'platformContextService', 'cloudCommonGridService',
		function (_, globals, $http, platformContextService, cloudCommonGridService) {

			// data
			var company;
			var companyTree;
			var companyList = [];

			var service = {};

			service.init = function init() {
				// get company tree
				$http.get(globals.webApiBaseUrl + 'basics/company/getassignedcompanies').then(function (response) {
					companyTree = response.data;
					cloudCommonGridService.flatten(companyTree, companyList, 'children');
				});

				// get company
				var companyId = platformContextService.getContext().clientId;
				return $http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId).then(function (response) {
					company = response.data;
					return company;
				});
			};

			// TODO:
			//  - check also type of company?
			//  - make sure companyTree is initialized
			//  - change names
			service.getCompanyWithProfitcenters = function getCompanyWithProfitcenters(clientId) {
				var companiesAsList = [];
				if (!_.isObject(companyTree)) {
					return null;
				}
				cloudCommonGridService.flatten(companyTree, companiesAsList, 'children');
				var companyClientId = _.find(companiesAsList, {id: clientId});
				if (_.isObject(companyClientId)) {
					var myCompaniesAsList = [];
					cloudCommonGridService.flatten([companyClientId], myCompaniesAsList, 'children');
					return myCompaniesAsList;
				} else {
					return null;
				}
			};

			service.getSubCompanyIds = function getSubCompanyIds(clientId) {
				return _.map(_.filter(companyList, {parentId: clientId}), 'id');
			};

			service.getCompany = function getCompany() {
				return company;
			};

			service.getMdcContextFk = function () {
				return company !== null ? company.ContextFk : null;
			};

			service.initCollaborationContext = function(){
				$http.get(globals.webApiBaseUrl + 'controlling/structure/activatecollaborationcontext');
			}

			return service;
		}]);
})();

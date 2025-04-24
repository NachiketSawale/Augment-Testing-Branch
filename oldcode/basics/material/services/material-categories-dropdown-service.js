/**
 * Created by uestuenel on 30.07.2017.
 */
(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'basics.material';
	angular.module(moduleName).factory('materialCategoriesDropdownService', materialCategoriesDropdownService);

	materialCategoriesDropdownService.$inject = ['$http'];

	function materialCategoriesDropdownService($http) {
		let service = {};
		let procurementStructurePromise;
		let prcStructureTreePromise;
		let materialCatalogPromise;
		let materialCatalogTreePromise;

		// get ProcurementStructure items
		service.getCatItems = function() {
			if (procurementStructurePromise) {
				// there is already a running process for getting category
				return procurementStructurePromise;
			}

			return procurementStructurePromise = $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/procurementstructure/lookuplist'
			}).then(function(response) {
				return response.data;
			});
		};

		service.getStructureTree = function() {
			if (prcStructureTreePromise) {
				return prcStructureTreePromise;
			}

			return prcStructureTreePromise = $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/procurementstructure/structuretree'
			}).then(function(response) {
				return response.data;
			});
		};

		service.getMaterialGroupById = function(catId, grId) {
			grId = grId ? grId : null;
			return $http({
				method: 'GET',
				params: {catalogId: catId, groupId: grId},
				url: globals.webApiBaseUrl + 'basics/materialcatalog/catalog/grouplist'
			}).then(function(response) {
				return response.data;
			});
		};

		service.getPrcStructureItemsById = function(parentId) {
			return $http({
				method: 'GET',
				params: {parentId: parentId},
				url: globals.webApiBaseUrl + 'basics/procurementstructure/lookuplist'
			}).then(function(response) {
				return response.data;
			});
		};

		service.getMaterialStructures = function(isTicketSystem, isFilterCompany) {
			if (materialCatalogPromise) {
				// there is already a running process for getting category
				return materialCatalogPromise;
			}

			return materialCatalogPromise = $http.post(globals.webApiBaseUrl + 'basics/materialcatalog/catalog/cataloglist', {IsTicketSystem: isTicketSystem, IsFilterCompany: isFilterCompany}).then(function (response) {
				return response.data;
			});
		};

		service.getMaterialStructureTree = function(isTicketSystem, isFilterCompany) {
			if (materialCatalogTreePromise) {
				// there is already a running process for getting category
				return materialCatalogTreePromise;
			}

			return materialCatalogTreePromise = $http.post(globals.webApiBaseUrl + 'basics/materialcatalog/catalog/structure', {IsTicketSystem: isTicketSystem, IsFilterCompany: isFilterCompany}).then(function (response) {
				return response.data;
			});
		};

		return service;
	}
})(angular);

/**
 * Created by ltn on 12/8/2016.
 */
(function (angular) {

	'use strict';

	var moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainUpdateMaterialPricesService', ['$http', 'globals', function ($http, globals) {

		var service = {};

		/*
		 * @description
		 */
		var gridData = [];
		var priceCoditions = [];
		var priceListRetrievalOption = null;
		var priceVersionIds = null;

		var priceListRetrievalOptions = {
			'Latest': 0,
			'Earliest': 1,
			'Weighting': 2,
			'Average': 3,
			'Min': 4,
			'Max': 5
		};

		service.getGridData = function () {
			return gridData;
		};

		service.setGridData = function (data) {
			gridData = data;
		};

		service.getPriceConditions = function () {
			return priceCoditions;
		};

		service.clearPriceConditions = function () {
			priceCoditions = [];
		};

		service.addPriceConditions = function (data) {
			priceCoditions.push(data);
		};

		service.getPriceListRetrievalOptionValue = function (key) {
			return priceListRetrievalOptions[key];
		};

		/**
		 * @ngdoc
		 * @function
		 */
		service.updateFromCatalogs = function (materialDatas) {
			return $http.post(globals.webApiBaseUrl + 'project/material/updatePriceFromCatalogs', materialDatas);
		};

		/**
		 * @ngdoc
		 * @function
		 */
		service.processUpdate = function (prjMaterials) {
			return $http.post(globals.webApiBaseUrl + 'project/material/updatePriceFromPrcItem', prjMaterials);
		};

		/**
		 * @ngdoc
		 * @function
		 */
		service.getResultGridData = function (data) {
			return $http.post(globals.webApiBaseUrl + 'project/material/resultGridData', data);
		};

		/**
		 * @ngdoc
		 * @function
		 * @description
		 */
		service.getQuotesData = function (prjId) {
			return $http.get(globals.webApiBaseUrl + 'procurement/quote/header/getQuotesByProjectId?projectID=' + prjId);
		};

		service.getQuotesData1 = function (currentItem) {
			return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/getQuotesByProjectIdFK', currentItem);
		};

		service.getQuotesDataByPaging = function (currentItem) {
			return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/getQuotesByPaging', currentItem);
		};
		service.getContractsByPaging = function (currentItem) {
			return $http.post(globals.webApiBaseUrl + 'procurement/contract/header/getContractsByPaging', currentItem);
		};

		/**
		 * @ngdoc
		 */
		service.getContractsData = function (id) {
			return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/contractbyid?id=' + id);
		};

		/**
		 * @ngdoc
		 */
		service.getMaterialsByCatalog = function (data) {
			return $http.post(globals.webApiBaseUrl + 'project/material/materialsByCatalogs', data);
		};
		/**
		 * @ngdoc
		 */
		service.getCatalogsData = function (prjId) {
			return $http.get(globals.webApiBaseUrl + 'project/material/materialCatalogs?prjId=' + prjId);
		};

		service.getCatalogWithPriceVersionData = function (prjId) {
			return $http.get(globals.webApiBaseUrl + 'project/material/materialCatalogWithPriceVersion?prjId=' + prjId);
		};

		service.getMaterialsByVersions = function (data) {
			priceListRetrievalOption = data.Option;
			return $http.post(globals.webApiBaseUrl + 'project/material/getMaterialsByVersions', data).then(function (response) {
				if (!response.data) {
					return null;
				}
				priceVersionIds = response.data.PriceVersionIds;
				return response.data.Results;
			});
		};

		service.updateMaterialPriceFromPriceVersion = function (materialData) {
			var data = {
				NewMaterials: materialData,
				PriceListRetrievalOption: priceListRetrievalOption,
				PriceVersionIds: priceVersionIds
			};
			return $http.post(globals.webApiBaseUrl + 'project/material/updateMaterialPriceFromPriceVersion', data);
		};

		service.updateFromCatalog = updateFromCatalog;
		service.updateAllWithBasePrice = updateAllWithBasePrice;
		service.updatePricesWithSpecifiedPriceList = updatePricesWithSpecifiedPriceList;
		service.reset = reset;

		return service;

		///////////////////////////////////
		function updateFromCatalog(data) {
			return $http.post(globals.webApiBaseUrl + 'project/material/updatepricesfromcatalog', data);
		}

		function updateAllWithBasePrice(projectId, data) {
			return $http.post(globals.webApiBaseUrl + 'project/material/updateallwithbaseprices?projectId=' + projectId, data);
		}

		function updatePricesWithSpecifiedPriceList(data) {
			return $http.post(globals.webApiBaseUrl + 'project/material/updatepriceswithspecifiedpricelist', data);
		}

		function reset() {
			gridData = [];
			priceCoditions = [];
			priceListRetrievalOption = null;
			priceVersionIds = null;
		}
	}
	]);
})(angular);

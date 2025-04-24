/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(){
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesUpdateResourcePricesWizardService', estimateAssembliesUpdateResourcePricesWizardService);

	estimateAssembliesUpdateResourcePricesWizardService.$inject = ['_', '$http', '$q', 'globals', 'basicsLookupdataSimpleLookupService', 'basicsLookupdataLookupDataService'];

	function estimateAssembliesUpdateResourcePricesWizardService(_, $http, $q, globals, basicsLookupdataSimpleLookupService, basicsLookupdataLookupDataService) {
		let service = {};

		// data
		service.getMaterialCatalogTypeById = getMaterialCatalogTypeById;
		service.setSelectionData = setSelectionData;
		service.getSelectionData = getSelectionData;
		service.setUpdateResult = setUpdateResult;
		service.getUpdateResult = getUpdateResult;
		service.setAdditionalUpdateRequest = setAdditionalUpdateRequest;
		service.getPriceListRetrievalOptionIndex = getPriceListRetrievalOptionIndex;
		service.resetData = resetData;

		// http request
		service.getMaterialCatalogs = getMaterialCatalogs;
		service.getMaterialCatalogWithPriceVersion = getMaterialCatalogWithPriceVersion;
		service.getBaseMaterialResult = getBaseMaterialResult;
		service.getMaterialPriceListResult = getMaterialPriceListResult;
		service.updateResourcePriceFromBaseMaterial = updateResourcePriceFromBaseMaterial;
		service.updateResourcePriceFromPriceList = updateResourcePriceFromPriceList;

		let path = globals.webApiBaseUrl;
		let catalogTypes = [];

		let priceListRetrievalOptions = {
			'Latest': 0,
			'Earliest': 1,
			'Weighting': 2,
			'Average': 3,
			'Min': 4,
			'Max': 5
		};
		let fromBase = {
			isLoadSelectionData: false,
			selectionData: [],
			updateResult: []
		};

		let fromPriceList = {
			isLoadSelectionData: false,
			selectionData: [],
			updateResult: [],
			versionIds: [],
			priceListRetrievalOption: priceListRetrievalOptions.Latest
		};

		let type = {fromBase: '1', fromPriceList: '2'};

		loadMaterialCatalogTypeLookupData();
		return service;

		// //////////////////////////
		// data
		function getMaterialCatalogTypeById(id) {
			return _.find(catalogTypes, {Id: id});
		}

		function setSelectionData(dataSet, updateType) {
			updateType = updateType || type.fromBase;
			switch(updateType) {
				case type.fromBase:
					fromBase.selectionData = dataSet;
					break;
				case type.fromPriceList:
					fromPriceList.selectionData = dataSet;
					break;
				default:
					break;
			}
		}

		function getSelectionData(updateType) {
			updateType = updateType || type.fromBase;
			switch(updateType) {
				case type.fromBase:
					return fromBase.selectionData;
				case type.fromPriceList:
					return fromPriceList.selectionData;
				default:
					return null;
			}
		}

		function setUpdateResult(dataSet, updateType) {
			updateType = updateType || type.fromBase;
			switch(updateType) {
				case type.fromBase:
					fromBase.updateResult = dataSet;
					break;
				case type.fromPriceList:
					fromPriceList.updateResult = dataSet;
					break;
				default:
					break;
			}
		}

		function getUpdateResult(updateType) {
			updateType = updateType || type.fromBase;
			switch (updateType) {
				case type.fromBase:
					return fromBase.updateResult;
				case type.fromPriceList:
					return fromPriceList.updateResult;
				default:
					return null;
			}
		}

		function setAdditionalUpdateRequest(addition, updateType) {
			updateType = updateType || type.fromBase;
			switch(updateType) {
				case type.fromBase:
					angular.extend(fromBase, addition);
					break;
				case type.fromPriceList:
					angular.extend(fromPriceList, addition);
					break;
				default:
					break;
			}
		}

		function getPriceListRetrievalOptionIndex(key) {
			let option = basicsLookupdataLookupDataService.getItemByKey('PriceListRetrievalOption2', key);
			return priceListRetrievalOptions[option.value];
		}

		function resetData() {
			fromBase = {
				isLoadSelectionData: false,
				selectionData: [],
				updateResult: []
			};

			fromPriceList = {
				isLoadSelectionData: false,
				selectionData: [],
				updateResult: [],
				versionIds: [],
				priceListRetrievalOption: priceListRetrievalOptions.Latest
			};
		}

		// http request
		function getMaterialCatalogs(filterRequest) {
			let defer = $q.defer();
			if (fromBase.isLoadSelectionData) {
				defer.resolve({data: fromBase.selectionData, isCache: true});

			}
			else {
				return $http.post(path + 'estimate/main/wizard/getmaterialcatalogs4updateprice', filterRequest).then(function (response) {
					fromBase.isLoadSelectionData = true;
					return response;
				});
			}
			return defer.promise;
		}

		function getMaterialCatalogWithPriceVersion(filterRequest) {
			let defer = $q.defer();
			if (fromPriceList.isLoadSelectionData) {
				defer.resolve({data: fromPriceList.selectionData, isCache: true});
			}
			else {
				return $http.post(path + 'estimate/main/wizard/getmaterialcatalogswithversion', filterRequest).then(function(response){
					fromPriceList.isLoadSelectionData = true;
					return response;
				});
			}
			return defer.promise;
		}

		function getBaseMaterialResult(request) { // request: {filterRequest, catalogIds}
			return $http.post(path + 'estimate/main/wizard/getmaterialpricesresult4update', request);
		}

		function getMaterialPriceListResult(request) { // request: {filterRequest, versionIds, priceListRetrievalOption}
			return $http.post(path + 'estimate/main/wizard/getmaterialresultbyversions', request);
		}

		function updateResourcePriceFromBaseMaterial(request) { // request: {filterRequest, newEntities}
			return $http.post(path + 'estimate/main/wizard/updatematerialtyperesourcespricefromlocal', request);
		}

		function updateResourcePriceFromPriceList(request) { // request: {filterRequest, versionIds, priceListRetrievalOption,  newEntities}
			request.VersionIds = fromPriceList.versionIds;
			request.priceListRetrievalOption = fromPriceList.priceListRetrievalOption;
			return $http.post(path + 'estimate/main/wizard/updatematerialpricefrompriceversion', request);
		}

		// private function
		function loadMaterialCatalogTypeLookupData() {
			let lookupOptions = {
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.materialcatalog.type'
			};
			basicsLookupdataSimpleLookupService.getList(lookupOptions).then(function(data){
				catalogTypes = data || catalogTypes;
			});
		}
	}
})();

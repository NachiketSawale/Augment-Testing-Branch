(function () {

	/* global globals, _ */
	'use strict';
	/**
     * @ngdoc service
     * @name estimet.main..service:estimateWizardStructureTypeLookupService
     * @function
     *
     * @description
     * estimateWizardStructureTypeLookupService is the data service for estimate structure type functions.
     */
	angular.module('estimate.main').factory('estimateWizardStructureTypeLookupService', ['$http','$translate', '$injector', function ($http,$translate,$injector) {

		let service = {}, structureTypeList = [];

		let prjId = 0;

		service.setProjectId = function(projectId){
			prjId = projectId;
		};

		service.getSelectMainId = function(id){
			let selected = _.find(structureTypeList, function (item) {
				return item.Id === id;
			});

			return selected ? selected.mainId : 0;
		};

		service.loadData = function loadData() {
			prjId = prjId || $injector.get('estimateMainService').getProjectId();
			return $http.post(globals.webApiBaseUrl + 'estimate/main/lookup/getcreatebidstructuretypes', {ProjectFk:prjId}).then(function (result) {
				structureTypeList = [
					{Id: 1, mainId: 0, Description: $translate.instant('estimate.main.boqHeaderFk')},
					{Id: 4, mainId: 0, Description: $translate.instant('estimate.main.mdcControllingUnitFk')},
					{Id: 3, mainId: 0, Description: $translate.instant('estimate.main.prjLocationFk')},
					{Id: 2, mainId: 0, Description: $translate.instant('estimate.main.psdActivityFk')},
					{Id: 16, mainId: 0, Description: $translate.instant('estimate.main.lineItemGroupingContainer')}
				];
				if(result && result.data){
					_.forEach(result.data, function (item) {
						structureTypeList.push({Id: item.Id, Description: item.Desc, mainId: item.RootItemId});
					});
				}
			});
		};

		service.getList = function getList() {
			return structureTypeList;
		};

		return service;
	}]);

	angular.module('estimate.main').factory('estimateWizardStructureTypeSimpleLookupService', ['$http','$translate', '$injector', '$q', function ($http,$translate,$injector, $q) {

		let service = {}, structureTypeList = [];

		service.loadData = function loadData() {
			structureTypeList = [
				{Id: 1, mainId: 0, Description: $translate.instant('estimate.main.boqHeaderFk')},
				{Id: 4, mainId: 0, Description: $translate.instant('estimate.main.mdcControllingUnitFk')},
				{Id: 3, mainId: 0, Description: $translate.instant('estimate.main.prjLocationFk')},
				{Id: 2, mainId: 0, Description: $translate.instant('estimate.main.psdActivityFk')},
				// {Id: 16, mainId: 0, Description: $translate.instant('estimate.main.lineItemGroupingContainer')}
			];

			return $q.when(structureTypeList);
		};

		service.getList = function getList() {
			return structureTypeList;
		};

		return service;
	}]);

	angular.module('estimate.main').factory('estimateWizardBoqItemQuantityFromTypeLookupService', ['$translate', '$injector', '$q', function ($translate,$injector, $q) {

		let service = {}, boqItemQuantityFromType = [];

		service.loadData = function loadData() {
			boqItemQuantityFromType = [
				{Id: 1, mainId: 0, Description: $translate.instant('sales.bid.wizard.LineItemQtyRelWithCompatibleUoM')},
				{Id: 2, mainId: 0, Description: $translate.instant('sales.bid.wizard.LeadingStructure')},
				{Id: 3, mainId: 0, Description: $translate.instant('sales.bid.wizard.LineItemAqWqWithCompatibleUoM')},
				{Id: 4, mainId: 0, Description: $translate.instant('sales.bid.wizard.LineItemQuantityTotalWithCompatibleUoM')}
			];

			return $q.when(boqItemQuantityFromType);
		};

		service.getList = function getList() {
			return boqItemQuantityFromType;
		};

		return service;
	}]);
})(angular);

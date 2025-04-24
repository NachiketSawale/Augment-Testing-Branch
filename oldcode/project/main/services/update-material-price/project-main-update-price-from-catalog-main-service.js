/**
 * Created by chi on 1/7/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogMainService', projectMainUpdatePriceFromCatalogMainService);

	projectMainUpdatePriceFromCatalogMainService.$inject = [
		'PlatformMessenger'
	];

	function projectMainUpdatePriceFromCatalogMainService(
		PlatformMessenger
	) {
		var service = {};
		var projectId = -1; // current project id
		var materialId = -1; // the id of material for selected project material
		var prjMaterialId = -1; // selected project material id
		var markersChanged = new PlatformMessenger();
		var priceListSelectionChanged = new PlatformMessenger();
		var priceListLoaded = new PlatformMessenger();
		var projectMaterialSelectionChanged = new PlatformMessenger();
		var priceListWithSpecVersionUpdated = new PlatformMessenger();
		var specificPriceVersionSelected = new PlatformMessenger();

		Object.defineProperties(service, {
			'projectId': {
				get: function () {
					return projectId;
				},
				set: function (value) {
					projectId = value;
				},
				enumerable: true
			},
			'materialId': {
				get: function () {
					return materialId;
				},
				set: function (value) {
					materialId = value;
				},
				enumerable: true
			},
			'prjMaterialId': {
				get: function () {
					return prjMaterialId;
				},
				set: function (value) {
					prjMaterialId = value;
				},
				enumerable: true
			}
		});

		service.markersChanged = markersChanged;
		service.priceListSelectionChanged = priceListSelectionChanged;
		service.reset = reset;
		service.priceListLoaded = priceListLoaded;
		service.projectMaterialSelectionChanged = projectMaterialSelectionChanged;
		service.priceListWithSpecVersionUpdated = priceListWithSpecVersionUpdated;
		service.specificPriceVersionSelected = specificPriceVersionSelected;
		service.cacheData = [];

		return service;

		///////////////////////////
		function reset() {
			projectId = -1;
			materialId = -1;
			prjMaterialId = -1;
		}
	}
})(angular);

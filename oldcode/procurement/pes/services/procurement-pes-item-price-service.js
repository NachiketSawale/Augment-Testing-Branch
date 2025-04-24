(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';
	angular.module(moduleName).factory('procurementPesItemPriceService', [
		'procurementPesItemService',
		'basicsLookupdataLookupDescriptorService',
		function (
			dataService,
			lookupDescriptorService
		) {
			var options = {};
			var service = {
				init: function () {

				},
				getSelectedParentItem: function () {

				},
				getSelectedPrcItem: function () {

				},
				getPrcItemId: function () {

				},
				getMaterialId: function () {

				},
				getMaterial: function() {

				},
				parentService: null
			};

			service.parentService = dataService;

			service.getSelectedParentItem = function () {
				return service.parentService.getSelected();
			};

			service.getSelectedPrcItem = function () {
				return service.parentService.getSelected();
			};

			service.getPrcItemId = function () {
				return null;
			};

			service.getMaterial = function() {
				return lookupDescriptorService.getData('MaterialCommodity');
			};

			service.getMaterialId = function (selectedPrcItem) {
				return selectedPrcItem.MdcMaterialFk;
			};

			service.getHeaderParentItem = function() {
				var headerParentService = service.parentService;
				return headerParentService.parentService() ? headerParentService.parentService().getSelected() : null;
			};

			service.init = function (options) {
				options = angular.extend({
					onRowDeselected: function () {

					}
				}, options);
				service.parentService.registerSelectionChanged(options.onItemSelected);
			};

			service.unregister = function () {
				service.parentService.unregisterSelectionChanged(options.onItemSelected);
			};

			return service;
		}]);


})(angular);
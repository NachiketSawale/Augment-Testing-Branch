(function (angular) {

	'use strict';
	const moduleName = 'basics.common';
	// commonHistoricalPriceForItemConfigController
	angular.module(moduleName).factory('commonHistoricalPriceForItemService', [
		'platformGridAPI',
		'basicsLookupdataLookupDescriptorService',
		function (
			platformGridAPI,
			lookupDescriptorService) {

			function constructor(parentService) {
				const options = {};
				const service = {
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
					getMaterial: function () {

					},
					parentService: null
				};

				service.parentService = parentService;

				service.getSelectedParentItem = function () {
					return service.parentService.getSelected();
				};

				service.getSelectedPrcItem = function () {
					return service.parentService.getSelected();
				};

				service.getPrcItemId = function (selectedPrcItem) {
					return selectedPrcItem.Id;
				};

				service.getMaterial = function () {
					return lookupDescriptorService.getData('MaterialCommodity');
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

				service.getHeaderParentItem = function () {
					const headerParentService = service.parentService;
					return headerParentService.parentService() ? headerParentService.parentService().getSelected() : null;
				};

				return service;
			}

			return {
				getService: constructor
			};

		}]);

})(angular);

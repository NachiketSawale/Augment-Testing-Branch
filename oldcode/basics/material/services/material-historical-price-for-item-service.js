
(function (angular) {

	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('materialHistoricalPriceForItemService', [
		'basicsMaterialRecordService',
		'basicsLookupdataLookupDescriptorService',
		function (
			dataService,
			lookupDescriptorService){
			var options = {};
			var service = {
				init: function () {

				},
				getSelectedParentItem: function () {

				},
				getSelectedPrcItem: function () {

				},
				getBoqItemId: function () {

				},
				getMaterialId: function () {

				},
				getMaterial: function() {

				},
				getHeaderParentItem: function() {

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

			service.getMaterialId = function (selectedItem) {
				return selectedItem.Id;
			};

			service.getMaterial = function() {
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

			return service;
		}]);

})(angular);

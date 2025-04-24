(function (angular) {

	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).factory('commonHistoricalPriceForBoqService', [
		'boqMainLineTypes',
		function (
			boqMainLineTypes) {

			function constructor(parentService) {
				const options = {};
				const service = {
					init: function () {

					},
					getSelectedBoqItem: function () {

					},
					getBoqItemId: function () {

					},
					parentService: null
				};

				service.parentService = parentService; // prcBoqMainService.getService(moduleContext.getMainService());

				service.init = function (options) {
					options = angular.extend({
						onRowDeselected: function () {

						},
						onItemSelected: function () {

						}
					}, options);
					service.parentService.registerSelectionChanged(options.onItemSelected);
				};
				service.getSelectedBoqItem = function () {
					const selectedParentItem = service.parentService.getSelected();
					return selectedParentItem && selectedParentItem.BoqLineTypeFk === boqMainLineTypes.position ? selectedParentItem : null;
				};

				service.getBoqItemId = function (selectedBoqItem) {
					return selectedBoqItem.Id;
				};

				service.unregister = function () {
					service.parentService.unregisterSelectionChanged(options.onItemSelected);
				};

				return service;
			}

			return {
				getService: constructor
			};

		}]);

})(angular);

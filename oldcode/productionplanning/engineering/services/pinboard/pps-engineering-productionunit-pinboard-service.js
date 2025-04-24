(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('productionplanningEngineeringPUPinBoardService', PUPinBoardService);
	PUPinBoardService.$inject = ['productionplanningEngineeringMainService'];
	function PUPinBoardService(engineeringMainService) {
		var service = {};

		service.getSelected = function () {
			var selectedItem = engineeringMainService.getSelected();
			if (_.isNil(selectedItem)) {
				return selectedItem;
			} else {
				return {
					Id: selectedItem.PPSItemFk,
					Version: 1
				};
			}
		};

		service.registerChildService = function (service) {
			engineeringMainService.registerChildService(service);
		};

		service.registerSelectionChanged = function (fn) {
			engineeringMainService.registerSelectionChanged(fn);
		};

		service.registerListLoaded = function (fn) {
			engineeringMainService.registerListLoaded(fn);
		};
		
		return service;
	}
})();
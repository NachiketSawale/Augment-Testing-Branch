(function () {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItemDetailerPlanningBoardSupplierMappingService', MappingService);

	MappingService.$inject = [];

	function MappingService() {
		this.id = function (clerk) {
			return clerk.Id;
		};

		this.validateWith = function () {
			return [];
		};
	}
})();

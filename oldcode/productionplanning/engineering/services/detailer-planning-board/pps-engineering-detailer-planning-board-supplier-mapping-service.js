(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).service('ppsEngDetailerPlanningBoardSupplierMappingService', MappingService);

	MappingService.$inject = [];

	function MappingService() {
		this.id = function (clerk) {
			return clerk.Id;
		};

		this.validateWith = function validateWith(supplier) {
			return supplier ? supplier.ProvidedSkillList : [];
		};
	}
})();

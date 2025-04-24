(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('productionplanningEngineeringPUPinBoardConfigService', PUPinBoardConfigService);
	PUPinBoardConfigService.$inject = [];
	function PUPinBoardConfigService() {
		var service = {};

		service.getConfig = function () {
			var config = {
				dateProp: 'Comment.InsertedAt',
				saveEntityName: 'ProductionUnitComment'
			};
			return config;
		};

		return service;
	}
})();
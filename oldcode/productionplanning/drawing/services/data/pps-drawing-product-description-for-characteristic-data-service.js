(function(angular) {
	'use strict';

	const moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('ppsDrawingProductTemplate4CharacteristicDataService', dataService);

	dataService.$inject = ['$injector'];

	function dataService($injector) {
		let para = {
			'serviceName': 'productionplanningDrawingProductDescriptionDataService'
		};

		return $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(para);
	}
})(angular);
(function () {
	'use strict';

	angular.module('controlling.common').factory('controllingCommonPesTotalListControllerFactory',
		['_', '$translate', 'platformGridControllerService','$injector','controllingStructurePesTotalUIStandardService',
			function (_, $translate, platformGridControllerService,$injector,configurationService) {

				let service = {};
				service.initPesListController = function initPesListController($scope, dataService){
					let myGridConfig = {
						initCalled: false, columns: []
					};

					platformGridControllerService.initListController($scope, configurationService,dataService, null, myGridConfig);
				};

				return service;
			}]);
})();

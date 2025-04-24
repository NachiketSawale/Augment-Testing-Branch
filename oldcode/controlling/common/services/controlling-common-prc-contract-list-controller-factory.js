(function () {
	'use strict';

	angular.module('controlling.common').factory('controllingCommonPrcContractListControllerFactory',
		['_', '$translate', 'platformGridControllerService','$injector','controllingStructureContractTotalUIStandardService',
			function (_, $translate, platformGridControllerService,$injector,configurationService) {

				let service = {};
				service.initPrcContractController = function initPrcContractController($scope, dataService){
					let myGridConfig = {
						initCalled: false, columns: []
					};

					platformGridControllerService.initListController($scope, configurationService,dataService, null, myGridConfig);
				};

				return service;
			}]);
})();

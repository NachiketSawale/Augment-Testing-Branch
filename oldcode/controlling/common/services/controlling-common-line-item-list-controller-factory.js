(function () {
	'use strict';

	angular.module('controlling.common').factory('controllingCommonLineItemListControllerFactory',
		['_', '$translate', 'platformGridControllerService',
			function (_, $translate, platformGridControllerService) {

				let service = {};
				service.initLineItemListController = function initLineItemListController($scope, dataService,configurationService){
					let myGridConfig = {
						initCalled: false, columns: []
					};
					
					platformGridControllerService.initListController($scope, configurationService,dataService, null, myGridConfig);
					
				};

				return service;
			}]);
})();

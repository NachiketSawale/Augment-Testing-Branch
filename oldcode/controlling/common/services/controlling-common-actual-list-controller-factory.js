(function () {
	'use strict';

	angular.module('controlling.common').factory('controllingCommonActualListControllerFactory',
		['_', '$translate', 'platformGridControllerService',
			function (_, $translate, platformGridControllerService) {

				let service = {};
				service.initActualListController = function initActualListController($scope, dataService,configurationService){
					let myGridConfig = {
						initCalled: false, columns: []
					};

					platformGridControllerService.initListController($scope, configurationService,dataService, null, myGridConfig);
				};

				return service;
			}]);
})();

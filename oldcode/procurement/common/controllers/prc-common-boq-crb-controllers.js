(function() {
	'use strict';

	var procModule = angular.module('procurement.common');

	procModule.controller('prcCommonCrbBoqItemScopeController', ['$scope', 'prcBoqMainService', 'procurementContextService', 'boqMainCrbBoqItemScopeService',
		function ($scope, prcBoqMainService, procurementContextService, boqMainCrbBoqItemScopeService) {
			boqMainCrbBoqItemScopeService.initController($scope, prcBoqMainService.getService(procurementContextService.getMainService()));
		}
	]);

	procModule.controller('prcCommonCrbPriceconditionController', ['$scope', 'prcBoqMainService', 'procurementContextService', 'boqMainCrbPriceconditionService',
		function ($scope, prcBoqMainService, procurementContextService, boqMainCrbPriceconditionService) {
			boqMainCrbPriceconditionService.initController($scope, prcBoqMainService.getService(procurementContextService.getMainService()));
		}
	]);

	procModule.controller('prcCommonCrbVariableController', ['$scope', 'prcBoqMainService', 'procurementContextService', 'boqMainCrbVariableService',
		function ($scope, prcBoqMainService, procurementContextService, boqMainCrbVariableService) {
			boqMainCrbVariableService.initController($scope, prcBoqMainService.getService(procurementContextService.getMainService()));
		}
	]);
})();

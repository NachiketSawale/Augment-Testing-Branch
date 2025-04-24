(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(moduleName).controller('procurementPesQtoListController',
		['$scope', '$injector', 'platformControllerExtendService', 'platformGridControllerService', 'procurementPesQtoDetailService',
			'procurementPesQtoDetailUIStandardService', 'procurementPesQtoDetailValidationService', 'platformGridAPI', '$timeout', 'qtoMainLineType', '$translate',
			'qtoMainClipboardService', 'prcBoqMainService', 'qtoMainDetailGridControllerService', 'procurementContextService', 'qtoBoqType',
			function ($scope, $injector, platformControllerExtendService, gridControllerService, dataService, gridColumns, validationService, platformGridAPI, $timeout,
				qtoMainLineType, $translate, qtoMainClipboardService, prcBoqMainService, qtoMainDetailGridControllerService, moduleContext, qtoBoqType) {

				var parentService = prcBoqMainService.getService(moduleContext.getMainService());
				qtoMainDetailGridControllerService.initQtoDetailController($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService, parentService, qtoBoqType.PesBoq);
			}
		]);
})(angular);
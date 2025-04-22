/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';

	angular.module(moduleName).controller('salesWipQtoListController',
		['$scope', '$injector', 'platformControllerExtendService', 'platformGridControllerService', 'salesWipQtoDetailService', 'salesWipQtoListUIStandardService', 'salesWipQtoDetailValidationService', 'platformGridAPI', '$timeout', 'qtoMainLineType', '$translate', 'qtoMainClipboardService', 'qtoMainDetailGridControllerService', 'salesWipBoqStructureService', 'qtoBoqType',
			function ($scope, $injector, platformControllerExtendService, gridControllerService, dataService, gridColumns, validationService, platformGridAPI, $timeout, qtoMainLineType, $translate, qtoMainClipboardService, qtoMainDetailGridControllerService, salesWipBoqStructureService, qtoBoqType) {

				qtoMainDetailGridControllerService.initQtoDetailController($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService, salesWipBoqStructureService, qtoBoqType.WipBoq);
			}
		]);
})(angular);

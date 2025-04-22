/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.billing';

	angular.module(moduleName).controller('salesBillingQtoListController',
		['$scope', '$injector', 'platformControllerExtendService', 'platformGridControllerService', 'salesBillingQtoDetailService', 'salesBillingQtoListUIStandardService', 'salesBillingQtoDetailValidationService', 'platformGridAPI', '$timeout', 'qtoMainLineType', '$translate', 'qtoMainClipboardService', 'qtoMainDetailGridControllerService', 'salesBillingBoqStructureService', 'qtoBoqType',
			function ($scope, $injector, platformControllerExtendService, gridControllerService, dataService, gridColumns, validationService, platformGridAPI, $timeout, qtoMainLineType, $translate, qtoMainClipboardService, qtoMainDetailGridControllerService, salesBillingBoqStructureService, qtoBoqType) {

				qtoMainDetailGridControllerService.initQtoDetailController($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService, salesBillingBoqStructureService, qtoBoqType.BillingBoq);
			}
		]);
})(angular);

(function (angular) {
	'use strict';

	let moduleName='qto.main';

	angular.module(moduleName).controller('qtoMainLineLookupController',
		['$scope', '$injector', 'platformControllerExtendService', 'platformGridControllerService', 'qtoMainLineLookupService',
			'qtoMainSourceDetailUIService', 'qtoMainDetailGridValidationService', 'platformGridAPI', '$timeout', 'qtoMainLineType', '$translate',
			'qtoMainClipboardService','qtoMainHeaderDataService', 'qtoMainDetailGridControllerService','qtoBoqType',
			function ($scope, $injector, platformControllerExtendService, gridControllerService, dataService, gridColumns, validationService, platformGridAPI, $timeout,
				qtoMainLineType, $translate,qtoMainClipboardService,parentService, qtoMainDetailGridControllerService,qtoBoqType) {

				qtoMainDetailGridControllerService.initQtoDetailController($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService,
					parentService, qtoBoqType.QtoBoq, true);
			}
		]);
})(angular);
/**
 * Created by lnt on 21.05.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	angular.module(moduleName).controller('procurementPackageQtoDetailController',
		['$scope', '$injector', 'platformControllerExtendService', 'platformGridControllerService', 'procurementPackageQtoDetailService',
			'procurementPackageQtlDetailUIStandardService', 'procurementPackageQtoDetailValidationService', 'platformGridAPI', '$timeout', 'qtoMainLineType', '$translate',
			'qtoMainClipboardService', 'prcBoqMainService', 'qtoMainDetailGridControllerService', 'procurementContextService', 'qtoBoqType',
			function ($scope, $injector, platformControllerExtendService, gridControllerService, dataService, gridColumns, validationService, platformGridAPI, $timeout,
				qtoMainLineType, $translate, qtoMainClipboardService, prcBoqMainService, qtoMainDetailGridControllerService, moduleContext, qtoBoqType) {

				var parentService = prcBoqMainService.getService(moduleContext.getMainService());
				qtoMainDetailGridControllerService.initQtoDetailController($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService, parentService, qtoBoqType.PrcBoq);
			}
		]);
})(angular);
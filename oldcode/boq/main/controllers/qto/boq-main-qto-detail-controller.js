/**
 * Created by lnt on 21.05.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainQtoDetailController',
		['$scope', '$injector', 'boqMainQtoDetailService',
			'boqMainQtlDetailUIStandardService', 'boqMainQtoDetailValidationService', 'qtoMainLineType',
			'qtoMainClipboardService', 'boqMainService', 'qtoMainDetailGridControllerService', 'qtoBoqType',
			function ($scope, $injector, dataService, gridColumns, validationService,
				qtoMainLineType, qtoMainClipboardService, parentService, qtoMainDetailGridControllerService, qtoBoqType) {

				qtoMainDetailGridControllerService.initQtoDetailController($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService, parentService, qtoBoqType.PrjBoq);
			}
		]);
})(angular);
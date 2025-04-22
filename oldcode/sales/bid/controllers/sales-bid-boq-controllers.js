/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';
	const bidModule = angular.module(moduleName);

	bidModule.controller('salesBidBoqDocumentController',
		['$scope', 'salesBidBoqStructureService', 'boqMainDocumentService',
			function ($scope, salesBidBoqStructureService, boqMainDocumentService) {
				boqMainDocumentService.initController($scope, salesBidBoqStructureService);
			}
		]);

	bidModule.controller('salesBidBoqHtmlTextComplementController',
		['$scope', 'salesBidBoqStructureService', 'boqMainTextComplementControllerFactory',
			function ($scope, boqService, controllerServiceFactory) {
				var useHtmlText = true;
				var textComplementServiceKey = moduleName;
				controllerServiceFactory.initController($scope, boqService, textComplementServiceKey, useHtmlText);
			}
		]);

	bidModule.controller('salesBidBoqSpecificationController',
		['boqMainSpecificationControllerService', '$scope', '$sce', 'salesBidBoqStructureService',
			function (boqMainSpecificationControllerService, $scope, $sce, boqService) {
				$scope.trustAsHtml = $sce.trustAsHtml;
				var textComplementServiceKey = moduleName;

				boqMainSpecificationControllerService.initSpecificationController($scope, boqService, textComplementServiceKey);
			}
		]);
})(angular);

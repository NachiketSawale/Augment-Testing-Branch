/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'sales.contract';
	const contractModule = angular.module(moduleName);

	contractModule.controller('salesContractBoqDocumentController',
		['$scope', 'salesContractBoqStructureService', 'boqMainDocumentService',
			function ($scope, salesContractBoqStructureService, boqMainDocumentService) {
				boqMainDocumentService.initController($scope, salesContractBoqStructureService);
			}
		]);

	contractModule.controller('salesContractBoqHtmlTextComplementController',
		['$scope', 'salesContractBoqStructureService', 'boqMainTextComplementControllerFactory',
			function ($scope, boqService, controllerServiceFactory) {
				var useHtmlText = true;
				var textComplementServiceKey = moduleName;
				controllerServiceFactory.initController($scope, boqService, textComplementServiceKey, useHtmlText);
			}
		]);

	// TODO: duplicate controller 'salesContractBoqSpecificationController'
	contractModule.controller('salesContractBoqSpecificationController',
		['boqMainSpecificationControllerService', '$scope', '$sce', 'salesContractBoqStructureService',
			function boqMainSpecificationControllerFunction(boqMainSpecificationControllerService, $scope, $sce, salesContractBoqStructureService) {
				$scope.trustAsHtml = $sce.trustAsHtml;

				boqMainSpecificationControllerService.initSpecificationController($scope, salesContractBoqStructureService);
			}
		]);

	contractModule.controller('salesContractBoqSpecificationController',
		['boqMainSpecificationControllerService', '$scope', '$sce', 'salesContractBoqStructureService',
			function boqMainSpecificationControllerFunction(boqMainSpecificationControllerService, $scope, $sce, boqService) {
				$scope.trustAsHtml = $sce.trustAsHtml;
				var textComplementServiceKey = moduleName;

				boqMainSpecificationControllerService.initSpecificationController($scope, boqService, textComplementServiceKey);
			}
		]);

})(angular);

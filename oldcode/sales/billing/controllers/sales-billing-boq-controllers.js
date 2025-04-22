(function () {
	'use strict';

	const moduleName = 'sales.billing';
	const billingModule = angular.module(moduleName);

	billingModule.controller('salesBillingBoqDocumentController', ['$scope', 'salesBillingBoqStructureService', 'boqMainDocumentService',
		function ($scope, salesBillingBoqStructureService, boqMainDocumentService) {
			boqMainDocumentService.initController($scope, salesBillingBoqStructureService);
		}
	]);

	billingModule.controller('salesBillingBoqLinkedDispatchNoteController', ['$scope', '$rootScope', 'boqMainLinkedDispatchNoteService',
		function ($scope, $rootScope, boqMainLinkedDispatchNoteService) {
			boqMainLinkedDispatchNoteService.initController($scope, $rootScope, moduleName);
		}
	]);

	billingModule.controller('salesBillingBoqHtmlTextComplementController',
		['$scope', 'salesBillingBoqStructureService', 'boqMainTextComplementControllerFactory',
			function ($scope, boqService, controllerServiceFactory) {
				var useHtmlText = true;
				var textComplementServiceKey = moduleName;
				controllerServiceFactory.initController($scope, boqService, textComplementServiceKey, useHtmlText);
			}
		]);

	// TODO: duplicate controller 'salesBillingBoqSpecificationController'
	billingModule.controller('salesBillingBoqSpecificationController',
		['boqMainSpecificationControllerService', '$scope', '$sce', 'salesBillingBoqStructureService',
			function boqMainSpecificationControllerFunction(boqMainSpecificationControllerService, $scope, $sce, salesBillingBoqStructureService) {
				$scope.trustAsHtml = $sce.trustAsHtml;

				boqMainSpecificationControllerService.initSpecificationController($scope, salesBillingBoqStructureService);
			}
		]);

	billingModule.controller('salesBillingBoqSpecificationController',
		['boqMainSpecificationControllerService', '$scope', '$sce', 'salesBillingBoqStructureService',
			function boqMainSpecificationControllerFunction(boqMainSpecificationControllerService, $scope, $sce, boqService) {
				$scope.trustAsHtml = $sce.trustAsHtml;
				var textComplementServiceKey = moduleName;

				boqMainSpecificationControllerService.initSpecificationController($scope, boqService, textComplementServiceKey);
			}
		]);
})();

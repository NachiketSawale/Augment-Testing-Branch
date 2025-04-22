(function () {
	'use strict';
	const moduleName = 'sales.wip';
	const wipModule = angular.module(moduleName);

	wipModule.controller('salesWipBoqDocumentController', ['$scope', 'salesWipBoqStructureService', 'boqMainDocumentService',
		function ($scope, salesWipBoqStructureService, boqMainDocumentService) {
			boqMainDocumentService.initController($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipBoqLinkedDispatchNoteController', ['$scope', '$rootScope', 'boqMainLinkedDispatchNoteService',
		function ($scope, $rootScope, boqMainLinkedDispatchNoteService) {
			boqMainLinkedDispatchNoteService.initController($scope, $rootScope, moduleName);
		}
	]);

	// TODO: duplicate controller 'salesWipBoqSpecificationController'
	wipModule.controller('salesWipBoqSpecificationController',
		['boqMainSpecificationControllerService', '$scope', '$sce', 'salesWipBoqStructureService',
			function boqMainSpecificationControllerFunction(boqMainSpecificationControllerService, $scope, $sce, salesWipBoqStructureService) {
				$scope.trustAsHtml = $sce.trustAsHtml;

				boqMainSpecificationControllerService.initSpecificationController($scope, salesWipBoqStructureService);
			}
		]);

	wipModule.controller('salesWipBoqSpecificationController',
		['boqMainSpecificationControllerService', '$scope', '$sce', 'salesWipBoqStructureService',
			function (boqMainSpecificationControllerService, $scope, $sce, boqService) {
				$scope.trustAsHtml = $sce.trustAsHtml;
				var textComplementServiceKey = moduleName;

				boqMainSpecificationControllerService.initSpecificationController($scope, boqService, textComplementServiceKey);
			}
		]);

	wipModule.controller('salesWipBoqHtmlTextComplementController',
		['$scope', 'salesWipBoqStructureService', 'boqMainTextComplementControllerFactory',
			function ($scope, boqService, controllerServiceFactory) {
				var useHtmlText = true;
				var textComplementServiceKey = moduleName;
				controllerServiceFactory.initController($scope, boqService, textComplementServiceKey, useHtmlText);
			}
		]);

})();

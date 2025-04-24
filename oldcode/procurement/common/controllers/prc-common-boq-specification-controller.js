// / <reference path="../_references.js" />

(function () {

	'use strict';
	/**
	 * @ngdoc controller
	 * @name prcBoqMainNodeController
	 * @function
	 *
	 * @description
	 * Controller for the Specification view.
	 * Includes the textAngular rtf editor.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('prcBoqMainSpecificationController', ['boqMainSpecificationControllerService',
		'$scope',
		'$sce',
		'procurementContextService',
		'prcBoqMainService',
		function boqMainSpecificationControllerFunction(boqMainSpecificationControllerService,
			$scope,
			$sce,
			moduleContext,
			prcBoqMainService) {

			$scope.trustAsHtml = $sce.trustAsHtml;

			prcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());
			var textComplementServiceKey = moduleContext.getModuleName();

			boqMainSpecificationControllerService.initSpecificationController($scope, prcBoqMainService, textComplementServiceKey);
		}
	]);
})();
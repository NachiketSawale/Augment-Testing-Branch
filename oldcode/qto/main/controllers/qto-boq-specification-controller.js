/**
 * Created by lvy on 10/30/2017.
 */

(function () {

	'use strict';
	/* global */

	var moduleName = 'qto.main';

	angular.module(moduleName).controller('qtoMainBoqSpecificationController', [
		'boqMainSpecificationControllerService',
		'$scope',
		'$sce',
		'qtoBoqStructureService',
		function boqMainSpecificationControllerFunction(boqMainSpecificationControllerService,
			$scope,
			$sce,
			qtoBoqStructureService) {

			$scope.trustAsHtml = $sce.trustAsHtml;
			// if the container is editable
			// qtoBoqStructureService.setReadOnly(true);
			// var textComplementServiceKey = moduleName;

			boqMainSpecificationControllerService.initSpecificationController($scope, qtoBoqStructureService/* , textComplementServiceKey */);
		}
	]);
})();
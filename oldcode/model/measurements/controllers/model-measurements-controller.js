/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.measurements';

	angular.module(moduleName).controller('modelMeasurementsController', modelMeasurementsController);

	modelMeasurementsController.$inject = ['$scope', 'platformMainControllerService',
		'modelMeasurementDataService', 'modelMeasurementTranslationService', 'modelMeasurementGroupFilterService'];

	function modelMeasurementsController($scope, platformMainControllerService,
		modelMeasurementDataService, modelMeasurementTranslationService, modelMeasurementGroupFilterService) {

		$scope.path = globals.appBaseUrl;
		const opt = {search: true, reports: true};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelMeasurementDataService, mc, modelMeasurementTranslationService, moduleName, opt);

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(modelMeasurementDataService, sidebarReports, modelMeasurementTranslationService, opt);
		});

		modelMeasurementGroupFilterService.setTobeFilterService(modelMeasurementDataService);
	}
})(angular);


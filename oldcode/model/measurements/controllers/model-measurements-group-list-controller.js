/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.measurements';
	angular.module(moduleName).controller('modelMeasurementGroupListController',
		['$scope',
			'modelMeasurementGroupConfigurationService',
			'platformContainerControllerService',
			'modelMeasurementGroupDataService',
			'platformGridControllerService',
			'modelMeasurementUIConfigurationService',
			'modelMeasurementGroupFilterService',
			function ($scope, modelMeasurementGroupConfigurationService, platformContainerControllerService, modelMeasurementGroupDataService, platformGridControllerService, modelMeasurementUIConfigurationService, modelMeasurementGroupFilterService, modelMeasurementGroupValidationService) {
				platformGridControllerService.initListController($scope, modelMeasurementGroupConfigurationService, modelMeasurementGroupDataService, modelMeasurementGroupValidationService, {
					parentProp: 'MeasurementGroupFk',
					childProp: 'MdlMeasurementEntities',
					marker: {
						filterService: modelMeasurementGroupFilterService,
						filterId: 'modelMeasurementGroupDataService',
						dataService: modelMeasurementGroupDataService,
						serviceName: 'modelMeasurementGroupDataService'
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						modelMeasurementGroupDataService.onCellChange(arg);
					},
					rowChangeCallBack: function rowChangeCallBack(/* arg, buttons */) {

					}
				});

				// If entity modify we check code is empty or not,when update code can not be null.
				modelMeasurementGroupDataService.registerDataModified(function () {
					const selectedItem = modelMeasurementGroupDataService.getSelected();
				});

			}]);
})(angular);



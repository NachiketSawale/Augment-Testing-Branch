/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipBoqListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the boqs belonging to wips
	 **/
	angular.module(moduleName).controller('salesWipBoqListController',
		['$scope', 'platformContainerControllerService', 'modelViewerStandardFilterService', '$injector',
			function ($scope, platformContainerControllerService, modelViewerStandardFilterService, $injector) {
				platformContainerControllerService.initController($scope, moduleName, '27CBDFED58E44DBD8D3B3C07B54BBC1F');

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesWipBoqService');

				var salesWipBoqService = $injector.get('salesWipBoqService');
				var salesWipBoqStructureService = $injector.get('salesWipBoqStructureService');

				var reactOnBoqImportSucceeded = function() {
					var currentBoqItem;

					salesWipBoqService.registerListLoaded(onBoqItemsLoaded);

					function onBoqItemsLoaded() {
						salesWipBoqService.unregisterListLoaded(onBoqItemsLoaded);

						if (currentBoqItem) {
							salesWipBoqService.setSelected(currentBoqItem);
						}
					}

					currentBoqItem = salesWipBoqService.getSelected();
					salesWipBoqService.load();
				};

				salesWipBoqStructureService.onImportSucceeded.register(reactOnBoqImportSucceeded);

				$scope.$on('$destroy', function () {
					salesWipBoqStructureService.onImportSucceeded.unregister(reactOnBoqImportSucceeded);
				});
			}
		]);

})(angular);

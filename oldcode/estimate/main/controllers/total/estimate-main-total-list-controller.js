/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainTotalListController
	 * @function
	 *
	 * @description
	 * Controller for total costs.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainTotalListController',
		['$scope', '$timeout', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateTotalService', 'estimateDefaultGridConfig',
			'estimateMainService', 'platformCreateUuid', 'estimateMainCommonService',
			'estimateMainBoqService','estimateMainActivityService','estimateMainLocationService',
			function ($scope, $timeout, platformGridControllerService, estimateMainCommonUIService, estimateTotalService, estimateDefaultGridConfig,
				estimateMainService, platformCreateUuid,estimateMainCommonService,
				estimateMainBoqService,estimateMainActivityService,estimateMainLocationService) {

				let gridConfig = angular.extend({/* enter specific options here */}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['TotalOf',  'Description', 'Total', 'CurUoM']);

				platformGridControllerService.initListController($scope, uiService, estimateTotalService, null, gridConfig);

				$scope.getContainerUUID = function getContainerUUID() {
					return platformCreateUuid();
				};

				function refreshTotalByLineItem(){
					estimateMainCommonService.getTotalMajorCCBySelectedLineItem(estimateMainService.getSelected().Id);
				}

				function refreshTotalByEstHeader(){
					estimateMainCommonService.getTotalMajorCCByEstHeader(estimateMainService.getSelectedEstHeaderId());
				}

				function refreshTotalByFilter(){
					estimateMainCommonService.getTotalMajorCCByFilter();
				}

				estimateMainService.registerListLoaded(refreshTotalByEstHeader);

				estimateMainService.registerSelectionChanged(refreshTotalByLineItem);

				estimateMainBoqService.registerFilterBoqItem(refreshTotalByFilter);
				estimateMainActivityService.registerFilterActivityItem(refreshTotalByFilter);
				estimateMainLocationService.registerFilterLocationItem(refreshTotalByFilter);

				$scope.$on('$destroy', function () {
					estimateMainService.unregisterListLoaded(refreshTotalByEstHeader);

					estimateMainService.unregisterSelectionChanged(refreshTotalByLineItem);
					estimateMainBoqService.unregisterFilterBoqItem(refreshTotalByFilter);
					estimateMainActivityService.unregisterFilterActivityItem(refreshTotalByFilter);
					estimateMainLocationService.unregisterFilterLocationItem(refreshTotalByFilter);
				});

			}]);
})();

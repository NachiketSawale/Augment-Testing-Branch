/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/*
 * initialize content for sidebar-information in estimate-modul.
 */
(function () {
	'use strict';
	/* global globals */

	function infoControllerFkt($scope, estimateMainService, cloudDesktopSidebarInfoControllerService, estimateTotalService) {

		let dataConfig = [
			{
				dataService: estimateMainService,
				selectedItem: 'estimateMainService'
			},
			{
				dataService: estimateTotalService,
				selectedItem: 'estimateTotalServiceDataService'
			}
		];

		$scope.config = [
			{
				panelType: 'template',
				disableHeader: true,
				model: 'estimateTotalServiceDataService',
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/sidebar/sidebar-info-estimate-total.html'
			}
		];

		$scope.dataServiceList = estimateTotalService.getList();
		$scope.showHeaderInfo = false;

		$scope.$watch('estimateMainService.Code', function() {
			if($scope.estimateMainService) {
				$scope.lineItemCode = ' / ' + $scope.estimateMainService.Code;
			}
		});

		let _selectedprojectInfo = null;
		$scope.showHeaderInfo = function() {
			let selectedProjectInfo = estimateMainService.getSelectedProjectInfo();
			if(_selectedprojectInfo !== selectedProjectInfo) {
				_selectedprojectInfo = selectedProjectInfo;
				$scope.projectInfo = selectedProjectInfo ? selectedProjectInfo.ProjectName + ' - ' + selectedProjectInfo.ProjectNo : '';
				let selectedEstHeaderItem = estimateMainService.getSelectedEstHeaderItem();
				$scope.estimateItem = selectedEstHeaderItem ? selectedEstHeaderItem.Code + ' - ' + selectedEstHeaderItem.DescriptionInfo.Translated : '';
			}
			return selectedProjectInfo;
		};

		/*
		$scope.$watch(function() {
			return $('#sidebar-info').is(':visible');
		}, function() {
			if(estimateMainService.getSelectedProjectInfo()) {
				$scope.projectInfo = estimateMainService.getSelectedProjectInfo().ProjectName + ' - ' + estimateMainService.getSelectedProjectInfo().ProjectNo;

				if(estimateMainService.getSelectedEstHeaderItem()) {
					$scope.estimateItem = estimateMainService.getSelectedEstHeaderItem().Code + ' - ' + estimateMainService.getSelectedEstHeaderItem().DescriptionInfo.Translated;
				}

				$scope.showHeaderInfo = true;
			}
		});
*/

		// call service for sidebar-information
		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);

		estimateTotalService.registerListLoaded(handleTotalServiceLoaded);

		function handleTotalServiceLoaded() {
			estimateTotalService.goToFirst();
		}

		$scope.$on('$destroy', function () {
			estimateTotalService.unregisterListLoaded(handleTotalServiceLoaded);
		});
	}

	angular.module('estimate.main').controller('estimateMainInfoController',
		// ['$scope', 'estimateMainService', 'cloudDesktopSidebarInfoControllerService', 'estimateTotalService', '$injector', infoControllerFkt]);
		['$scope', 'estimateMainService', 'cloudDesktopSidebarInfoControllerService', 'estimateGrandTotalService', infoControllerFkt]);

})();






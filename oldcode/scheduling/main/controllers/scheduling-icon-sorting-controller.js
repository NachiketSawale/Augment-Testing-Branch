/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('scheduling.main').controller('schedulingIconSortingDialogController', ['_', '$scope', '$translate','platformGridAPI','schedulingMainService','schedulingMainDueDateService',
		function (_, $scope, $translate,platformGridAPI,schedulingMainService,schedulingMainDueDateService) {
			$scope.tabs = [
				{
					title: $translate.instant('scheduling.main.headerPerformanceSettingsDialog'),
					content: globals.appBaseUrl + 'scheduling.main/templates/scheduling-performance-setting-form.html',
					active: true,
					id: 'tab1'
				},
				{
					title: $translate.instant('scheduling.main.iconSortingTab'),
					content: globals.appBaseUrl + 'scheduling.main/templates/scheduling-icon-setting-tab-form.html',
					id: 'tab2',
					reloadTab: true
				}
			];
			$scope.dataItem = {
				dueDate: schedulingMainDueDateService.getPerformanceDueDate() || null,
				description: schedulingMainDueDateService.getPerformanceDescription() || '',
				enableTransientRootEntity: schedulingMainService.getTransientRootEntityEnable() || false,
				icons: []
			};
			$scope.modalOptions = {
				headerText: $translate.instant('scheduling.main.activitySettings'),
				ok: function () {

					platformGridAPI.grids.commitEdit('e262c3a81b334f7daf35fb27d298a19a');
					const data = platformGridAPI.items.data('e262c3a81b334f7daf35fb27d298a19a');
					let dataItem = {
						dueDate: $scope.dataItem.dueDate,
						description: $scope.dataItem.description,
						enableTransientRootEntity: $scope.dataItem.enableTransientRootEntity,
						icons:data
					};
					$scope.$close({yes: true, data: dataItem});

				},
				showCloseButton: true,
				actionButtonText: $translate.instant('cloud.common.ok'),
				closeButtonText: $translate.instant('cloud.common.cancel'),
				cancel: function () {
					$scope.$close({});
				}
			};
			$scope.dialog = {
				modalOptions: $scope.modalOptions
			};

		}
	]);

})(angular);

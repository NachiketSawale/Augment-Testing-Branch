/**
 * Created by sprotte on 27.02.2015.
 */
/* jshint -W072 */
angular.module('scheduling.main').controller('schedulingMainPerformanceSettingsDialogController', ['$scope', 'schedulingMainDueDateService', '$translate', 'platformModalService', '$modalInstance',
	function Controller($scope, schedulingMainDueDateService, $translate, platformModalService, $modalInstance) {
		'use strict';
		$scope.modalOptions = {
			actionButtonText: $translate.instant('cloud.common.ok'),
			ok: OK,
			closeButtonText: $translate.instant('cloud.common.cancel'),
			cancel: cancel,
			headerText: $translate.instant('scheduling.main.headerPerformanceSettingsDialog'),
			showOkButton: true,
			showYesButton: false,
			showNoButton: false,
			showIgnoreButton: false,
			showCancelButton: true,
			showRetryButton: false
		};


		$scope.settings = {};

		$scope.selectedItem = {
			dueDate: schedulingMainDueDateService.getPerformanceDueDate(),
			description: schedulingMainDueDateService.getPerformanceDescription()
		};


		$scope.desctription = {
			ctrlId: 'description',
			labelText: $translate.instant('cloud.common.entityDescription')
		};

		$scope.dueDate = {
			displayMember: 'description',
			valueMember: 'value',
			items: [
				{value: true, description: $translate.instant('scheduling.main.dueDate')}
			]
		};

		$scope.showDialog = function () {

			var modalOptions = {
				headerTextKey: 'cloud.desktop.infoDialogHeader',
				bodyTextKey: 'cloud.desktop.infoBodyText',
				iconClass: 'ico-info'
			};

			platformModalService.showDialog(modalOptions);
		};

		function OK() {
			writeSettings();
			$modalInstance.close({ok: true});
		}

		function cancel() {
			$modalInstance.close({cancel: true});
		}

		function writeSettings() {
			schedulingMainDueDateService.setPerformanceDueDate($scope.selectedItem.dueDate);
			schedulingMainDueDateService.setPerformanceDescription($scope.selectedItem.description);
		}
	}
]);
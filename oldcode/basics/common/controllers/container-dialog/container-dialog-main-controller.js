/**
 * Created by waz on 11/1/2017.
 */
(function (angular) {
	'use strict';

	const module = 'basics.common';
	angular
		.module(module)
		.controller('basicsCommonContainerDialogMainController', BasicsCommonContainerDialogMainController);
	BasicsCommonContainerDialogMainController.$inject = ['$scope', '$injector', '$translate',
		'$modalInstance', 'keyCodes', 'platformGridAPI', 'basicsCommonContainerDialogService', '_'];

	function BasicsCommonContainerDialogMainController($scope, $injector, $translate,
		$modalInstance, keyCodes, platformGridAPI, mainService, _) {

		function init() {
			$scope.modalOptions = {};
			angular.extend($scope.modalOptions, {
				width: '900px'
			});
			angular.extend($scope, {
				setTools: setTools,
				close: close,
				refresh: refresh,
				ok: ok,
				search: search,
				onSearchInputKeydown: onSearchInputKeydown,
				onFilterCheckboxClick: onFilterCheckboxClick,

				getDialogConfig: mainService.getDialogConfig,
				uiConfig: {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					refreshButtonText: $translate.instant('basics.common.button.refresh'),
					dialogTitle: $translate.instant(mainService.getDialogConfig().uiConfig.dialogTitle),
					selectEntityText: $translate.instant(mainService.getDialogConfig().uiConfig.selectEntityText),
					filterCheckbox: mainService.getDialogConfig().uiConfig.filterCheckbox,
					info: mainService.getDialogConfig().uiConfig.info,
					disableOkButton: true
				},
				bodyTemplateUrl: mainService.getDialogConfig().bodyTemplateUrl,
				mainDataService: getService(mainService.getDialogConfig().mainDataService),
				selectedItems: [],
				isFilterDisable: true,
				filterString: ''
			});
			if ($scope.uiConfig.filterCheckbox) {
				$scope.uiConfig.filterCheckbox.title = $translate.instant(
					$scope.uiConfig.filterCheckbox.title,
					{item: $scope.uiConfig.selectEntityText});
			}
			$scope.uiConfig.entitySelectedText = $translate.instant(
				'basics.common.containerDialog.itemsSelected',
				{item: $scope.uiConfig.selectEntityText});

			// update selectedItems when setSelectedEntities is called,because after dataService setSelectedEntities won't trigger getSelectedEntities in view,
			// so I overwrite setSelectedEntities function and register selectionChanged,update view manually
			// --- walter zheng
			const setSelectedEntities = $scope.mainDataService.setSelectedEntities;
			$scope.mainDataService.setSelectedEntities = function (entities) {
				setSelectedEntities(entities);
				$scope.$evalAsync(function () {
					$scope.selectedItems = $scope.mainDataService.getSelectedEntities();
				});
			};

			// for single click select
			$scope.mainDataService.registerSelectionChanged(function () {
				$scope.selectedItems = $scope.mainDataService.getSelectedEntities();
			});
		}

		function setTools(tools) {
			$scope.tools = tools || {};
			$scope.tools.update = function () {
			};
		}

		function close() {
			mainService.close();
			$modalInstance.dismiss('cancel');
		}

		function refresh() {
			mainService.refresh();
			$scope.selectedItems = [];
		}

		function ok() {
			mainService.ok();
			mainService.close();
			$modalInstance.dismiss('ok');
		}

		function search(filterString) {
			mainService.search(filterString);
		}

		function onFilterCheckboxClick() {
			$scope.isFilterDisable = !$scope.isFilterDisable;
			mainService.activeFilter($scope.uiConfig.filterCheckbox.title && !$scope.isFilterDisable);
		}

		function onSearchInputKeydown(event, filterString) {
			if (event.keyCode === keyCodes.ENTER) {
				search(filterString);
			}
		}

		function getService(service) {
			return angular.isString(service) ? $injector.get(service) : service;
		}

		init();

		_.extend($scope.modalOptions, {
			headerText: $translate.instant(mainService.getDialogConfig().uiConfig.dialogTitle),
			cancel: close
		});

		$scope.$on('$destroy', function () {
			close();
		});
	}
})(angular);
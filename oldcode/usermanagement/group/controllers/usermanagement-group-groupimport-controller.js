/**
 * Created by sandu on 31.05.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.group';
	angular.module(moduleName).controller('usermanagementGroupImportController', usermanagementGroupImportController);

	usermanagementGroupImportController.$inject = ['$scope', '$modalInstance', 'platformGridAPI', '$translate', 'usermanagementGroupImportService'];

	function usermanagementGroupImportController($scope, $modalInstance, platformGridAPI, $translate, usermanagementGroupImportService) {

		$scope.gridId = '0aeb7c689fe848af87a997b2b9881180';
		$scope.avGridData = true;

		var selectedGroups = [];

		$scope.modalOptions = {
			headerText: $translate.instant('usermanagement.group.groupImport.headerText'),
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('usermanagement.group.groupImport.importButton'),
			cancel: cancel,
			ok: OK,
			canImport: canImport
		};

		$scope.gridData = {
			state: $scope.gridId
		};

		$scope.loadingOption = {
			loading: false,
			info: 'uploading in process...'
		};

		var settings = {
			columns: [
				{
					id: 'selected',
					field: 'selected',
					name: $translate.instant('usermanagement.group.groupImport.selected'),
					editor: 'marker',
					formatter: 'marker',
					width: 40,
					editorOptions: {
						//serviceName: '',
						//serviceMethod: '',
						multiSelect: true
					}
				},
				{
					id: 'name',
					field: 'Name',
					name: $translate.instant('usermanagement.group.groupImport.name'),
					formatter: 'description',
					width: 150
				},
				{
					id: 'description',
					field: 'Description',
					name: $translate.instant('usermanagement.group.groupImport.description'),
					formatter: 'description',
					width: 150
				},
				{
					id: 'domainSid',
					field: 'ObjectSid',
					name: $translate.instant('usermanagement.group.groupImport.domainSid'),
					formatter: 'description',
					width: 150
				}
			]
		};
		$scope.settings = {};
		$scope.settings.createAssignOpt = {
			ctrlId: 'createAssign',
			labelText: $translate.instant('usermanagement.group.groupImport.createAssign')
		};

		$scope.settings.createAssign = false;

		usermanagementGroupImportService.getAdsGroups().then(function (data) {
			var groups = data.data;
			if (groups === null) {
				$scope.avGridData = false;
			}
			platformGridAPI.items.data($scope.gridId, groups);
			$scope.loadingOption.loading = false;
		});

		var gridInstance = platformGridAPI.grids.element('id', $scope.gridId);

		if (!gridInstance) {
			var grid = {
				columns: angular.copy(settings.columns),
				data: [],
				id: $scope.gridId,
				lazyInit: true,
				enableConfigSave: true,
				options: {
					tree: false,
					indicator: false,
					idProperty: 'ObjectSid',
					autoHeight: false
				}
			};

			$scope.loadingOption.loading = true;
			platformGridAPI.grids.config(grid);
		}

		$scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 't1',
					caption: 'cloud.common.toolbarSearch',
					type: 'check',
					value: platformGridAPI.filters.showSearch($scope.gridId),
					iconClass: 'tlb-icons ico-search',
					fn: function () {
						platformGridAPI.filters.showSearch($scope.gridId, this.value);
					}
				}
			]
		};

		function cancel() {
			$modalInstance.close({cancel: true});
		}

		function OK() {
			usermanagementGroupImportService.importSelectedAdsGroups(selectedGroups, $scope.settings.createAssign);
			$modalInstance.close({cancel: true});
		}

		function canImport() {
			if (selectedGroups.length) {
				return true;
			}
		}

		function getSelectedAdsGroups() {
			var data = platformGridAPI.items.data($scope.gridId);
			selectedGroups = _.filter(data, function (group) {
				return group.selected === true;
			});
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', getSelectedAdsGroups);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', getSelectedAdsGroups);
			platformGridAPI.grids.unregister($scope.gridId);
		});

	}
})(angular);
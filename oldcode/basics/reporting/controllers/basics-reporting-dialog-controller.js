/**
 * Created by sandu on 13.07.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.reporting';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsReportingDialogController
	 * @function
	 *
	 * @description
	 * Controller for the  report dialog view
	 **/

	angModule.controller('basicsReportingDialogController', basicsReportingDialogController);

	basicsReportingDialogController.$inject = ['$scope', '$modalInstance', 'platformGridAPI', 'basicsReportingMainReportService', '$translate', 'platformModalService'];

	function basicsReportingDialogController($scope, $modalInstance, platformGridAPI, basicsReportingMainReportService, $translate, platformModalService) {

		$scope.gridId = 'C97D5E9EF39D4EF49530B1932E40C9E2';

		$scope.loadingOption = {
			loading: false,
			info: 'uploading in process...'
		};

		var settings = {
			columns: [{
				id: 'Id',
				field: 'Name',
				name: 'Name',
				name$tr$: '',
				editor: null,
				formatter: '',
				readonly: true,
				width: 135
			}]
		};

		basicsReportingMainReportService.getPathStructure().then(function (data) {
			platformGridAPI.items.data($scope.gridId, data);
		});

		var gridInstance = platformGridAPI.grids.element('id', $scope.gridId);

		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'Name',
			childProp: 'Subfolders'
		};

		var useTree = true;

		if (!gridInstance) {
			var grid = {
				columns: angular.copy(settings.columns),
				data: [],
				id: $scope.gridId,
				lazyInit: true,
				options: {
					tree: useTree,
					indicator: true,
					idProperty: 'Id',
					iconClass: '',
					autoHeight: false
				}
			};

			if (useTree) {
				grid.options.parentProp = gridConfig.parentProp;
				grid.options.childProp = gridConfig.childProp;
				grid.options.collapsed = false;
			}

			platformGridAPI.grids.config(grid);
		}

		$scope.gridData = {
			state: $scope.gridId
		};

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
		});

		function getFileExtension(filename) {
			return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
		}

		function onUpload() {
			$scope.loadingOption.loading = true;

			var selectedFolder = platformGridAPI.rows.selection({ gridId: $scope.gridId }).Path;
			var reportFile = basicsReportingMainReportService.getSelectedReport();
			var fileExtension = getFileExtension(reportFile.name);

			switch (fileExtension.toLowerCase()) {
				case 'frx':
				case 'zip':
				case '7z':
					basicsReportingMainReportService.uploadReport(reportFile, selectedFolder)
						.then(function () {
							$scope.loadingOption.loading = false;
							$modalInstance.close('ok');
						});
					break;

				default:
					$modalInstance.close();
					platformModalService.showErrorBox('basics.reporting.errorBody', 'basics.reporting.errorHeader');
			}
		}

		function onCancel() {
			$modalInstance.dismiss('cancel');
		}

		function canUpload() {
			var selectedFolder;
			if (platformGridAPI.grids.exist($scope.gridId) && platformGridAPI.rows && platformGridAPI.rows.selection({ gridId: $scope.gridId })) {
				selectedFolder = platformGridAPI.rows.selection({ gridId: $scope.gridId }).Path;
			}
			return ($scope.loadingOption.loading || selectedFolder);
		}

		$scope.modalOptions = {
			headerText: $translate.instant('basics.reporting.dialogHeader'),
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('basics.reporting.dialogOK'),
			onUpload: onUpload,
			cancel: onCancel,
			canUpload: canUpload
		};

	}
})(angular);
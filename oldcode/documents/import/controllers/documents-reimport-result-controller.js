(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('documents.import').controller('documentsWizardReimportResultController',
		['platformGridControllerService', '$scope', '$translate', 'platformGridAPI',
			'$state', 'cloudDesktopSidebarService', 'platformModalService',
			'documentsWizardReimportResultService', '$timeout',
			function (platformGridControllerService, $scope, $translate, platformGridAPI,
				$state, cloudDesktopSidebarService, platformModalService,
				documentsWizardReimportResultService, $timeout) {

				// var translatePrefix = 'procurement.invoice.';

				var errorType = {info: 1, error: 3};

				$scope.modalOptions.headerText = 'Document Import';
				$scope.gridId = 'DA9D9E80ED214921A44BCCE0EDF690B7';

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var showColumns = documentsWizardReimportResultService.modalOptions.columns;
					var dataList = [];
					documentsWizardReimportResultService.getDataList().then(function (items) {
						if (items) {
							dataList = items;
							$timeout(function () {
								showError(false, '', errorType.error);
								$scope.modalOptions.dialogLoading = false;
								dataList = items;
								platformGridAPI.items.data($scope.gridId, dataList);
							}, 2000);
						}

					}, function (errorInfo) {
						if (errorInfo && errorInfo.data && errorInfo.data.ErrorMessage) {
							showError(true, errorInfo.data.ErrorMessage, errorType.error);
						}
						$scope.modalOptions.dialogLoading = false;
					});

					var grid = {
						columns: showColumns,
						data: dataList,
						id: $scope.gridId,
						lazyInit: true,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.onCancel = function () {
					$scope.$close({isOK: true});
				};
				$scope.modalOptions.cancel = $scope.onCancel;

				function showError(isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				}

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister('DA9D9E80ED214921A44BCCE0EDF690B7');
				});

			}]);
})(angular);
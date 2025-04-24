(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceWizardImportResultController',
		['platformGridControllerService', '$scope', '$translate', 'platformGridAPI',
			'$state', 'cloudDesktopSidebarService', 'platformModalService',
			'procurementInvoiceWizardImportResultService', '$timeout',
			function (platformGridControllerService, $scope, $translate, platformGridAPI,
				$state, cloudDesktopSidebarService, platformModalService,
				procurementInvoiceWizardImportResultService, $timeout) {

				// var translatePrefix = 'procurement.invoice.';

				var errorType = {info: 1, error: 3};

				$scope.modalTitle = 'Import Invoice';
				$scope.gridId = 'C6F33168C7474323BEA20C4F2689DEE0';

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var showColumns = procurementInvoiceWizardImportResultService.modalOptions.columns;
					var dataList = [];
					// procurementInvoiceWizardImportResultService.getDataList().then(function (items) {
					procurementInvoiceWizardImportResultService.getImportDataWithWorkflowStatus().then(function (items) {
						if (items) {
							dataList = items;
							$timeout(function () {
								showError(false, '', errorType.error);
								$scope.modalOptions.dialogLoading = false;
								var res = _.filter(items, function (item) {
									return item.Status === 'Failed';
								});
								var successLen = items.length - res.length;

								// noinspection JSUnusedLocalSymbols
								// eslint-disable-next-line no-unused-vars
								function getItemFormat(len) { // jshint ignore:line
									return len > 1 ? ' (items)' : ' (item)';
								}

								var temp = '<br/>&nbsp;&nbsp;&nbsp;&nbsp;';
								$scope.modalOptions.bodyText =
									'Import Result:' +
									temp + 'Total: ' + items.length +
									temp + 'Succeeded: ' + successLen +
									temp + 'Failed: ' + res.length;
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
					var ids = _.map(_.filter(dataList, function (item) {
						return item.Id > 0;
					}), 'Id');
					procurementInvoiceWizardImportResultService.jumpTo(ids);
				};

				function showError(isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				}

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister('C6F33168C7474323BEA20C4F2689DEE0');
				});

			}]);
})(angular);
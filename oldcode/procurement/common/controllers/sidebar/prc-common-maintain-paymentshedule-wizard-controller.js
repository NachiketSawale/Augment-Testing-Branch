(function(angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('paymentScheduleVersionWizardController', [
		'$scope',
		'$http',
		'$translate',
		'platformGridAPI',
		'procurementContextService',
		'platformModalService',
		function(
			$scope,
			$http,
			$translate,
			platformGridAPI,
			moduleContext,
			platformModalService
		) {
			var paymentScheduleService = null;
			var list = null;
			var paymentScheduleVersions = $scope.options.currentItem.map(function (x) {
				return x.Version;
			});
			var parentService = moduleContext.getMainService();
			var url = $scope.options.area === 'sales' ? 'sales/contract/paymentschedule/' : 'procurement/common/prcpaymentschedule/';
			$scope.options = $scope.$parent.modalOptions;
			$scope.createItems = [];
			$scope.deleteParam = [];
			$scope.selectRows = [];

			paymentScheduleService  = _.find(parentService.getChildServices(), function(s) {
				if ($scope.options.area === 'sales') {
					return s.getServiceName() === 'salesContractPaymentScheduleDataService';
				}
				else {
					return s.getServiceName() === 'procurementCommonPaymentScheduleDataService';
				}
			});

			$scope.modalOptions = {
				okButtonText: $translate.instant('cloud.common.ok'),
				cancelButtonText: $translate.instant('cloud.common.cancel'),
				createButtonText: $translate.instant('cloud.common.buttonCreate'),
				createVersion: $translate.instant('procurement.common.wizard.createVersion'),
				deleteHighlightedVersion: $translate.instant('procurement.common.wizard.deleteHighlightedVersion'),
				restoreFromVersion: $translate.instant('procurement.common.wizard.restroeFromVersion'),
				fillInVersionText: $translate.instant('procurement.common.wizard.fillInVersionText'),
				headerText: $translate.instant('procurement.common.wizard.maintainPaymentScheduleVersion'),
				uniqueVersionMessage:$translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'Version'}),
				newVersionText: '',
				selected: false,
				disableCreate: true,
				showUniqueVersionMessage: false
			};

			$scope.modalOptions.inputVersionText = function() {
				if ($scope.modalOptions.newVersionText) {
					var sameVersionText = paymentScheduleVersions.find(function(v) {
						return v === $scope.modalOptions.newVersionText;
					});
					if (sameVersionText) {
						$scope.modalOptions.disableCreate = true;
						$scope.modalOptions.showUniqueVersionMessage = true;
					}
					else {
						$scope.modalOptions.disableCreate = false;
						$scope.modalOptions.showUniqueVersionMessage = false;
					}
				}
				else {
					$scope.modalOptions.disableCreate = true;
					$scope.modalOptions.showUniqueVersionMessage = false;
				}
			};

			$scope.modalOptions.create = function() {
				var postParam = {
					MainItemId: $scope.options.mainItemId,
					VersionText: $scope.modalOptions.newVersionText
				};
				$http.post(globals.webApiBaseUrl + url + 'createpaymentscheduleversion', postParam).then(function (response) {
					$scope.modalOptions.newVersionText = '';
					$scope.modalOptions.disableCreate = true;
					response.data.VersionInfo.Id = $scope.options.currentItem.length + 1;
					$scope.options.currentItem.push(response.data.VersionInfo);
					platformGridAPI.grids.refresh($scope.gridId, true);
					$scope.createItems = $scope.createItems.concat(response.data.PaymentSchedules);
					paymentScheduleVersions = $scope.options.currentItem.map(function (x) {
						return x.Version;
					});
				});
			};

			$scope.modalOptions.delete = function() {
				if ($scope.modalOptions.selected === false) {
					return;
				}
				var needToDelete = _.remove($scope.options.currentItem, function(n, i){
					var exist = _.find($scope.selectRows, function(r) {
						return r === i;
					});
					return exist !== undefined;

				});
				if (needToDelete.length) {
					$scope.deleteParam = $scope.deleteParam.concat(needToDelete);
					$scope.selectRows = [];
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					if (grid && grid.instance) {
						grid.instance.setSelectedRows([]);
					}
					platformGridAPI.grids.refresh($scope.gridId, true);
					paymentScheduleVersions = $scope.options.currentItem.map(function (x) {
						return x.Version;
					});
				}
				var newVersions = _.remove($scope.deleteParam, function(i) {
					return i.IsSave === false;
				});
				if (newVersions.length) {
					_.remove($scope.createItems, function(i) {
						var exist = _.find(newVersions, {Version: i.PaymentVersion});
						return exist !== undefined;

					});
				}
			};

			$scope.modalOptions.restore = function() {
				if ($scope.modalOptions.selected === false) {
					return;
				}
				list = list ? list : paymentScheduleService.getList();
				var isDoneItem = _.find(list, {IsDone: true});
				if (isDoneItem) {
					var bodyText = $translate.instant('procurement.common.wizard.haveIsDoneItemsCannotRestore');
					var modalOptions = {
						headerText: $scope.modalOptions.headerText,
						bodyText: bodyText,
						iconClass: 'ico-info'
					};
					return platformModalService.showDialog(modalOptions);
				}
				if ($scope.selectRows && $scope.selectRows.length) {
					var restoreToIt = $scope.options.currentItem[$scope.selectRows[0]];
					if (restoreToIt && (restoreToIt.PrcHeaderFk || restoreToIt.OrdHeaderFk)) {
						$http.post(globals.webApiBaseUrl + url + 'restorepaymentscheduleversion', restoreToIt).then(function () {
							paymentScheduleService.load();
							$scope.$close(false);
						});
					}
				}
			};

			$scope.modalOptions.ok = function() {
				if ($scope.createItems && $scope.createItems.length) {
					$http.post(globals.webApiBaseUrl + url + 'savepaymentscheduleversion', $scope.createItems).then(function () {
						paymentScheduleService.load();
						$scope.$close(false);
					});
				}
				if ($scope.deleteParam && $scope.deleteParam.length) {
					var deleteParam = {
						MainItemId: $scope.options.mainItemId,
						VersionInfos: $scope.deleteParam
					};
					$http.post(globals.webApiBaseUrl + url + 'deletepaymentscheduleversion', deleteParam).then(function () {
						paymentScheduleService.load();
						$scope.$close(false);
					});
				}
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function() {
				$scope.$close(false);
			};

			var columns = [
				{
					id: 'Version',
					field: 'Version',
					name: 'Version',
					name$tr$: 'cloud.common.entityVersion',
					formatter: 'description',
					width: 100
				},
				{
					id: 'TotalNet',
					field: 'TotalNet',
					name: 'Total Net',
					name$tr$: 'procurement.common.wizard.totalnet',
					formatter: 'decimal',
					width: 88,
					editorOptions: { decimalPlaces: 2 },
					formatterOptions: { decimalPlaces: 2 }
				},
				{
					id: 'TotalGross',
					field: 'TotalGross',
					name: 'Total Gross',
					name$tr$: 'procurement.common.wizard.totalgross',
					formatter: 'decimal',
					width: 88,
					editorOptions: { decimalPlaces: 2 },
					formatterOptions: { decimalPlaces: 2 }
				},
				{
					id: 'From',
					field: 'From',
					name: 'From',
					name$tr$: 'procurement.common.wizard.from',
					formatter: 'dateutc',
					width: 140
				},
				{
					id: 'End',
					field: 'End',
					name: 'End',
					name$tr$: 'procurement.common.wizard.end',
					formatter: 'dateutc',
					width: 140
				}
			];
			function onSelectedRowsChanged(scope, data) {
				if (data.rows.length === 0 ) {
					$scope.modalOptions.selected = false;
					$scope.selectRows = [];
				}
				else {
					$scope.modalOptions.selected = true;
					$scope.selectRows = data.rows;
				}
			}

			$scope.gridId = 'c17ba5671c524f3288270803b386654c';

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					columns: columns,
					data: $scope.options.currentItem,
					id: $scope.gridId,
					lazyInit: true,
					options: {
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(grid);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridId);
			});


		}
	]);
})(angular);
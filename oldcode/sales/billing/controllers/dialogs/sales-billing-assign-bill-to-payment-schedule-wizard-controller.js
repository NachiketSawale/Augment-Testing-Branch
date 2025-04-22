/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name salesBillingAssignBillToPaymentScheduleWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard generate salesBillingAssignBillToPaymentScheduleWizardController dialog
	 **/

	var moduleName = 'sales.billing';

	angular.module(moduleName).controller('salesBillingAssignBillToPaymentScheduleWizardController', [
		'globals', '_', '$scope', 'slick', '$modalInstance', '$injector', '$http', '$translate', 'platformRuntimeDataService', 'platformGridAPI', 'platformTranslateService', 'platformModalService', 'salesBillingAssignBillToPaymentScheduleWizardDialogService',
		function (globals, _, $scope, slick, $modalInstance, $injector, $http, $translate, platformRuntimeDataService, platformGridAPI, platformTranslateService, platformModalService, salesBillingAssignBillToPaymentScheduleWizardDialogService) {

			var paymentScheduleAllColumns = angular.copy($injector.get('salesContractPaymentScheduleUIStandardService').getStandardConfigForListView().columns);

			// var ismarked = {
			//  id: 'marker',
			//  editor: 'marker',
			//  formatter:'marker',
			//  field: 'IsMarked',
			//  name: ' ',
			//  name$tr$: ' ',
			//  name$tr$param$: undefined,
			//  sortable: true,
			//  toolTip: 'Filter',
			//  toolTip$tr$: 'estimate.assemblies.filterColumn',
			//  pinned: true
			// };
			var bilheaderfk = _.find(paymentScheduleAllColumns, function(item){ return ['bilheaderfk'].indexOf(item.id)>-1;  });
			var code = _.find(paymentScheduleAllColumns, function(item){ return ['code'].indexOf(item.id)>-1;  });
			var description = _.find(paymentScheduleAllColumns, function(item){ return ['description'].indexOf(item.id)>-1;  });
			var amountnet = _.find(paymentScheduleAllColumns, function(item){ return ['amountnet'].indexOf(item.id)>-1;  });
			var datepayment = _.find(paymentScheduleAllColumns, function(item){ return ['datepayment'].indexOf(item.id)>-1;  });
			var daterequest = _.find(paymentScheduleAllColumns, function(item){ return ['daterequest'].indexOf(item.id)>-1;  });
			var isdone = _.find(paymentScheduleAllColumns, function(item){ return ['isdone'].indexOf(item.id)>-1;  });
			var commenttext = _.find(paymentScheduleAllColumns, function(item){ return ['commenttext'].indexOf(item.id)>-1;  });
			var ordpsstatusfk = _.find(paymentScheduleAllColumns, function(item){ return ['ordpsstatusfk'].indexOf(item.id)>-1;  });

			var paymentScheduleColumns = [bilheaderfk, code, description, amountnet, datepayment, daterequest, isdone, commenttext, ordpsstatusfk];

			$scope.modalOptions = {
				headerText: $translate.instant('sales.billing.assignBillToPaymentScheduleLine'),
				ok: ok,
				cancel: close
			};

			// Grid form
			$scope.gridPaymentScheduleId = '52b179a3f151434393b6544d2f8ef9c8';
			$scope.gridData = {
				state: $scope.gridPaymentScheduleId
			};

			if (!platformGridAPI.grids.exist($scope.gridPaymentScheduleId)){
				var gridConfig = {
					data: [],
					columns: paymentScheduleColumns,
					id: $scope.gridPaymentScheduleId,
					lazyInit: true,
					isStaticGrid: true,
					options: {
						editorLock: new slick.EditorLock(),
						tree: false,
						indicator: false,
						idProperty: 'Id',
						iconClass: '',
						multiSelect: false
					},
					enableConfigSave: true
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);

			}else{
				platformGridAPI.columns.configuration($scope.gridPaymentScheduleId, paymentScheduleColumns);
			}

			// Load grid data
			var selectedBilling = salesBillingAssignBillToPaymentScheduleWizardDialogService.getBillSelected();
			$http.post(globals.webApiBaseUrl + 'sales/contract/paymentschedule/listByParent', { PKey1: selectedBilling.OrdHeaderFk }).then(function (response) {
				var gridList = (response.data || {}).Main;
				var fields = [];
				_.forEach(gridList, function(item){


					_.forOwn(item, function (value, key) {
						var field = {field: key, readonly: true};
						fields.push(field);
					});
					platformRuntimeDataService.readonly(item, fields);
				});
				platformGridAPI.items.data( $scope.gridPaymentScheduleId, gridList);
			});



			// Detail form // Item Selected
			$scope.entity = {Id: null};

			$scope.loading = {
				show: false,
				text: $translate.instant('sales.billing.assignBillToPaymentSchedule.assignInProgress')
			};

			function ok() {
				$scope.loading.show = true;

				assignPaymentScheduleToBill();
			}

			function close() {
				$modalInstance.dismiss('cancel');
			}

			function assignPaymentScheduleToBill(){
				salesBillingAssignBillToPaymentScheduleWizardDialogService.assignPaymentScheduleToBill($scope.entity).then(function(response){
					var status = response.data;
					if(status === 1) {
						$scope.loading.show = false;

						close();

						platformModalService.showMsgBox('sales.billing.assignBillToPaymentSchedule.assignedSucceed', 'sales.billing.assignBillToPaymentScheduleLine', 'info');
						// .then(function () {
						//  //Refresh payment schedule to show Bill assignment
						//  //$injector.get('salesBillingService').load();
						// });
					}
					else {
						// show error message box
						platformModalService.showErrorBox('An error has occurred, Please try again later', 'cloud.common.errorMessage');
						$scope.loading.show = false;
					}
				},
				function () {
					$scope.loading.show = false;
				});
			}

			function selectedItemChanged() {
				var selected = platformGridAPI.rows.selection({
					gridId: $scope.gridPaymentScheduleId
				});
				$scope.entity = (selected || {});
			}

			var orderPaymentStatusList = [];
			function getOrderPaymentStatus(){
				$http.post(globals.webApiBaseUrl + 'basics/customize/OrderPaymentSchedulesStatus/list').then(
					function (response) {
						_.remove(response.data, {IsLive: false});
						orderPaymentStatusList = response.data;
					});
			}

			function init() {
				// setReadOnlyFields();
				getOrderPaymentStatus();
			}

			init();

			platformGridAPI.events.register($scope.gridPaymentScheduleId, 'onSelectedRowsChanged', selectedItemChanged);


			// disable [OK]-Button?
			$scope.$watchGroup(['entity.Id', 'entity.BilHeaderFk'], function () {
				function getValidOrderPaymentScheduleTypeById(typeId) {
					var item = _.find(orderPaymentStatusList, function(item){
						return typeId === item.Id;
					});

					return item && item.Id ? (item.IsAgreed || item.IsIssued): false;
				}

				var isValidStatusIsAgreedOrIsIssued = $scope.entity && $scope.entity.OrdPsStatusFk ? getValidOrderPaymentScheduleTypeById($scope.entity.OrdPsStatusFk): true;

				$scope.isOkDisabled = !$scope.entity.Id || $scope.entity.BilHeaderFk || !isValidStatusIsAgreedOrIsIssued;
			});

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridPaymentScheduleId, 'onSelectedRowsChanged', selectedItemChanged);
				platformGridAPI.grids.unregister($scope.gridPaymentScheduleId);

			});
		}]);
})();

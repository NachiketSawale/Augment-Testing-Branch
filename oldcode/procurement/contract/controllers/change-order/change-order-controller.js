/**
 * Created by chd on 3/1/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).controller('procurementChangeOrderController',
		['$scope', '$filter', 'cloudDesktopSidebarService', '$http', '$injector', '$translate', 'basicsCommonChangeStatusService', 'basicsWorkflowInstanceStatus', 'platformCreateUuid', 'procurementOrderChangeService', 'platformDialogService',
			function ($scope, $filter, cloudDesktopSidebarService, $http, $injector, $translate, basicsCommonChangeStatusService, wfStatus, platformCreateUuid, procurementOrderChangeService, platformDialogService) {
				$scope.options = $scope.$parent.modalOptions;

				init();
				function init() {
					var itemDataService = $scope.options.itemDataService;
					if (itemDataService && itemDataService.getList().length > 0) {
						var itemDataList = itemDataService.getList();
						itemDataList.forEach(function (item) {
							item.NewAddress = item.Address;
							item.NewDateRequired = item.DateRequired;
						});
					}
				}

				var modalOptionsQuestion = {
					headerText: $translate.instant('basics.common.poChange.controller.modalQuestion.headerTextKey'),
					bodyText: $translate.instant('basics.common.poChange.controller.modalQuestion.bodyTextKey'),
					showYesButton: true, showNoButton: true,
					iconClass: 'ico-question'
				};
				var modalOptionsInfo = {
					headerText: $translate.instant('basics.common.poChange.controller.modalInfo.headerTextKey'),
					showOkButton: true,
					iconClass: 'ico-info'
				};
				/* var poChangeTypes = {
					CHG_DATELIN: 'CHG_DATELIN',
					CHG_ADDRESSLIN: 'CHG_ADDRESSLIN'
				}; */

				$scope.modalOptions = {};
				$scope.modalOptions = {
					chkItems: [
						{
							value: '1',
							text: $translate.instant('basics.common.poChange.controller.modalOptions.chkItems.DeliveryDate'),
							isChecked: false
						},
						{
							value: '2',
							text: $translate.instant('basics.common.poChange.controller.modalOptions.chkItems.DeliveryAddress'),
							isChecked: false
						}],
					isDeliveryDate: false,
					isDeliveryAddress: false,
					isCancelPO: false,
					text: {
						closeButtonText: $translate.instant('basics.common.button.close'),
						actionButtonText: $translate.instant('basics.common.button.ok'),
						runingMessage: $translate.instant('basics.common.poChange.workflowRunning'),
					},
					headerText: $scope.options.headerText
				};

				$scope.modalOptions.setAction = function (value) {
					angular.forEach($scope.modalOptions.chkItems, function (item) {
						if (item.value === value) {
							item.isChecked = item.isChecked !== true;
						}

						/* Change Delivery Date */
						if (item.value === '1' && item.isChecked) {
							$scope.modalOptions.isDeliveryDate = true;
							$scope.options.currentContract.isChangeDate = true;
						}

						/* Change Delivery Address */
						if (item.value === '2' && !item.isChecked) {
							$scope.modalOptions.isDeliveryAddress = true;
							$scope.options.currentContract.isChangeAddress = true;
						}
					});
				};

				/* function translateNumber(count) {
					return count.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
				} */

				var changeOrderItemsFormConfig = {
					showGrouping: true,
					groups: [{
						gid: 'cPOChange',
						header: $translate.instant('procurement.common.item.prcItemContainerGridTitle'),
						header$tr$: $translate.instant('procurement.common.item.prcItemContainerGridTitle'),
						isOpen: true,
						visible: true,
						readonly: false,
						sortOrder: 1
					}],
					rows: [{
						gid: 'cPOChange',
						model: 'itemDataService',
						type: 'directive',
						directive: 'prc-order-change-items-lookup',
						visible: true, sortOrder: 1
					}]
				};

				var changeOrderDeliverySchedulesFormConfig = {
					showGrouping: true,
					groups: [{
						gid: 'cPOChangeDelivery',
						header: $translate.instant('procurement.common.delivery.deliveryScheduleContainerGridTitle'),
						header$tr$: $translate.instant('procurement.common.delivery.deliveryScheduleContainerGridTitle'),
						isOpen: true,
						visible: true,
						readonly: false,
						sortOrder: 1
					}],
					rows: [{
						gid: 'cPOChangeDelivery',
						type: 'directive',
						directive: 'prc-order-change-delivery-schedules-lookup',
						visible: true, sortOrder: 1
					}]
				};

				function validateChange() {
					var canContinueObj = {canContinue: true};
					var itemDataService = $scope.options.itemDataService;
					if (itemDataService && itemDataService.getList().length > 0) {
						var hasChangeCountry = false;
						var itemNoList = [];
						angular.forEach(itemDataService.getList(), function (item) {
							if(item.Address !== null && item.NewAddress !== null){
								if(item.Address.CountryFk !== item.NewAddress.CountryFk){
									hasChangeCountry = true;
									itemNoList.push(item.Itemno);
								}
							}
						});

						var content='';
						if(hasChangeCountry){
							angular.forEach(itemNoList, function (itemNumber) {
								content += itemNumber + ', ';
							});

							$.extend(canContinueObj, {
								canContinue: false,
								msg: $translate.instant('procurement.contract.wizard.poChange.errorMsg.DeliveryAddressCountryMeg') + content
							});
						}

						var hasChangeAny = procurementOrderChangeService.checkHasChangeAnything($scope.options);
						if(!hasChangeAny){
							$.extend(canContinueObj, {
								canContinue: false,
								msg: $translate.instant('procurement.contract.wizard.poChange.errorMsg.NotAnythingChange')
							});
						}
					}

					return canContinueObj;
				}

				$scope.modalOptions.changeOrderItemsContainerOptions = {};
				$scope.modalOptions.changeOrderItemsContainerOptions.formOptions = {
					configure: changeOrderItemsFormConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.modalOptions.changeOrderDeliverySchedulesContainerOptions = {};
				$scope.modalOptions.changeOrderDeliverySchedulesContainerOptions.formOptions = {
					configure: changeOrderDeliverySchedulesFormConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.modalOptions.ok = function onOK() {
					$scope.$emit('updateRequested');
					var validateResult = validateChange();
					if (!validateResult.canContinue) {
						if (validateResult.msg === undefined) {
							$.extend(modalOptionsInfo, {bodyText: $translate.instant('basics.common.poChange.controller.modalInfo.bodyTextKey')});
						}
						else {
							$.extend(modalOptionsInfo, {bodyText: validateResult.msg});
						}
						platformDialogService.showDialog(modalOptionsInfo);
						return;
					}

					platformDialogService.showDialog(modalOptionsQuestion).then(function (result) {
						if (!result || result.no) {
							return;
						}
						else {
							$scope.isRuingWorkFlow = true;
							procurementOrderChangeService.changePurchaseOrder($scope.options)
								.then(function (result) {
									if (result.changed) {
										$scope.$close(result);
									}
								});
						}
					});
				};

				$scope.modalOptions.close = function onCancel() {
					$scope.$dismiss({yes: false});
				};
				$scope.modalOptions.cancel = $scope.modalOptions.close;

			}]);
})(angular);
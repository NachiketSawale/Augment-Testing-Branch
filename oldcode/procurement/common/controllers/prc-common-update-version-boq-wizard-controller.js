/**
 * Created by miu on 11/19/2021.
 */
(function (angular) {
	'use strict';

	angular.module('procurement.common').controller('prcCommonUpdateVersionBoqWizardController',
		['$scope', '$translate', 'platformModalService', 'procurementCommonUpdateVersionBoqService',
			function ($scope, $translate, platformModalService, updateVersionBoqService) {
				$scope.modalOptions = {
					isDisableUpdate: checkUpdateDisable,
					updateBtnText: 'Update',
					cancelBtnText: 'Cancel',
					selectBaseBoQ: $translate.instant('procurement.common.wizard.updateVersionBoQ.selectBaseBoQ'),
					updateOption: $translate.instant('procurement.common.wizard.updateVersionBoQ.updateOption'),
					targetModule: $translate.instant('procurement.common.wizard.updateVersionBoQ.targetModule'),
					updateMode: $translate.instant('procurement.common.wizard.updateVersionBoQ.updateMode'),
					updateAllFields: $translate.instant('procurement.common.wizard.updateVersionBoQ.updateAllFields'),
					updatePartialFields: $translate.instant('procurement.common.wizard.updateVersionBoQ.updatePartialFields'),
					note: $translate.instant('procurement.common.wizard.updateVersionBoQ.note'),
					note1: $translate.instant('procurement.common.wizard.updateVersionBoQ.note1'),
					note2: $translate.instant('procurement.common.wizard.updateVersionBoQ.note2'),
					note3: $translate.instant('procurement.common.wizard.updateVersionBoQ.note3'),
					headerText: $translate.instant('procurement.common.wizard.updateVersionBoQ.dialogTitle'),
					isLoading: false
				};

				let formOptions = {
					fid: 'procurement.pricecomparison.create.contract.wizard',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'updateVersionBoq.common.wizard',
							header: '',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: 'updateVersionBoq.common.wizard',
							label: '',
							rid: '1',
							type: 'directive',
							directive: 'prc-common-wizard-update-version-boq-header-list-directive'
						}
					]
				};

				$scope.containerOptions = {
					formOptions: {
						configure: formOptions
					}
				};

				/* boq item columns */
				$scope.updateModeOption = {
					columnModels: null,
					selectedColumns: []
				};

				/* target module */
				$scope.targetRequisition = false;
				$scope.targetQuotation = false;
				$scope.targetContract = false;
				$scope.targetPes = false;
				$scope.onTargetRequisition = function () {
					$scope.targetRequisition = !$scope.targetRequisition;
				};
				$scope.onTargetQuotation = function () {
					$scope.targetQuotation = !$scope.targetQuotation;
				};
				$scope.onTargetContract = function () {
					$scope.targetContract = !$scope.targetContract;
				};
				$scope.onTargetPes = function () {
					$scope.targetPes = !$scope.targetPes;
				};
				/* update mode */
				$scope.updateAllFields = true;
				$scope.onUpdateAllFields = function () {
					$scope.updateAllFields = !$scope.updateAllFields;
					if ($scope.updateAllFields && $scope.updatePartialFields) {
						$scope.updatePartialFields = false;
					}
				};
				$scope.updatePartialFields = false;
				$scope.onUpdatePartialFields = function () {
					$scope.updatePartialFields = !$scope.updatePartialFields;
					if ($scope.updateAllFields && $scope.updatePartialFields) {
						$scope.updateAllFields = false;
					}
				};
				$scope.isUpdateAllFields = function () {
					return $scope.updateAllFields;
				};
				$scope.isUpdatePartialFields = function () {
					return $scope.updatePartialFields;
				};

				function checkUpdateDisable() {
					let isDisable = true;
					let selectBoqHeader = updateVersionBoqService.boqHeaders();
					let targetModules = $scope.targetRequisition || $scope.targetQuotation || $scope.targetContract || $scope.targetPes;
					let updateMode = $scope.updateAllFields || $scope.updatePartialFields;
					if (selectBoqHeader.length > 0 && targetModules && updateMode) {
						isDisable = false;
						if ($scope.updatePartialFields){
							if ($scope.updateModeOption.selectedColumns.length === 0){
								isDisable = true;
							}
						}
					}
					return isDisable;
				}

				let formData = {};

				function doUpdate() {
					$scope.modalOptions.isLoading = true;
					buildFormData();
					var validateResult = updateVersionBoqService.validateForm(formData);
					if (!validateResult.result) {
						let msgBoxTitle = $translate.instant('procurement.common.wizard.updateVersionBoQ.warningTitle');
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateVersionBoQ.' + validateResult.message), msgBoxTitle, 'warning');
					} else {
						let updatePromise = updateVersionBoqService.doUpdate(formData);
						updatePromise.then(function (data){
							closeDialog();
							// let msgBoxTitle = $translate.instant('procurement.common.wizard.updateVersionBoQ.warningTitle');
							// platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateVersionBoQ.successMsg'), msgBoxTitle, 'info');
							updateVersionBoqService.showUpdateResultDialog(data);
						}, function (){
							closeDialog();
							let msgBoxTitle = $translate.instant('procurement.common.wizard.updateVersionBoQ.warningTitle');
							platformModalService.showMsgBox('Update failed', msgBoxTitle, 'warning');
						});
					}
				}

				function buildFormData() {
					formData.selectBoqHeaders = updateVersionBoqService.boqHeaders();
					let targetModule = [];
					if ($scope.targetRequisition) {
						targetModule.push('requisition');
					}
					if ($scope.targetQuotation) {
						targetModule.push('quotation');
					}
					if ($scope.targetContract) {
						targetModule.push('contract');
					}
					if ($scope.targetPes) {
						targetModule.push('pes');
					}
					formData.targetModules = targetModule;

					if ($scope.updatePartialFields) {
						formData.updateMode = updateVersionBoqService.updateMode.updatePartialFields;
						formData.updateFields = $scope.updateModeOption.selectedColumns;
					} else {
						formData.updateMode = updateVersionBoqService.updateMode.updateAllFields;
						formData.updateFields = [];
					}
				}

				function closeDialog() {
					$scope.modalOptions.isLoading = false;
					$scope.updateModeOption.selectedColumns=[];
					updateVersionBoqService.boqHeaders([]);
					$scope.$close(true);
				}

				angular.extend($scope.modalOptions, {
					onUpdate: function () {
						doUpdate();
					},
					cancel: function () {
						closeDialog();
					}
				});

				$scope.$on('$destroy', function () {
				});
			}]);
})(angular);
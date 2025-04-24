(function (angular) {
	'use strict';

	angular.module('basics.common').controller('basicsCommonUpdateCashFlowProjectionDialogController',
		['$scope', '$translate', 'basicsCommonCashFlowProjectionWizardValidationService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'platformModalService', '_',
			function ($scope, $translate, validationService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService, platformModalService, _) {

				$scope.options = $scope.$parent.modalOptions;

				// init current item.
				$scope.currentItem = getInitValue();

				function getDefaultValue() {
					return {
						CashProjectionFk: $scope.options.defaultValue.CashProjectionFk || $scope.options.CashProjectionFk || null,
						ScurveFk: $scope.options.defaultValue.ScurveFk || $scope.options.ScurveFk || null,
						TotalCost: $scope.options.defaultValue.TotalCost || $scope.options.TotalCost || null,
						StartWork: $scope.options.defaultValue.StartWork || $scope.options.StartWork || null,
						EndWork: $scope.options.defaultValue.EndWork || $scope.options.EndWork || null,
						OnlyLinearAdjustment: !!$scope.options.OnlyLinearAdjustment || false
					};
				}

				function getInitValue() {
					return {
						CashProjectionFk: $scope.options.CashProjectionFk || null,
						ScurveFk: $scope.options.ScurveFk || null,
						TotalCost: $scope.options.TotalCost || null,
						StartWork: $scope.options.StartWork || null,
						EndWork: $scope.options.EndWork || null,
						OnlyLinearAdjustment: !!$scope.options.OnlyLinearAdjustment || false
					};
				}

				$scope.options.headerText = $translate.instant('basics.common.updateCashFlowProjection.headerText');
				$scope.options.refreshBtnText = $translate.instant('basics.common.updateCashFlowProjection.refreshBtnText');

				const formConfig = {
					'fid': 'updatecashflow',
					'version': '1.0.0',     // if same version setting can be reused, otherwise discard settings
					'showGrouping': false,
					'groups': [
						{
							'gid': 'basicData',
							'header$tr$': 'basics.common.updateCashFlowProjection.headerText',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'scurvefk',
							'gid': 'basicData',
							'label$tr$': $translate.instant('basics.common.updateCashFlowProjection.sCurve'),
							'label': $translate.instant('basics.common.updateCashFlowProjection.sCurve'),
							'type': 'directive',
							'model': 'ScurveFk',
							'validator': validationService.validateScurveFk,
							'directive': 'basics-lookupdata-scurve-combobox',
							'options': {
								'lookupDirective': 'basics-lookupdata-scurve-combobox',
								'descriptionMember': 'DescriptionInfo.Description',
								'lookupOptions': {showClearButton: true}
							}
						},
						{
							'rid': 'totalcost',
							'gid': 'basicData',
							'label$tr$': $translate.instant('basics.common.updateCashFlowProjection.totalCost'),
							'label': $translate.instant('basics.common.updateCashFlowProjection.totalCost'),
							'type': 'directive',
							'model': 'TotalCost',
							'validator': validationService.validateTotalCost,
							'directive': 'basics-common-total-cost-composite',
							'options': {
								'lookupDirective': $scope.options.totalsLookupDirective,
								'descriptionMember': 'ValueNetOc'
							}
						},
						{
							'rid': 'startwork',
							'gid': 'basicData',
							'label$tr$': $translate.instant('basics.common.updateCashFlowProjection.startDate'),
							'label': $translate.instant('basics.common.updateCashFlowProjection.startDate'),
							'type': 'dateutc',
							'model': 'StartWork',
							'validator': validationService.validateStartWork
						}, {
							'rid': 'endwork',
							'gid': 'basicData',
							'label$tr$': $translate.instant('basics.common.updateCashFlowProjection.endDate'),
							'label': $translate.instant('basics.common.updateCashFlowProjection.endDate'),
							'type': 'dateutc',
							'model': 'EndWork',
							'validator': validationService.validateEndWork
						}, {
							'rid': 'onlylinearadjustment',
							'gid': 'basicData',
							'label$tr$': $translate.instant('basics.common.updateCashFlowProjection.onlyLinearAdjustment'),
							'label': $translate.instant('basics.common.updateCashFlowProjection.onlyLinearAdjustment'),
							'model': 'OnlyLinearAdjustment',
							'type': 'boolean'
						}
					]
				};

				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};
				angular.extend($scope.options, {
					onRefresh: function () {
						$scope.currentItem = getDefaultValue();
					},
					onOK: function () {
						const item = $scope.currentItem;
						const okResult = {
							Ok: true,
							data: item
						};

						// null validation
						if (!item.ScurveFk) {
							platformRuntimeDataService.applyValidationResult(validationService.validateScurveFk(item, item.ScurveFk, 'ScurveFk'), item, 'ScurveFk');
							return;
						}
						if (!item.TotalCost || item.TotalCost === 0) {
							platformRuntimeDataService.applyValidationResult(validationService.validateTotalCost(item, item.TotalCost), item, 'TotalCost');
							return;
						}
						if (!item.StartWork) {
							platformRuntimeDataService.applyValidationResult(validationService.validateStartWork(item, item.StartWork), item, 'StartWork');
							return;
						}
						if (!item.EndWork) {
							platformRuntimeDataService.applyValidationResult(validationService.validateEndWork(item, item.EndWork), item, 'EndWork');
							return;
						}

						if (!item.CashProjectionFk) {
							$scope.$close(okResult);
							return;
						}
						basicsLookupdataLookupDescriptorService.getItemByIdSync(item.CashProjectionFk, {lookupType: 'CashProjection'});
						const initValueObject = getInitValue();
						const isScurveChanged = !_.isEqual(initValueObject.ScurveFk, item.ScurveFk);
						const isStartDateChanged = !_.isEqual(initValueObject.StartWork, item.StartWork);
						const isEndDateChanged = !_.isEqual(initValueObject.EndWork, item.EndWork);
						if (isScurveChanged || isStartDateChanged || isEndDateChanged) {
							platformModalService.showYesNoDialog('basics.common.updateCashFlowProjection.deleteAndRecreateText', 'basics.common.updateCashFlowProjection.headerText', 'no')
								.then(function (result) {
									if (result.yes) {
										$scope.$close(okResult);
									}
								});
							return;
						}
						$scope.$close(okResult);
					},
					onCancel: function () {
						$scope.$close();
					}
				});

			}]);
})(angular);
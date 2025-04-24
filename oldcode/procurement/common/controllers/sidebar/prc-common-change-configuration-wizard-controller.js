/**
 * Created by lcn on 8/29/2018.
 */
(function () {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).constant('procurementCommonHeaderTextAction', {
		none: 0,
		merge: 1,
		override: 2
	});

	angular.module(moduleName).controller('ProcurementCommonChangeConfigurationController',
		['$q', '$scope', '$translate', '$injector', 'basicsLookupdataLookupFilterService',
			'basicsLookupdataLookupDescriptorService', 'procurementCommonCodeHelperService', 'platformRuntimeDataService', '$http', 'procurementContextService', '$timeout', 'procurementCommonHeaderTextAction',
			function ($q, $scope, $translate, $injector, basicsLookupdataLookupFilterService,
				basicsLookupdataLookupDescriptorService, codeHelperService, platformRuntimeDataService, $http, procurementContextService, $timeout, procurementCommonHeaderTextAction) {
				$scope.options = $scope.$parent.modalOptions;
				// init current item.
				$scope.currentItem = {
					PrcConfigurationFk: $scope.options.currentItem.ConfigurationFk || $scope.options.currentItem.PrcConfigurationFk || $scope.options.currentItem.PrcHeaderEntity.ConfigurationFk,
					BillingSchemaFk: $scope.options.currentItem.BillingSchemaFk,
					RubricCategoryFk: $scope.options.currentItem.RubricCategoryFk
				};
				var currentCode = $scope.options.currentCode;

				$scope.disableOK = function () {
					var currentItem = $scope.currentItem;
					return !((!!currentItem) && (!!currentItem.PrcConfigurationFk) && (!!currentItem.BillingSchemaFk));
				};
				// validationConfig($scope.currentItem.PrcConfigurationFk);
				/* function validationConfig(entity, value, model) {

					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					var RubricCategoryFk = config.RubricCategoryFk;
					var validateResult = {apply: true, valid: true};
					var moduleName = procurementContextService.getModuleName();
					if (moduleName !== "procurement.contract" && moduleName !== "procurement.package" && moduleName !== "procurement.requisition"&& moduleName !== "procurement.rfq") {
						codeHelperService.getNext(RubricCategoryFk).then(function (nextCode) {
							if (!nextCode) {
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.common.wizard.change.configuration.cantGenerateCode', {object: model});
								platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
							}
						}, function () {
						});
					}

					return validateResult;
				} */
				var getDefaultBillingSchemas = function (prcConfigurationFk) {
					return $http.get(globals.webApiBaseUrl + 'procurement/common/configuration/defaultbillingschemas?configurationFk=' +
						prcConfigurationFk);
				};

				var options =
					{
						showGrouping: false,
						groups: [
							{
								gid: '1',
								header: '',
								header$tr$: '',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							{
								gid: '1',
								rid: 'prcConfigurationFk',
								label: $translate.instant('procurement.common.wizard.change.configuration.name'),
								type: 'directive',
								model: 'PrcConfigurationFk',
								directive: 'basics-configuration-configuration-combobox',
								visible: true,
								sortOrder: 1,
								width: 150,
								options: {
									showClearButton: false,
									filterKey: 'dialog-prc-common-configuration-filter'
								},
								validator: function (entity, value/* , model */) {
									// validationConfig(entity, value, model);modify configuration by wizard, the code should not regenrated
									if (currentCode.isExistBillingSchema) {
										getDefaultBillingSchemas(value).then(function (response) {
											if (angular.isArray(response.data) && response.data.length) {
												var items = response.data;
												var target = _.find(items, {Id: entity.BillingSchemaFk});

												if (!target) { // if current billing schema is not exist in current procurement configuration context
													target = items[0];
													basicsLookupdataLookupDescriptorService.updateData('BillingSchema', target);
													entity.BillingSchemaFk = target.Id;
												}
											} else {
												entity.BillingSchemaFk = null;
											}
										});
									}
								}
							},
							{
								gid: '1',
								rid: 'billingSchemaFk',
								label: $translate.instant('cloud.common.entityBillingSchema'),
								type: 'directive',
								model: 'BillingSchemaFk',
								directive: 'procurement-configuration-billing-schema-combobox',
								visible: currentCode.isExistBillingSchema,
								sortOrder: 1,
								width: 150,
								options: {
									showClearButton: false,
									filterKey: 'dialog-prc-common-billing-schema-filter'
								}
							}
						]
					};

				$scope.step = 0;

				// $scope.isOkDisabled = true;
				$scope.modalTitle = $translate.instant('procurement.common.wizard.change.configuration.headerText', {code: currentCode.supName});
				$scope.modalOptions.headerText = $scope.modalTitle;

				$scope.configureOptions = {
					configure: options
				};

				var prcConfigurationFk = $scope.currentItem.PrcConfigurationFk;

				$scope.onOk = function () {
					if ($scope.step === 0) {
						if ($scope.currentItem.PrcConfigurationFk !== prcConfigurationFk && currentCode.isUpdateHeaderTexts) {
							$scope.step = 1;
						} else {
							$scope.modalOptions.ok();
						}
					} else {
						var header = $scope.options.currentItem;
						header.BlobAction = procurementCommonHeaderTextAction.override;
						$scope.modalOptions.ok();
					}
				};

				$scope.onCancel = function () {
					if ($scope.step === 0) {
						$scope.modalOptions.cancel();
					} else {
						var header = $scope.options.currentItem;
						header.BlobAction = procurementCommonHeaderTextAction.merge;
						$scope.modalOptions.ok();
					}
				};

				$scope.enableOK = function () {
					const isCurrentValuesUnchanged =
						($scope.currentItem.PrcConfigurationFk === prcConfigurationFk) &&
						($scope.currentItem.BillingSchemaFk === $scope.options.currentItem.BillingSchemaFk);
					return isCurrentValuesUnchanged || !!$scope.isLoading;
				};

				$scope.modalOptions.ok = function onOK() {
					$scope.isLoading = true;
					let parentValidationService = $scope.options.parentValidationService;
					let parentService = $scope.options.parentService;
					let header = $scope.options.currentItem;
					let currentItem = $scope.currentItem;

					if (currentCode.serverSide) {
						return $http.post(globals.webApiBaseUrl + 'procurement/common/configuration/change', {
							MainItemId: header.Id,
							PrcConfigurationFk: currentItem.PrcConfigurationFk,
							BillingSchemaFk: currentItem.BillingSchemaFk,
							Qualifier: currentCode.qualifier
						}).then((response) => {
							let changeResult = response.data;
							let needsRefresh = currentCode.autoRefresh && (changeResult.IsBillingSchemaChanged || changeResult.IsConfigurationChanged);
							let processResult = changeResult.IsSuccess && needsRefresh ? parentService.refresh() : $q.when([]);
							processResult.then(() => {
								$scope.$parent.$close({ok: changeResult.IsSuccess, data: changeResult});
							});
						}).finally(() => {
							$scope.isLoading = false;
							$scope.$parent.$close(false);
						});
					}

					parentValidationService.asyncSetPrcConfigFkAndBillingSchemaFkForWizard(header, currentItem.PrcConfigurationFk, currentItem.BillingSchemaFk).then(function () {
						$timeout(function () {
							parentService.update().then(function () {
								$scope.isLoading = false;
								$scope.$parent.$close(false);
								parentService.gridRefresh();
							/* refreshSelectedEntities will cause header use cach data
								if (parentService.refreshSelectedEntities()) {
									parentService.refreshSelectedEntities();
								} else {
									parentService.gridRefresh();
								}
							*/
								if (parentService.configurationChanged) {
									parentService.configurationChanged.fire();
								}
							});
						}, 1000);

					});
				};

				$scope.close = function () {
					$scope.$parent.$close(false);
				};
				$scope.modalOptions.cancel = $scope.close;

				var filters = [
					{
						key: 'dialog-prc-common-billing-schema-filter',
						serverSide: true,
						fn: function (currentItem) {
							var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcConfigurationFk});
							return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
						}

					},
					{
						key: 'dialog-prc-common-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + currentCode.rubricFk;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);
				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});
			}
		]);
})(angular);

/**
 * Created by jim on 8/31/2017.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.invoice';
	angular.module(moduleName).controller('invoiceHeaderChangeProcurementConfigurationWizardController',
		['$scope', '$translate', 'invoiceHeaderElementValidationService', 'basicsLookupdataLookupFilterService', 'procurementContextService',
			'basicsLookupdataLookupDescriptorService', 'procurementInvoiceHeaderDataService', 'procurementCommonCodeHelperService', 'platformRuntimeDataService', '$timeout', '$http',
			function ($scope, $translate, invoiceHeaderElementValidationService, basicsLookupdataLookupFilterService, procurementContextService,
				basicsLookupdataLookupDescriptorService, procurementInvoiceHeaderDataService, codeHelperService, platformRuntimeDataService, $timeout, $http) {
				$scope.options = $scope.$parent.modalOptions;
				// init current item.
				$scope.currentItem = {
					PrcConfigurationFk: $scope.options.currentItem.PrcConfigurationFk,
					BillingSchemaFk: $scope.options.currentItem.BillingSchemaFk,
					RubricCategoryFk: $scope.options.currentItem.RubricCategoryFk,
					InvTypeFk: $scope.options.currentItem.InvTypeFk
				};

				$scope.disableOK = function () {
					var currentInvoice = $scope.currentItem;
					return !((!!currentInvoice) && (!!currentInvoice.PrcConfigurationFk) && (!!currentInvoice.BillingSchemaFk));
				};
				// validationConfig($scope.currentItem.PrcConfigurationFk);
				/* function validationConfig(entity,value,model){
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					var RubricCategoryFk=config.RubricCategoryFk;
					var validateResult = {apply: true, valid: true};
					var headerSelectedCode = procurementInvoiceHeaderDataService.getSelected();
					if (headerSelectedCode && !headerSelectedCode.Code) {
						codeHelperService.getNext(RubricCategoryFk).then(function (nextCode) {
							if (!nextCode) {
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.invoice.wizard.change.configuration.cantGenerateCode', {object: model});
								platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
							}
						}, function () {
						});
					}
					return validateResult;
				} */

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
								label: $translate.instant('procurement.invoice.header.configuration'),
								type: 'directive',
								model: 'PrcConfigurationFk',
								directive: 'basics-configuration-configuration-combobox',
								visible: true,
								sortOrder: 1,
								width: 150,
								options: {
									showClearButton: false,
									filterKey: 'dialog-prc-invoice-configuration-filter'
								},
								validator: function (entity, value/* ,model */) {
									// according the ALM(94635) not need to validate config
									// validationConfig(entity,value,model);
									invoiceHeaderElementValidationService.getDefaultBillingSchemas(value).then(function (response) {
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
							},
							{
								gid: '1',
								rid: 'billingSchemaFk',
								label: $translate.instant('cloud.common.entityBillingSchema'),
								type: 'directive',
								model: 'BillingSchemaFk',
								directive: 'procurement-configuration-billing-schema-combobox',
								visible: true,
								sortOrder: 1,
								width: 150,
								options: {
									showClearButton: false,
									filterKey: 'dialog-prc-invoice-billing-schema-filter'
								}
							}
						]
					};

				// $scope.isOkDisabled = true;
				$scope.modalTitle = $translate.instant('procurement.invoice.wizard.change.configuration.headerText');
				$scope.modalOptions.headerText = $scope.modalTitle;

				$scope.configureOptions = {
					configure: options
				};

				function reLoadInvoiceHeaderAndReconciliation() {
					var invoiceHeader = procurementInvoiceHeaderDataService.getSelected();
					var invoiceId = invoiceHeader.Id;
					var BpdVatGroupFk = invoiceHeader.BpdVatGroupFk;
					var billingSchemaFk = $scope.currentItem.BillingSchemaFk;
					$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/changeByConfiguration?invoiceHeaderId=' + invoiceId + '&bpdVatGroupFk=' + BpdVatGroupFk + '&billingSchemaFk=' + billingSchemaFk).then(function (res) {
						if (null !== res.data) {
							var entity = res.data;
							var currrentinvoiceHeader = procurementInvoiceHeaderDataService.getSelected();
							currrentinvoiceHeader.AmountNetPes = entity.AmountNetPes;
							currrentinvoiceHeader.AmountNetPesOc = entity.AmountNetPesOc;
							currrentinvoiceHeader.AmountVatPes = entity.AmountVatPes;
							currrentinvoiceHeader.AmountVatPesOc = entity.AmountVatPesOc;
							procurementInvoiceHeaderDataService.update().then(function () {
								$scope.isLoading = false;
								$scope.$parent.$close(false);
								procurementInvoiceHeaderDataService.gridRefresh();
							});
						}
					});
				}

				$scope.enableOK = function () {
					const isCurrentValuesUnchanged =
						($scope.currentItem.PrcConfigurationFk === $scope.options.currentItem.PrcConfigurationFk) &&
						($scope.currentItem.BillingSchemaFk === $scope.options.currentItem.BillingSchemaFk);
					return isCurrentValuesUnchanged || !!$scope.isLoading;
				};

				$scope.modalOptions.ok = async function onOK() {
					try {
						$scope.isLoading = true;
						await procurementInvoiceHeaderDataService.update();
						const config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'),
							{Id: $scope.currentItem.PrcConfigurationFk});
						let invTypeFk = undefined;
						if ($scope.currentItem.RubricCategoryFk !== config.RubricCategoryFk) {
							const response = await $http.get(globals.webApiBaseUrl + 'procurement/invoice/header/defaultrubriccategory?invTypeFk=' + $scope.currentItem.InvTypeFk +
								'&repalceRubricCategoryFk=' + config.RubricCategoryFk);
							invTypeFk = response.data.invTypeFk;
						}

						await invoiceHeaderElementValidationService.asyncSetPrcConfigFkAndBillingSchemaFkForWizard($scope.options.currentInvoice, $scope.currentItem.PrcConfigurationFk,
							$scope.currentItem.BillingSchemaFk, invTypeFk);
						await reLoadInvoiceHeaderAndReconciliation();

					} catch (error) {
						console.error('An error occurred:', error);
					} finally {
						$scope.isLoading = false;
						$scope.$parent.$close(false);
					}
				};

				$scope.close = function () {
					$scope.$parent.$close(false);
				};
				$scope.modalOptions.cancel = $scope.close;

				var filters = [
					{
						key: 'dialog-prc-invoice-billing-schema-filter',
						serverSide: true,
						fn: function (currentItem) {
							var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcConfigurationFk});
							return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
						}

					},
					{
						key: 'dialog-prc-invoice-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + procurementContextService.invoiceRubricFk;
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
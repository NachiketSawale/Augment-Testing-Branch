/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingCreateAccrualsWizardService',
		['_', 'moment', '$http', '$translate', '$injector', 'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'platformModalFormConfigService', 'platformContextService',
			function (_, moment, $http, $translate, $injector, platformTranslateService, platformSidebarWizardCommonTasksService, platformModalFormConfigService, platformContextService) {

				var service = {};

				service.showDialog = function showDialog() {
					var title = 'sales.billing.createAccrualsWizardTitle';

					var previousMonthEnd = moment().subtract(1, 'month').endOf('month');
					var dataItem = {
						TransactionTypeId: 11,
						AccrualMode: 2,
						EffectiveDate: previousMonthEnd,  // defaults to previous month end
						VoucherNo: '',
						PostingDate: previousMonthEnd,    // defaults to effective date
						Description: 'Bill Accruals',
						CommentText: ''
					};

					// number range config available?
					$http.get(globals.webApiBaseUrl + 'sales/billing/accrual/hastocreatevoucherno').then(function (response) {
						var hasToBeCreated = response.data;
						var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
						platformRuntimeDataService.readonly(dataItem, [{field: 'VoucherNo', readonly: hasToBeCreated}]);
						dataItem.VoucherNo = hasToBeCreated ? $translate.instant('sales.common.isGenerated') : '';
					});

					function translate(properties) {
						var prop2TransId = {
							ControllingUnitFk: 'sales.common.entityControllingUnitFk',
							PrcStructureFk: 'basics.common.entityPrcStructureFk',
							TaxCodeFk: 'sales.common.entityTaxCodeFk'
						};
						return _.map(properties, function (prop) { return $translate.instant(prop2TransId[prop]); });
					}

					function getErrorItems(resp) {
						var invalidBills = _.get(resp, 'data.invalidBillEntities');
						_.each(invalidBills, function (bill) {
							bill._invalidProps = [];
							_.each(['ControllingUnitFk', 'PrcStructureFk', 'TaxCodeFk'], function (prop) {
								if (bill[prop] === null) {
									bill._invalidProps.push(prop);
								}
							});
						});

						var i = 0;
						return _.map(invalidBills, function (bill) {
							var errorMsg = 'Cannot evaluate ' + _.join(translate(bill._invalidProps), ' '+ $translate.instant('cloud.common.conjunctionAnd') + ' ') + '.';
							return {
								Id: ++i,
								BillNo: bill.BillNo,
								DescriptionInfo: bill.DescriptionInfo,
								ErrorMsg: errorMsg
							};
						});
					}

					// <editor-fold desc="[definition of filters]">
					var filters = [{
						key: 'sales-billing-accrualmode-type',
						fn: function (accrualmode) {
							return (_.has(accrualmode, 'Id') && _.get(accrualmode, 'Id') !== 1); // we skip mode 1, because not support yet (see alm 122967)
						}
					},{
						key: 'basics-company-companyyear-filter',
						serverSide: true,
						fn: function () {
							return 'CompanyFk=' + platformContextService.getContext().clientId;
						}
					}, {
						key: 'basics-company-period-filter',
						serverSide: true,
						fn: function (item) {
							return 'CompanyYearFk=' + item.CompanyYearFk;
						}
						}];

					function registerFilters() {
						$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);
					}

					function unregisterFilters() {
						$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
					}
					// </editor-fold>

					registerFilters();

					var modalFormConfig = {
						title: $translate.instant(title),
						dataItem: dataItem,
						formConfiguration: {
							fid: 'sales.billing.CreateAccruals',
							version: '0.3.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['transactiontypeid', 'accrualmodeid', 'effectivedate', 'voucherno', 'postingdate', 'description', 'commenttext']
							}],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'transactiontypeid',
									label: 'Transaction Type',
									label$tr$: 'basics.customize.transactiontype',
									model: 'TransactionTypeId',
									type: 'directive',
									directive: 'basics-lookupdata-transaction-type-combobox',
									required: true,
									readonly: true,
									sortOrder: 1
								}, {
									gid: 'baseGroup',
									rid: 'accrualmodeid',
									label: 'Accrual Mode',
									label$tr$: 'sales.billing.accrualMode',
									model: 'AccrualMode',
									type: 'directive',
									directive: 'sales-billing-accrual-mode-combobox',
									required: true,
									sortOrder: 2,
									options: {
										filterKey: 'sales-billing-accrualmode-type'
									}
								},
								{
									gid: 'baseGroup',
									rid: 'companyyearfk',
									label: 'Company Year',
									label$tr$: 'sales.common.createAccrualsWizard.entityCompanyYear',
									type: 'directive',
									model: 'CompanyYearFk',
									directive: 'basics-company-year-lookup',
									visible: true,
									sortOrder: 3,
									required: true,
									options: {
										showClearButton: false,
										filterKey: 'basics-company-companyyear-filter',
										displayMember: 'TradingYear'
									},
									validator: function (/* entity, value, model */) {
										return true;
									}
								},
								{
									gid: 'baseGroup',
									rid: 'companyperiodfk',
									label: 'Company Period',
									label$tr$: 'sales.common.createAccrualsWizard.entityCompanyPeriod',
									type: 'directive',
									model: 'CompanyPeriodFk',
									directive: 'basics-company-company-period-lookup',
									visible: true,
									sortOrder: 4,
									required: true,
									options: {
										showClearButton: false,
										filterKey: 'basics-company-period-filter',
										displayMember: 'TradingPeriod'
									},
									validator: function (entity, value, model) {
										if (value) {
											$injector.get('basicsLookupdataLookupDataService').getItemByKey('companyPeriod', value).then((companyPeriod) => {
												if (companyPeriod) {
													entity.EffectiveDate = moment(companyPeriod.EndDate);
													entity.PostingDate = moment(companyPeriod.EndDate);
												}
											});
										}
										return true;
									}
								},
								{
									gid: 'baseGroup',
									rid: 'effectivedate',
									label: 'Effective Date',
									label$tr$: 'basics.common.dateEffective',
									model: 'EffectiveDate',
									type: 'dateutc',
									sortOrder: 5,
									readonly: true
								}, {
									gid: 'baseGroup',
									rid: 'voucherno',
									label: 'VoucherNo',
									label$tr$: 'sales.wip.voucherNo', // TODO: reuse in sales common
									model: 'VoucherNo',
									type: 'code',
									required: true,
									sortOrder: 6
								}, {
									gid: 'baseGroup',
									rid: 'postingdate',
									label: 'Posting Date',
									label$tr$: 'cloud.common.entityPostingDate',
									model: 'PostingDate',
									type: 'dateutc',
									sortOrder: 7
								}, {
									gid: 'baseGroup',
									rid: 'description',
									label: 'Description',
									label$tr$: 'cloud.common.entityDescription',
									model: 'Description',
									type: 'description',
									sortOrder: 8
								}, {
									gid: 'baseGroup',
									rid: 'commentText',
									label: 'Comment',
									label$tr$: 'cloud.common.entityCommentText',
									model: 'CommentText',
									type: 'comment',
									sortOrder: 9
								}]
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								// TODO:
								return dataItem.Description.length <= 0 || dataItem.VoucherNo.length <= 0;
							}
						},
						handleCancel: function handleCancel() {
							unregisterFilters();
						},
						handleOK: function handleOK(/* result */) {
							unregisterFilters();
							$injector.get('salesBillingService').updateAndExecute(function () {
								var postData = dataItem;
								$http.post(globals.webApiBaseUrl + 'sales/billing/accrual/create', postData).then(
									function (response) {
										// any invalid bill entites?
										if (_.get(response, 'data.withErrors') || _.size(_.get(response, 'data.errors')) > 0) {

											// show dialog with error messages
											$injector.get('platformGridDialogService').showDialog({
												columns: [{
													id: 'billNo',
													name$tr$: 'sales.billing.entityBillNo',
													formatter: 'code',
													field: 'BillNo',
													width: 100
												}, {
													id: 'desc',
													name$tr$: 'cloud.common.entityDescription',
													formatter: 'translation',
													field: 'DescriptionInfo',
													width: 150
												}, {
													id: 'errormsg',
													name$tr$: 'cloud.common.errorMessage',
													formatter: 'remark',
													field: 'ErrorMsg',
													width: 400
												}],
												items: getErrorItems(response),
												idProperty: 'Id',
												headerText$tr$: 'sales.billing.createAccrualsWizardTitle',
												topDescription: {
													iconClass: 'tlb-icons ico-error',
													text: 'There are invalid Bill records:',
													// TODO: $translate()
													// text$tr$: 'sales.billing.*'
												},
												isReadOnly: true
											});
										} else if (_.get(response, 'data.withErrors') === false || _.get(response, 'data.noTransactions') === true) {
											var validationNumber = _.get(response, 'data.validationNumber');
											var period = _.get(response, 'data.period');
											var dialogService = $injector.get('platformDialogService');

											// TODO: reuse translations in sales common
											if (validationNumber === 1) {
												dialogService.showInfoBox('sales.wip.wizardCreateAccrualsNoPostingPeriod');
											} else if (validationNumber === 2) {
												dialogService.showInfoBox($translate.instant('sales.wip.wizardCreateAccrualsNotInPeriod', {period: period}));
											} else if (validationNumber === 3) {
												dialogService.showInfoBox($translate.instant('sales.wip.wizardCreateAccrualsPostingPeriodNotOpen', {period: period}));
											} else {
												dialogService.showInfoBox('sales.wip.wizardCreateAccrualsNoTransactionsGeneratedInfo');
											}
										} else {
											platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
										}
									},
									function (/* responseErr */) {
										// TODO:
									});
							});
						}
					};

					platformTranslateService.translateFormConfig(modalFormConfig.formConfiguration);
					platformModalFormConfigService.showDialog(modalFormConfig);
				};

				return service;
			}
		]);
})();

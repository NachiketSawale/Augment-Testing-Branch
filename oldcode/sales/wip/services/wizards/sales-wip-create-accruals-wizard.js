/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesWipCreateAccrualsWizardService',
		['_', 'moment', '$http', '$translate', '$injector', 'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'platformModalFormConfigService', 'salesWipValidationService', 'salesWipAccrualService', 'platformContextService',
			function (_, moment, $http, $translate, $injector, platformTranslateService, platformSidebarWizardCommonTasksService, platformModalFormConfigService, salesWipValidationService, salesWipAccrualService, platformContextService) {

				var service = {};

				service.showDialog = function showDialog() {
					var title = 'sales.wip.wizardCreateAccrualsTitle';

					// TODO: set default accrual mode as preselection (AccrualMode) => use basicsLookupdataLookupDataService?
					var previousMonthEnd = moment().subtract(1, 'month').endOf('month');
					var dataItem = {
						TransactionTypeId: 3,
						AccrualMode: 1,
						EffectiveDate: previousMonthEnd,  // defaults to previous month end
						VoucherNo: '',
						PostingDate: previousMonthEnd,    // defaults to effective date
						Description: 'WIP Accruals',
						CommentText: ''
					};

					// number range config available?
					$http.get(globals.webApiBaseUrl + 'sales/wip/accrual/hastocreatevoucherno').then(function (response) {
						var hasToBeCreated = response.data;
						var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
						platformRuntimeDataService.readonly(dataItem, [{field: 'VoucherNo', readonly: hasToBeCreated}]);
						dataItem.VoucherNo = hasToBeCreated ? $translate.instant('sales.common.isGenerated') : '';
					});

					function isValid() {
						if (dataItem.__rt$data.errors) {
							if (dataItem.__rt$data.errors.PostingDate) {
								return false;
							}
						}
						return _.isString(dataItem.Description) && dataItem.Description.length > 0
							&& _.isString(dataItem.VoucherNo) && dataItem.VoucherNo.length > 0;
					}

					function translate(properties) {
						var prop2TransId = {
							ControllingUnitFk: 'sales.common.entityControllingUnitFk',
							PrcStructureFk: 'basics.common.entityPrcStructureFk',
							TaxCodeFk: 'sales.common.entityTaxCodeFk'
						};
						return _.map(properties, function (prop) { return $translate.instant(prop2TransId[prop]); });
					}
				
					function getErrorItems(resp) {
						var invalidWips = _.get(resp, 'data.invalidWipEntities');
						_.each(invalidWips, function (wip) {
							wip._invalidProps = [];
							_.each(['ControllingUnitFk', 'PrcStructureFk', 'TaxCodeFk'], function (prop) {
								if (wip[prop] === null) {
									wip._invalidProps.push(prop);
								}
							});
						});

						var i = 0;
						return _.map(invalidWips, function (wip) {
							var errorMsg = 'Cannot evaluate ' + _.join(translate(wip._invalidProps), ' '+ $translate.instant('cloud.common.conjunctionAnd') + ' ') + '.';
							return {
								Id: ++i,
								Code: wip.Code,
								DescriptionInfo: wip.DescriptionInfo,
								ErrorMsg: errorMsg
							};
						});
					}
					var filters = [{
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
					$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);
					function unregisterFilters() {
						$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
					}
					var modalFormConfig = {
						title: $translate.instant(title),
						dataItem: dataItem,
						formConfiguration: {
							fid: 'sales.wip.CreateAccruals',
							version: '0.2.0',
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
									label$tr$: 'sales.wip.transactionType',
									model: 'TransactionTypeId',
									type: 'directive',
									directive: 'basics-lookupdata-transaction-type-combobox',
									required: true,
									readonly: true,
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'accrualmodeid',
									label: 'Accrual Mode',
									label$tr$: 'sales.wip.accrualMode',
									model: 'AccrualMode',
									type: 'directive',
									directive: 'sales-wip-accrual-mode-combobox',
									required: true,
									sortOrder: 2
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
									validator: function (entity, value) {
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
									required: true,
									sortOrder: 5,
									readonly: true
								},
								{
									gid: 'baseGroup',
									rid: 'voucherno',
									label: 'VoucherNo',
									label$tr$: 'sales.wip.voucherNo',
									model: 'VoucherNo',
									type: 'code',
									required: true,
									sortOrder: 6
								},
								{
									gid: 'baseGroup',
									rid: 'postingdate',
									label: 'Posting Date',
									label$tr$: 'cloud.common.entityPostingDate',
									model: 'PostingDate',
									type: 'dateutc',
									required: true,
									sortOrder: 7,
									asyncValidator: function asyncValidateDateForCompanyPeriod (entity, value, field) {
										// TODO: check salesWipService dependency (this validation is used in the wizard)
										return salesWipValidationService.asyncValidateDateForCompanyPeriod(entity, value, field, salesWipAccrualService);
									}
								}, {
									gid: 'baseGroup',
									rid: 'description',
									label: 'Description',
									label$tr$: 'cloud.common.entityDescription',
									model: 'Description',
									type: 'description',
									required: true,
									sortOrder: 6
								}, {
									gid: 'baseGroup',
									rid: 'commentText',
									label: 'Comment',
									label$tr$: 'cloud.common.entityCommentText',
									model: 'CommentText',
									type: 'comment',
									sortOrder: 7
								}]
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return !isValid();
							}
						},
						handleCancel: function handleCancel() {
							unregisterFilters();
						},
						handleOK: function handleOK(/* result */) {
							unregisterFilters();
							$injector.get('salesWipService').updateAndExecute(function () {
								var postData = dataItem;
								$http.post(globals.webApiBaseUrl + 'sales/wip/accrual/create', postData).then(
									function (response) {
										// any invalide wip entites?
										if (_.get(response, 'data.withErrors') || _.size(_.get(response, 'data.errors')) > 0) {

											// show dialog with error messages
											$injector.get('platformGridDialogService').showDialog({
												columns: [{
													id: 'code',
													name$tr$: 'cloud.common.entityCode',
													formatter: 'code',
													field: 'Code',
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
												headerText$tr$: 'sales.wip.wizardCreateAccrualsTitle',
												topDescription: {
													iconClass: 'tlb-icons ico-error',
													text: 'There are invalid WIP records:',
													// TODO: $translate()
													// text$tr$: 'sales.wip.*'
												},
												isReadOnly: true
											});
										} else if (_.get(response, 'data.withErrors') === false || _.get(response, 'data.noTransactions') === true) {
											var validationNumber = _.get(response, 'data.validationNumber');
											var period = _.get(response, 'data.period');
											var dialogService = $injector.get('platformDialogService');

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

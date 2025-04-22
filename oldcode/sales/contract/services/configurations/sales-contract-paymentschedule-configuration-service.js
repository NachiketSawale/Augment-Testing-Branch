(function () {
	'use strict';
	/* global $, _ */
	var moduleName = 'sales.contract',
		salesCommonModName = 'sales.common',
		prcCommonName = 'procurement.common',
		salesBillingModName = 'sales.billing';

	angular.module( moduleName ).factory('salesOnlyPaymentScheduleLayout', [
		'$translate',
		'basicsLookupdataConfigGenerator', function(
			$translate,
			basicsLookupdataConfigGenerator
		) {
			return {
				'groups': [{
					'gid': 'basicData',
					'attributes': ['descriptioninfo', 'code', 'biltypefk', 'ordpsstatusfk', 'bilheaderfk', 'actualamountnet', 'actualamountgross', 'actualamountnetoc', 'actualamountgrossoc', 'totalpayment', 'totalpaymentoc', 'paymentdifferencegross', 'paymentdifferencegrossoc', 'bilamountnet', 'bilamountgross', 'bilamountnetoc', 'bilamountgrossoc', 'paymentbalancenet', 'paymentbalancegross', 'isfinal', 'controllingunitfk', 'totalpercent']
				}],
				'translationInfos': {
					'extraModules': [salesCommonModName, salesBillingModName, prcCommonName],
					'extraWords': {
						Code: { location: prcCommonName, identifier: 'paymentCode', initial: 'Code' },
						BilTypeFk: {location: salesCommonModName, identifier: 'billingType', initial: 'Billing Type'},
						OrdPsStatusFk: {location: salesCommonModName, identifier: 'ordPsStatus', initial: 'Status'},
						BilHeaderFk:{ location: salesBillingModName, identifier: 'entityBillNo', initial: 'Bill No'},
						ActualAmountNet: {location: salesCommonModName, identifier: 'actualAmountNet', initial: 'Actual Amount Net'},
						ActualAmountGross:{ location: salesCommonModName, identifier: 'actualAmountGross', initial: 'Actual Amount Gross' },
						ActualAmountNetOc: {location: salesCommonModName, identifier: 'actualAmountNetOc', initial: 'Actual Amount Net Oc'},
						ActualAmountGrossOc:{ location: salesCommonModName, identifier: 'actualAmountGrossOc', initial: 'Actual Amount Gross Oc' },
						TotalPayment: {location: salesCommonModName, identifier: 'totalPayment', initial: 'Total Payment'},
						TotalPaymentOc:{ location: salesCommonModName, identifier: 'totalPaymentOc', initial: 'Total Payment Oc' },
						PaymentDifferenceGross: {location: salesCommonModName, identifier: 'paymentDifferenceGross', initial: 'Payment Difference Gross'},
						PaymentDifferenceGrossOc:{ location: salesCommonModName, identifier: 'paymentDifferenceGrossOc', initial: 'Payment Difference Gross Oc' },
						BilAmountNet: { location: salesCommonModName, identifier: 'bilAmountNet', initial: 'Bill Amount Net'},
						BilAmountGross: { location: salesCommonModName, identifier: 'bilAmountGross', initial: 'Bill Amount Gross' },
						BilAmountNetOc: { location: salesCommonModName, identifier: 'bilAmountNetOc', initial: 'Bill Amount Net Oc' },
						BilAmountGrossOc: { location: salesCommonModName, identifier: 'bilAmountGrossOc', initial: 'Bill Amount Gross Oc' },
						PaymentBalanceNet: { location: salesCommonModName, identifier: 'paymentBalanceNet', initial: 'Payment Balance Net' },
						PaymentBalanceGross: { location: salesCommonModName, identifier: 'paymentBalanceGross', initial: 'Payment Balance Gross' },
						IsFinal: {location: salesCommonModName, identifier: 'isFinal', initial: 'Is Final'},
						ControllingUnitFk: {location: salesCommonModName, identifier: 'entityControllingUnitFk', initial: 'Controlling Unit'},
						TotalPercent: {location: salesCommonModName, identifier: 'entityTotalPercent', initial: 'Group Percent'}
					}
				},
				'overloads': {
					'code': {
						'detail': {
							'model': 'Code',
							'type': 'directive',
							'directive': 'ord-payment-schedule-code-input'
						},
						'grid': {
							formatter: function (row, cell, value, columnDef, entity) {
								if (entity.IsFinal) {
									return ' ';
								}
								if (!value) {
									var emptyErrMsg = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.common.paymentCode')});
									return '<div class="invalid-cell" title="' + emptyErrMsg + '"></div>';
								}
								else if (_.has(entity, '__rt$data.errors.Code.error$tr$')) {
									var errMsg = $translate.instant(entity.__rt$data.errors.Code.error$tr$, {fieldName: $translate.instant('procurement.common.paymentCode')});
									return '<div class="invalid-cell" title="' + errMsg + '">'+value+'</div>';
								}
								return value;
							}
						}
					},
					'biltypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.billtype', null, {customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK', customBoolProperty: 'ISPROGRESS', customBoolProperty1: 'IS_PAYMENT_SCHEDULE', filterKey: 'sales-contract-ps-billing-type-filter'}),
					'ordpsstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.orderpaymentschedulesstatus', null, {
						showIcon: true
					}),
					'bilheaderfk': {
						navigator: {
							moduleName: 'sales.billing'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-common-bill-dialog-v2',
								lookupOptions: {
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}],
									filterKey: 'sales-contract-payment-schedule-billing-filter',
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesBillingV2',
								displayMember: 'BillNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								filterKey: 'sales-contract-payment-schedule-billing-filter',
								lookupDirective: 'sales-common-bill-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-contract-payment-schedule-billing-filter',
									'showClearButton': true
								}
							}
						}
					},
					'actualamountnet': {readonly: true,grid: {sortable: false}},
					'actualamountgross': {readonly: true,grid: {sortable: false}},
					'actualamountnetoc': {readonly: true,grid: {sortable: false}},
					'actualamountgrossoc': {readonly: true,grid: {sortable: false}},
					'paymentdifferencegross': {readonly: true,grid: {sortable: false}},
					'paymentdifferencegrossoc': {readonly: true,grid: {sortable: false}},
					'totalpayment': {readonly: true,grid: {sortable: false}},
					'totalpaymentoc': {readonly: true,grid: {sortable: false}},
					'bilamountnet': {readonly: true,grid: {sortable: false}},
					'bilamountgross': {readonly: true,grid: {sortable: false}},
					'bilamountnetoc': {readonly: true,grid: {sortable: false}},
					'bilamountgrossoc': {readonly: true,grid: {sortable: false}},
					'paymentbalancenet': {readonly: true,grid: {sortable: false}},
					'paymentbalancegross': {readonly: true,grid: {sortable: false}},
					'isfinal': {readonly: true,grid: {sortable: false}},
					'totalpercent': {grid: {sortable: false}}
				}
			};
		}]);

	angular.module( moduleName ).factory('salesOrdPaymentScheduleLayout', ['prcAndSalesCommonPaymentScheduleLayout', 'salesOnlyPaymentScheduleLayout', 'salesCommonLookupConfigsService', function(commonPaymentScheduleLayout, salesOnlyPaymentScheduleLayout, salesCommonLookupConfigsService) {
		var basicDataArray = commonPaymentScheduleLayout.groups[0].attributes.concat(salesOnlyPaymentScheduleLayout.groups[0].attributes);
		var code = _.remove(basicDataArray, function (c) { return c === 'code'; });
		basicDataArray.unshift(code[0]);
		var translationAddition = commonPaymentScheduleLayout.translationInfos.extraModules.concat(salesOnlyPaymentScheduleLayout.translationInfos.extraModules);
		var salesOrd = $.extend(true, {}, commonPaymentScheduleLayout, salesOnlyPaymentScheduleLayout);
		salesOrd.fid = 'sales.contract.paymentSchedule.detail';
		salesOrd.groups[0].attributes = basicDataArray;
		salesOrd.translationInfos.extraModules = translationAddition;
		salesCommonLookupConfigsService.addCommonLookupsToLayout(salesOrd);
		salesCommonLookupConfigsService.registerCommonFilters();
		return salesOrd;
	}]);

	angular.module(moduleName).factory('salesContractPaymentScheduleUIStandardService',
		['platformUIStandardConfigService', 'salesContractTranslationService',
			'salesOrdPaymentScheduleLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'OrdPaymentScheduleDto',
					moduleSubModule: 'Sales.Contract'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function (){
					return angular.copy(basicGetStandardConfigForDetailView());
				};
				return service;
			}
		]);
})();

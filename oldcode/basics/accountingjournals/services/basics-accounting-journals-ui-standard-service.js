/**
 * Created by jhe on 11/20/2018.
 */
(function () {
	/* global angular, moment */
	'use strict';
	var moduleName = 'basics.accountingjournals';
	/**
	 * @ngdoc service
	 * @name basicsRegionTypeUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of unit entities
	 */
	angular.module(moduleName).factory('basicsAccountingJournalsUIStandardService',

		['platformUIStandardConfigService', 'basicsAccountingJournalsTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
			'platformUIStandardExtentService', '$injector', 'platformObjectHelper',

			function (platformUIStandardConfigService, basicsAccountingJournalsTranslationService, platformSchemaService, basicsLookupdataConfigGenerator,
				platformUIStandardExtentService, $injector, platformObjectHelper) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.accountingJournals.accountingJournalsList',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['companyyearfk',
									'transactiontypefk', 'transactiontypeabbreviation',
									'description', 'postingdate', 'commenttext', 'returnvalue', 'issuccess', 'companytransheaderstatusfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							companyyearfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-company-year-lookup',
										lookupOptions: {
											filterKey: 'basics-company-companyyear-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {lookupType: 'companyyear', displayMember: 'TradingYear'}
								},
								detail: {
									type: 'directive',
									directive: 'basics-company-year-lookup',
									options: {
										filterKey: 'basics-company-companyyear-filter',
										showClearButton: true
									}
								}
							},
							transactiontypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transactiontype'),
							transactiontypeabbreviation: {readonly: true},
							returnvalue: {readonly: true},
							issuccess: {readonly: true},
							companytransheaderstatusfk: {
								readonly: true,
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'CompanyTransHeaderStatus',
										displayMember: 'DescriptionInfo.Translated',
										imageSelector: 'platformStatusIconService'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-company-trans-status-combobox',
									'options': {
										imageSelector: 'platformStatusIconService'
									}
								}
							}
						},
						addition: {
							grid: [
								{
									id: 'TradingPeriodStartDate',
									name: 'Trading Period Start Date',
									name$tr$: 'basics.accountingJournals.entityTradingPeriodStartDate',
									field: 'CompanyPeriodFk',
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-company-company-period-lookup',
										lookupOptions: {
											filterKey: 'basics-company-period-filter',
											showClearButton: true,
											displayMember: 'StartDate',
											formatter: 'dateutc'
										}
									},
									formatter: function (row, cell, value, columnDef) {
										// TODO  format the date field
										var service = $injector.get('basicsLookupdataLookupDescriptorService');
										var targetData = null;
										var result = null;
										if (!_.isEmpty(service)) {
											targetData = service.getData(columnDef.formatterOptions.lookupType);
										}
										if (!_.isEmpty(targetData)) {
											var item = targetData[value];
											if (!_.isEmpty(item)) {
												result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember);
											}
										}
										if (!_.isNil(result)) {
											result = moment.utc(result);
											result = result.format('L');
										}
										return result;
									},
									formatterOptions: {lookupType: 'companyperiod', displayMember: 'StartDate'},
									width: 125
								},
								{
									id: 'TradingPeriodEndDate',
									name: 'Trading Period End Date',
									name$tr$: 'basics.accountingJournals.entityTradingPeriodEndDate',
									field: 'CompanyPeriodFk',
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-company-company-period-lookup',
										lookupOptions: {
											filterKey: 'basics-company-period-filter',
											showClearButton: true,
											displayMember: 'EndDate',
											formatter: 'dateutc'
										}
									},
									formatter: function (row, cell, value, columnDef) {
										// TODO  format the date field
										var service = $injector.get('basicsLookupdataLookupDescriptorService');
										var targetData = null;
										var result = null;
										if (!_.isEmpty(service)) {
											targetData = service.getData(columnDef.formatterOptions.lookupType);
										}
										if (!_.isEmpty(targetData)) {
											var item = targetData[value];
											if (!_.isEmpty(item)) {
												result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember);
											}
										}
										if (!_.isNil(result)) {
											result = moment.utc(result);
											result = result.format('L');
										}
										return result;
									},
									formatterOptions: {lookupType: 'companyperiod', displayMember: 'EndDate'},
									width: 125
								}, {
									field: 'BasCompanyTransheader',
									name: 'Transaction Header',
									name$tr$: 'basics.accountingJournals.entityTransheader',
									formatter: 'description',
									readonly: true,
									maxLength: 255,
									width: 150
								}
							],
							detail: [
								{
									id: 'TradingPeriodStartDate',
									gid: 'baseGroup',
									rid: 'TradingPeriodStartDate',
									label: 'Trading Period Start Date',
									label$tr$: 'basics.accountingJournals.entityTradingPeriodStartDate',
									type: 'directive',
									model: 'CompanyPeriodFk',
									directive: 'basics-company-company-period-lookup',
									options: {
										displayMember: 'StartDate',
										formatter: 'dateutc',
										filterKey: 'basics-company-period-filter'
									},
									sortOrder: 1
								},
								{
									id: 'TradingPeriodEndDate',
									afterId: 'TradingPeriodStartDate',
									gid: 'baseGroup',
									label: 'Trading Period End Date',
									label$tr$: 'basics.accountingJournals.entityTradingPeriodEndDate',
									type: 'directive',
									model: 'CompanyPeriodFk',
									directive: 'basics-company-company-period-lookup',
									options: {
										displayMember: 'EndDate',
										formatter: 'dateutc',
										filterKey: 'basics-company-period-filter'
									},
									sortOrder: 1
								}, {
									afterId: 'TradingPeriodEndDate',
									rid: 'BasCompanyTransheader',
									gid: 'baseGroup',
									model: 'BasCompanyTransheader',
									label: 'Transaction Header',
									label$tr$: 'basics.accountingJournals.entityTransheader',
									type: 'description',
									directive: 'description',
									maxLength: 255,
									readonly: true
								}
							]
						}
					};
				}

				var unitDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var accountingJournalsAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'AccountingJournalsDto',
					moduleSubModule: 'Basics.AccountingJournals'
				});
				accountingJournalsAttributeDomains = accountingJournalsAttributeDomains.properties;

				function AccountingJournalsUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				AccountingJournalsUIStandardService.prototype = Object.create(BaseService.prototype);
				AccountingJournalsUIStandardService.prototype.constructor = AccountingJournalsUIStandardService;

				var service = new BaseService(unitDetailLayout, accountingJournalsAttributeDomains, basicsAccountingJournalsTranslationService);
				platformUIStandardExtentService.extend(service, unitDetailLayout.addition, accountingJournalsAttributeDomains);

				return service;
			}
		]);
})();
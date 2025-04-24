/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.actuals';

	/**
	 * @ngdoc service
	 * @name controllingActualsUIConfigurationService
	 * @function
	 * @requires moment
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('controllingActualsUIConfigurationService', ['moment', '$injector', '$translate',
		'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		function (moment, $injector, $translate, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
			var addColumns = [{
				id: 'Description',
				field: 'DescriptionInfo',
				name: 'Description',
				grouping: true,
				width: 300,
				formatter: 'translation',
				name$tr$: 'cloud.common.entityDescription'
			}];

			var addColumnsName = [
				{
					id: 'Name',
					field: 'ProjectName',
					name: 'Name',
					formatter: 'description',
					width: 150,
					name$tr$: 'cloud.common.entityName'
				}
			];
			var filters = [
				{
					key: 'controlling-actuals-account-filter',
					fn: filterControllingActualsAccountByLedgerContext
				}
			];

			function filterControllingActualsAccountByLedgerContext(data, context) {
				return data.LedgerContextFk === context.LedgerContextFk && data.IsLive;
			}

			basicsLookupdataLookupFilterService.registerFilter(filters);

			return {
				getCompanyCostHeaderDetailLayout: function () {
					return {
						fid: 'controlling.actuals.costheader.detailForm',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'companyyearfk', 'companyyearfkstartdate', 'companyyearfkenddate',
									'companyperiodfk', 'companyperiodfkstartdate', 'companyperiodfkenddate', 'valuetypefk', 'hascostcode',
									'hascontcostcode', 'hasaccount', 'commenttext', 'projectfk', 'total', 'totaloc','isfinal']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							code: {
								detail: {
									maxLength: 16
								},
								grid: {
									maxLength: 16
								}
							},
							hascostcode: {
								change: 'change'
							},
							hascontcostcode: {
								change: 'change'
							},
							hasaccount: {
								change: 'change'
							},
							// code for company year lookup filtered by company id
							'companyyearfk':{
								'detail': {
									'type': 'directive',
									'directive': 'controlling-common-company-year-lookup',
									'options': {
										'additionalColumns': true,
										lookupDirective: 'controlling-common-company-year-lookup',
										descriptionMember: 'TradingYear',
										lookupOptions: {
											showClearButton: true
										}
									},
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'showClearButton': true,
										'displayMember': 'TradingYear',
										'directive': 'controlling-common-company-year-lookup',
										'additionalColumns': true,
										'lookupOptions': {
											'events': [{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													args.entity.CompanyYear = args.selectedItem;
													let startmoment = moment(args.selectedItem.StartDate);
													let endmoment = moment(args.selectedItem.EndDate);
													args.entity.CompanyYearFkStartDate = moment.utc(startmoment, 'L', false);
													args.entity.CompanyYearFkEndDate = moment.utc(endmoment, 'L', false);
												}
											}]
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'dataServiceName': 'controllingCommonCompanyYearLookupDataService',
										'displayMember': 'TradingYear',
										'lookupType': 'CompanyYearCache'
									},
									'width': 130
								}
							},

							companyyearfkstartdate: {
								enableCache: true,
								readonly: true
							},
							companyyearfkenddate: {
								enableCache: true,
								readonly: true
							},
							companyperiodfk:{
								'detail': {
									'type': 'directive',
									'directive': 'controlling-common-company-period-lookup',
									'options': {
										'additionalColumns': true,
										lookupDirective: 'controlling-common-company-period-lookup',
										descriptionMember: 'TradingPeriod',
										lookupOptions: {
											showClearButton: true
										}
									},
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'showClearButton': true,
										'displayMember': 'TradingPeriod',
										'directive': 'controlling-common-company-period-lookup',
										'additionalColumns': true,
										'lookupOptions': {
											'filterKey': 'company-period-filter',
											'events': [{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													args.entity.CompanyPeriod = args.selectedItem;
													let startmoment = moment(args.selectedItem.StartDate);
													let endmoment = moment(args.selectedItem.EndDate);
													args.entity.CompanyPeriodFkStartDate = moment.utc(startmoment, 'L', false);
													args.entity.CompanyPeriodFkEndDate = moment.utc(endmoment, 'L', false);
												}
											}]
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										dataServiceName: 'controllingCommonCompanyPeriodLookupDataService',
										displayMember: 'TradingPeriod',
										lookupType: 'CompanyPeriodCache',
										mainServiceName :'controllingActualsCostHeaderListService'
									},
									'width': 130
								}
							},
							companyperiodfkstartdate: {
								enableCache: true,
								readonly: true
							},
							companyperiodfkenddate: {
								enableCache: true,
								readonly: true
							},
							valuetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.valuetype', 'Description'),
							projectfk: {
								'navigator': {
									moduleName: 'project.main'
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-project-lookup-dialog',
										'lookupOptions': {
											'showClearButton': false,
											'lookupType': 'PrcProject',
											'additionalColumns': true,
											'displayMember': 'ProjectNo',
											'descriptionMember': 'ProjectName',
											'addGridColumns': addColumnsName
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'PrcProject',
										'displayMember': 'ProjectNo'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'procurement-project-lookup-dialog',
										'descriptionMember': 'ProjectName',
										'lookupOptions': {
											'showClearButton': false,
											'lookupType': 'PrcProject'
										}
									}
								}
							},
							total: {
								enableCache: true,
								readonly: true
							},
							isfinal:{
								readonly:true
							},
							totaloc: {
								enableCache: true,
								readonly: true
							}
							/* projectfk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLookupDataService',
								enableCache: true,
							}), */
						}
					};
				},

				getCompanyCostDataDetailLayout: function () {
					return {
						fid: 'controlling.actuals.costdata.detailForm',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['mdccontrollingunitfk', 'mdccostcodefk', 'mdccontrcostcodefk', 'accountfk',
									'quantity', 'amount', 'currencyfk', 'amountoc', 'amountproject', 'commenttext','uomfk',
									'nominaldimension1','nominaldimension2','nominaldimension3','isfixedamount'
								]
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true,
								readonly: false,
								change: 'change'
							}),
							'mdccontrollingunitfk': {
								navigator: {
									moduleName: 'controlling.structure'
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'controlling-structure-dialog-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'actual-controlling-by-prj-filter',
											showClearButton: false
										}
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											filterKey: 'actual-controlling-by-prj-filter',
											showClearButton: false
										},
										directive: 'controlling-structure-dialog-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Controllingunit',
										displayMember: 'Code'
									},
									width: 130
								}
							},

							'mdccostcodefk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'additionalColumns': true,
										lookupDirective: 'basics-cost-codes-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true,
											additionalColumns: true,
											'displayMember': 'Code',
											'addGridColumns': addColumns
										},
										directive: 'basics-cost-codes-lookup'
									},
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'costcode',
										displayMember: 'Code',
										version: 3
									}
								}
							},
							'mdccontrcostcodefk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'additionalColumns': true,
										lookupDirective: 'basics-cost-codes-controlling-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											showClearButton: true
										}
									},
									'change': 'change'
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true,
											additionalColumns: true,
											'displayMember': 'Code',
											'addGridColumns': addColumns
										},
										directive: 'basics-cost-codes-controlling-lookup'
									},
									additionalColumns: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ControllingCostCode',
										displayMember: 'Code'
									}
								}
							},
							'accountfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomAccountLookupDataService',
								filterKey: 'controlling-actuals-account-filter'
							}),
							'amountproject': {
								'grid': {
									width: 250,
								}
							}
						}
					};
				}


			};
		}
	]);
})(angular);

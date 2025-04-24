/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureActualLayout',['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
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

			return {
				fid: 'controlling.structure.actuals',
				version: '1.0.1',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: [
							'controllingunitcode', 'controllingunitdescription', 'contrcostcodecode', 'contrcostcodedescription',

							'code',
							'companyyearfk', 'companyyearfkstartdate', 'companyyearfkenddate',
							'companyperiodfk', 'companyperiodfkstartdate', 'companyperiodfkenddate', 'valuetypefk', 'hascostcode',
							'hascontcostcode', 'hasaccount', 'projectfk', 'total', 'totaloc', 'isfinal',

							'mdccostcodefk', 'accountfk',
							'quantity', 'amount', 'currencyfk', 'amountoc', 'uomfk', 'nominaldimension1', 'nominaldimension2', 'nominaldimension3',

							'commenttext'
						]
					}
				],
				overloads: {
					'controllingunitcode': {readonly: true},
					'controllingunitdescription': {readonly: true},
					'contrcostcodecode' : { readonly: true },
					'contrcostcodedescription' : { readonly: true },

					'code': {
						readonly: true,
						navigator: {
							moduleName: 'controlling.actuals',
							targetIdProperty: 'CompanyCostHeaderFk'
						}
					},
					'hascostcode': {readonly: true},
					'hascontcostcode': {readonly: true},
					'hasaccount': {readonly: true},

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
							'editor': 'directive',
							'editorOptions': {
								'showClearButton': true,
								'displayMember': 'TradingYear',
								'directive': 'controlling-common-company-year-lookup',
								'additionalColumns': true
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'dataServiceName': 'controllingCommonCompanyYearLookupDataService',
								'displayMember': 'TradingYear',
								'lookupType': 'CompanyYearCache'
							},
							'width': 130
						},
						readonly: true
					},
					companyyearfkstartdate: {
						enableCache: true,
						readonly: true
					},
					companyyearfkenddate: {
						enableCache: true,
						readonly: true
					},
					companyperiodfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'controllingActualsCompanyPeriodLookupDataService',
						filterKey: 'CompanyYearFk',
						filter: function (costHeader) {
							return costHeader;
						},
						enableCache: true,
						additionalColumns: false,
						readonly: true
					}),
					companyperiodfkstartdate: {
						enableCache: true,
						readonly: true
					},
					companyperiodfkenddate: {
						enableCache: true,
						readonly: true
					},
					valuetypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.valuetype', 'Description'),
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
						},
						readonly: true
					},
					'total': {readonly: true},
					'totaloc': {readonly: true},
					'isfinal': {readonly: true},

					'quantity': {readonly: true},
					'amount': {readonly: true},
					'amountoc': {readonly: true},
					'nominaldimension1': {readonly: true},
					'nominaldimension2': {readonly: true},
					'nominaldimension3': {readonly: true},
					'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						readonly: true
					}),
					'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true,
						readonly: true,
					}),
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
								displayMember: 'Code'
							}
						},
						readonly: true
					},

					'accountfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						readonly: true
					}),

					'commenttext': {readonly: true}
				}
			};
		}
	]);

	angular.module(moduleName).factory('controllingStructureActualUIStandardService',
		['controllingStructureActualLayout','platformUIStandardConfigService', 'platformSchemaService', 'controllingStructureTranslationService',
			function (layout,platformUIStandardConfigService, platformSchemaService, translationService) {

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'ControllingActualsSubTotalDto',
						moduleSubModule: 'Controlling.Actuals'
					});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new UIStandardService(layout, domainSchema, translationService);
			}]);
})();
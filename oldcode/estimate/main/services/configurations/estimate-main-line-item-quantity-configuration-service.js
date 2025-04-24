/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLineItemQuantityConfigurationService
	 * @function
	 * @description
	 * This is the data service for estimate line item quantity data functions.
	 */
	angular.module(moduleName).factory('estimateMainLineItemQuantityConfigurationService',
		['$injector', 'platformUIStandardConfigService',
			'estimateMainTranslationService',
			'platformSchemaService',
			'basicsLookupdataConfigGenerator',

			function ($injector, platformUIStandardConfigService,
				estimateMainTranslationService,
				platformSchemaService,
				basicsLookupdataConfigGenerator) {

				let getEstLineItemQuantityDetailLayout = function () {
					return {
						'fid': 'estimate.main.lineItemquantity.detailform',
						'version': '1.0.1',
						'showGrouping': true,
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['quantity', 'quantitytypefk', 'date', 'wipheaderfk', 'pesheaderfk', 'boqrootref', 'boqitemfk', 'psdactivityschedule', 'psdactivityfk', 'mdlmodelfk', 'bilheaderfk', 'comment']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'quantitytypefk': {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookup-data-by-custom-data-service-grid-less',
										lookupOptions: {
											filterKey: 'est-line-item-quantity-filter',
											lookupModuleQualifier: 'basicsCustomizeQuantityTypeLookupDataService',
											lookupType: 'basicsCustomizeQuantityTypeLookupDataService',
											dataServiceName: 'basicsCustomizeQuantityTypeLookupDataService',
											valueMember: 'Id',
											displayMember: 'Code',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'basicsCustomizeQuantityTypeLookupDataService',
										dataServiceName: 'basicsCustomizeQuantityTypeLookupDataService',
										displayMember: 'Code'
									}
								}
							},

							'wipheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								'navigator': {
									moduleName: 'sales.wip',
									navFunc: function (options, item) {
										let naviService = $injector.get('platformModuleNavigationService');
										let navigator = naviService.getNavigator('sales.wip');
										naviService.navigate(navigator, {Id: item.WipHeaderFk}, options);
									}
								},
								dataServiceName: 'salesWipLookupDataService',
								cacheEnable: true,
								'readonly': true,
								filter: function () {
									return $injector.get('estimateMainService').getSelectedProjectId();
								}
							}),

							'pesheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								'navigator': {
									moduleName: 'procurement.pes',
									navFunc: function (options, item) {
										let naviService = $injector.get('platformModuleNavigationService');
										let navigator = naviService.getNavigator('procurement.pes');
										naviService.navigate(navigator, {Id: item.PesHeaderFk}, options);
									}
								},
								dataServiceName: 'pesHeaderLookupDataService',
								cacheEnable: true,
								'readonly': true,
								displayMember: 'Code',
								filter: function () {
									return $injector.get('estimateMainService').getSelectedProjectId();
								}
							}),

							'boqitemfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								'navigator': {
									moduleName: 'sales.wip',
									navFunc: function (options, item) {
										let naviService = $injector.get('platformModuleNavigationService');
										let navigator = naviService.getNavigator('sales.wip');
										naviService.navigate(navigator, {Id: item.WipHeaderFk}, options);
									}
								},
								dataServiceName: 'salesWipBoqLookupDataService',
								displayMember: 'Reference',
								cacheEnable: true,
								'readonly': true,
								filter: function (item) {
									return item.BoqHeaderFk;
								}
							}),

							'boqrootref': {
								'navigator': {
									moduleName: 'sales.wip',
									navFunc: function (options, item) {
										let naviService = $injector.get('platformModuleNavigationService');
										let navigator = naviService.getNavigator('sales.wip');
										naviService.navigate(navigator, {Id: item.WipHeaderFk}, options);
									}
								},
								'readonly': true,
								'grid': {
									field: 'BoqHeaderFk',
									formatter: 'lookup',
									formatterOptions: {
										displayMember: 'Reference',
										dataServiceName: 'salesWipBoqRootLookupDataService',
										dataServiceMethod: 'getItemByIdAsync'
									}
								}
							},

							'psdactivityschedule': {
								'navigator': {
									moduleName: 'scheduling.main'
								},
								'readonly': true,
								'grid': {
									field: 'PsdActivityFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemactivity',
										displayMember: 'Code',
										dataServiceName: 'estimateMainActivityScheduleLookupService'
									}
								}
							},
							'psdactivityfk': {
								'navigator': {
									moduleName: 'scheduling.main'
								},
								'readonly': true,
								'detail': {
									'type': 'directive',
									'directive': 'estimate-main-activity-dialog',

									'options': {
										'eagerLoad': true,
										'showClearButton': true
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemactivity',
										displayMember: 'Code',
										dataServiceName: 'estimateMainActivityLookupService'
									}
								}
							},

							'date': {
								editor: 'dateutc',
								formatter: 'dateutc'
							},
							'mdlmodelfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								dataServiceName: 'modelProjectModelLookupDataService',
								enableCache: false,
								readonly: false,
								filter: function () {
									return $injector.get('estimateMainService').getSelectedProjectId();
								}
							}),
							'bilheaderfk': {
								navigator: {
									moduleName: 'sales.billing',
									navFunc: function (options, item) {
										let naviService = $injector.get('platformModuleNavigationService');
										let navigator = naviService.getNavigator('sales.billing');
										naviService.navigate(navigator, {Id: item.BilHeaderFk}, options);
									}
								},
								readonly: true,
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
										lookupDirective: 'sales-common-bill-dialog-v2',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {}
									}
								}
							}
						}
					};
				};

				let BaseService = platformUIStandardConfigService;
				let estQuantityDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstLineItemQuantityDto',
					moduleSubModule: 'Estimate.Main'
				});
				if (estQuantityDomainSchema) {
					estQuantityDomainSchema = estQuantityDomainSchema.properties;
					estQuantityDomainSchema.BoqRootRef = {domain: 'integer'};
					estQuantityDomainSchema.PsdActivitySchedule = {domain: 'integer'};
				}

				function EstimateUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;
				let estimateMainQuantityDetailLayout = getEstLineItemQuantityDetailLayout();
				return new BaseService(estimateMainQuantityDetailLayout, estQuantityDomainSchema, estimateMainTranslationService);
			}
		]);
})();

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).factory('projectCostCodesPriceListRecordUIStandardService',
		['platformUIStandardConfigService', 'platformUIStandardExtentService',
			'projectCostCodesPriceListRecordTranslationService', 'projectCostCodesPriceListRecordUIConfigurationService',
			'platformSchemaService',
			function (platformUIStandardConfigService, platformUIStandardExtentService,
				translationService, UIConfigurationService, platformSchemaService) {
				let BaseService = platformUIStandardConfigService;
				let costCodeDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'UpdatePriceFromPriceListDto',
					moduleSubModule: 'Project.CostCodes'
				});
				if (costCodeDomainSchema) {
					costCodeDomainSchema = costCodeDomainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;
				let layout = UIConfigurationService.getDetailLayout();
				return new BaseService(layout, costCodeDomainSchema, translationService);
			}
		]);

	/**
	 * @ngdoc service
	 * @name basicsCostCodesUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCostCodesUIConfigurationService is the config service for all costcodes views.
	 */
	angular.module(moduleName).factory('projectCostCodesPriceListRecordUIConfigurationService', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				getDetailLayout: function () {
					let priceList = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.pricelist', null, {});
					priceList.grid.sortable = false;
					return {
						'fid': 'project.costcodes.price.list.records',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': [
									'selected',
									'pricelistfk', 'priceversionfk', 'rate', 'salesprice',
									'factorcosts',
									'realfactorcosts',
									'factorquantity',
									'realfactorquantity',
									'factorhour',
									'currencyfk',
									'validfrom', 'validto', 'weighting',
									'co2source', 'co2project','co2sourcefk'
								]
							}
						],
						'overloads': {
							selected: {
								headerChkbox: true,
								sortable: false,
								width: 80
							},
							pricelistfk: {
								readonly: true,
								grid: {
									sortable: false,
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;
										if (item.PriceListFk === -1) {
											domain = 'description';
											item.PriceListDescription = 'N/A';
											column.field = 'PriceListDescription';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.regex = null;
										} else {
											domain = 'lookup';
											column.field = 'PriceListFk';
											column.editorOptions = null;
											column.formatterOptions = {
												'lookupSimpleLookup': true,
												'lookupModuleQualifier': 'basics.customize.pricelist',
												'displayMember': 'Description',
												'valueMember': 'Id'
											};
											column.regex = null;
										}
										return domain;
									},
									width: 120
								}
							},
							priceversionfk: {
								readonly: true,
								grid: {
									sortable: false,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'CostCodePriceVersion',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 120
								}
							},
							rate: {
								sortable: false,
								readonly: true,
								grid:{
									width: 100
								}
							},
							salesprice: {
								sortable: false,
								readonly: true,
								grid:{
									width: 100
								}
							},
							factorcosts: {
								sortable: false,
								readonly: true
							},
							factorquantity: {
								sortable: false,
								readonly: true
							},
							'realfactorcosts': {
								sortable: false,
								readonly: true
							},
							'realfactorquantity': {
								sortable: false,
								readonly: true
							},
							'factorhour': {
								sortable: false,
								readonly: true
							},
							currencyfk: {
								readonly: true,
								grid: {
									sortable: false,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'basicsCurrencyLookupDataService',
										displayMember: 'Currency',
										isClientSearch: true
									},
									width: 80
								}
							},
							validfrom: {
								sortable: false,
								readonly: true,
								grid:{
									width: 100
								}
							},
							validto: {
								sortable: false,
								readonly: true,
								grid:{
									width: 100
								}
							},
							weighting: {
								sortable: false,
								// readonly: true,
								grid:{
									width: 80
								}
							},
							'co2source':{
								readonly: true
							},
							'co2project':{
								readonly: true
							},
							'co2sourcefk': {
								readonly: true,
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-source-name-lookup',
									'options': {
										version: 3
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'basics-lookupdata-source-name-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'co2sourcename',
										displayMember: 'DescriptionInfo.Translated',
										version: 3
									}
								}
							},
						}
					};
				}
			};
		}]);
})();
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).factory('projectCostCodesPriceListForJobUIStandardService',
		['platformUIStandardConfigService', 'platformUIStandardExtentService',
			'projectCostCodesPriceListTranslationService', 'projectCostCodesPriceListForJobUIConfigurationService',
			'platformSchemaService', 'cloudCommonGridService',
			function (platformUIStandardConfigService, platformUIStandardExtentService,
				translationService, UIConfigurationService, platformSchemaService, cloudCommonGridService) {
				let BaseService = platformUIStandardConfigService;
				let costCodeDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrjCostCodesDto',
					moduleSubModule: 'Project.CostCodes'
				});
				if (costCodeDomainSchema) {
					costCodeDomainSchema = costCodeDomainSchema.properties;
					costCodeDomainSchema.IsChecked = {domain: 'boolean'};
					costCodeDomainSchema.Status = {domain: 'integer'};
					costCodeDomainSchema.IsLabour.mandatory = false;
					costCodeDomainSchema.IsRate.mandatory = false;
					costCodeDomainSchema.Code.mandatory = false;
				}

				let basicCostCodesAttributeDomains =  platformSchemaService.getSchemaFromCache({ typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'});
				// Add the prefix 'BasCostCode' to the keys of the properties information because we use them in the context of the PrjCostCodeDto
				basicCostCodesAttributeDomains = cloudCommonGridService.addPrefixToKeys(basicCostCodesAttributeDomains.properties, 'BasCostCode');
				let prjCostCodeAttributeDomains = angular.extend({}, costCodeDomainSchema, basicCostCodesAttributeDomains);
				prjCostCodeAttributeDomains['BasCostCode.Code'].mandatory = false;

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;
				let layout = UIConfigurationService.getDetailLayout();
				return new BaseService(layout, prjCostCodeAttributeDomains, translationService);
			}
		]);

	/**
	 * @ngdoc service
	 * @name projectCostCodesPriceListForJobUIConfigurationService
	 * @function
	 * @description
	 * projectCostCodesPriceListForJobUIConfigurationService.
	 */
	angular.module(moduleName).factory('projectCostCodesPriceListForJobUIConfigurationService', [
		'basicsLookupdataConfigGenerator', '$injector', 'globals',
		function (basicsLookupdataConfigGenerator, $injector, globals) {
			return {
				getDetailLayout: function () {
					return {
						'fid': 'project.costcodes.price.list.groupbyjob',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': [
									'ischecked', 'status',
									'jobcode', 'jobdescription', 'mdcpricelistfk', 'jobcostcodepriceversionfk',
									'code', 'bascostcode.code', 'newcode','description','bascostcode.descriptioninfo','newdescription',
									'rate', 'newrate', 'dayworkrate', 'newdayworkrate',
									'factorcosts', 'bascostcode.factorcosts', 'newfactorcosts',
									'realfactorcosts', 'bascostcode.realfactorcosts', 'newrealfactorcosts',
									'factorquantity', 'bascostcode.factorquantity', 'newfactorquantity',
									'realfactorquantity', 'bascostcode.realfactorquantity', 'newrealfactorquantity',
									'factorhour', 'bascostcode.factorhour', 'newfactorhour',
									'bascostcode.currencyfk', 'currencyfk', 'newcurrencyfk', 'uomfk', 'islabour', 'israte',
									'co2source', 'co2project','co2sourcefk','newco2source', 'newco2project','newco2sourcefk'
								]
							}
						],
						'overloads': {
							ischecked: {
								headerChkbox: true,
								sortable: false,
								width: 80
							},
							status: {
								readonly: true,
								grid:{
									sortable: false,
									formatter: function (row, cell, value, columnDef, dataContext) {
										let statusValues = $injector.get('projectCostcodesPriceListForJobStatusValues');
										let $translate = $injector.get('$translate');
										let path = '';
										let tooltip = '';
										if(value === statusValues.success){
											tooltip = $translate.instant(statusValues.successDescription);
											path = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-tick';
										} else if (value === statusValues.warningNoJob ) {
											tooltip = $translate.instant(statusValues.warningNoJobDescription);
											path = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-warning';
										} else if (value === statusValues.error) {
											tooltip = $translate.instant(statusValues.errorDescription);
											path = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-error';
										}else {
											tooltip = $translate.instant(statusValues.successDescription);
											path = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-tick';
										}
										if(dataContext.ErrorMessage){
											tooltip = dataContext.ErrorMessage;
										}
										return '<img src="' + path + '" title="' + tooltip + '" alt="">';
									}
								}
							},
							jobcode: {
								sortable: false,
								readonly: true
							},
							mdcpricelistfk: {
								readonly: true,
								grid: {
									sortable: false,
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;
										if (item.MdcPriceListFk === -1) {
											domain = 'description';
											item.MdcPriceListDescription = 'N/A';
											column.field = 'MdcPriceListDescription';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.regex = null;
										} else {
											domain = 'lookup';
											item.MdcPriceListDescription = undefined;
											column.field = 'MdcPriceListFk';
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
									}
								}
							},
							jobcostcodepriceversionfk: {
								grid: {
									sortable: false,
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-cost-codes-price-version-lookup',
										lookupOptions: {
											filterKey: 'project-main-costcodes-price-price-version-filter',
											showClearButton: true,
											additionalData: $injector.get('projectCostCodesPriceListForJobDataService').additionalPriceVersions
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'CostCodePriceVersion',
										displayMember: 'DescriptionInfo.Translated'
									}
								}
							},
							jobdescription: {
								sortable: false,
								readonly: true
							},
							code: {
								sortable: false,
								readonly: true,
								grid: {
									pinned: true
								}
							},
							'bascostcode.code': {
								sortable: false,
								readonly: true
							},
							'newcode': {
								sortable: false,
								readonly: true
							},
							'bascostcode.descriptioninfo': {
								sortable: false,
								readonly: true
							},
							'newdescription': {
								sortable: false,
								readonly: true
							},
							description : {
								sortable: false,
								readonly: true,
								grid: {
									pinned: true
								}
							},
							rate: {
								sortable: false,
								readonly: true
							},
							dayworkrate: {
								sortable: false,
								readonly: true
							},
							factorcosts: {
								sortable: false,
								readonly: true
							},
							'bascostcode.factorcosts': {
								sortable: false,
								readonly: true
							},
							newfactorcosts: {
								sortable: false
							},
							factorquantity: {
								sortable: false,
								readonly: true
							},
							'bascostcode.factorquantity': {
								sortable: false,
								readonly: true
							},
							newfactorquantity: {
								sortable: false
							},

							'realfactorcosts': {
								sortable: false,
								readonly: true
							},
							'bascostcode.realfactorcosts': {
								sortable: false,
								readonly: true
							},
							'newrealfactorcosts': {
								sortable: false,
								readonly: true
							},
							'realfactorquantity': {
								sortable: false,
								readonly: true
							},
							'bascostcode.realfactorquantity': {
								sortable: false,
								readonly: true
							},
							'newrealfactorquantity': {
								sortable: false,
								readonly: true
							},
							'factorhour': {
								sortable: false,
								readonly: true
							},
							'bascostcode.factorhour': {
								sortable: false,
								readonly: true
							},
							'newfactorhour': {
								sortable: false
							},
							'bascostcode.currencyfk': {
								readonly: true,
								grid: {
									sortable: false,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'basicsCurrencyLookupDataService',
										displayMember: 'Currency',
										isClientSearch: true
									}
								}
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
									}
								}
							},
							'newcurrencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								filterKey: 'project-main-costcodes-currency-edit-filter',
								// enableCache: true,
								// readonly: false
							}),

							uomfk: {
								readonly: true,
								grid: {
									sortable: false,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'basicsUnitLookupDataService',
										displayMember: 'UnitInfo.Translated',
										isClientSearch: true
									}
								}
							},
							islabour: {
								readonly: true,
								required: false,
								grid: {
									sortable: false,
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;
										if (item.isJob) {
											domain = 'description';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.regex = null;
										} else {
											domain = 'boolean';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.regex = null;
										}
										return domain;
									}
								}
							},
							israte: {
								readonly: true,
								required: false,
								grid: {
									sortable: false,
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;
										if (item.isJob) {
											domain = 'description';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.regex = null;
										} else {
											domain = 'boolean';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.regex = null;
										}
										return domain;
									}
								}
							},
							'co2project':{
								readonly: true
							},
							'co2source':{
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
							'newco2source':{
								readonly: true
							},
							'newco2sourcefk': {
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
							}
						}
					};
				}
			};
		}]);
})();
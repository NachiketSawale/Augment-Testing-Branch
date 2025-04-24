(function () {
	'use strict';
	/* global $ */
	var moduleName = 'basics.material',
		cloudCommonModule = 'cloud.common',
		basicsPriceConditionModule = 'basics.pricecondition';

	/**
	 * @ngdoc service
	 * @name basicsMaterialPriceConditionLayout
	 * @function
	 *
	 * @description
	 * basicsMaterialPriceConditionLayout is the ui service for all price condition edit dialog.
	 */
	angular.module(moduleName).factory('basicsMaterialPriceConditionLayout', ['materialPriceConditionValueFormatter','platformGridDomainService',
		function (valueFormatter,platformGridDomainService) {
			return {
				'addValidationAutomatically': true,
				'groups': [{
					'gid': 'basicData',
					'attributes': ['prcpriceconditiontypefk', 'description', 'value', 'total', 'totaloc', 'code', 'formula', 'ispricecomponent', 'isactivated','date','userdefined1','userdefined2','userdefined3','userdefined4','userdefined5']
				}],
				'translationInfos': {
					'extraModules': ['basics.materialcatalog', 'basics.pricecondition'],
					'extraWords': {
						PrcPriceConditionTypeFk: {
							location: cloudCommonModule,
							identifier: 'priceType',
							initial: 'Type'
						},
						Description: {
							location: cloudCommonModule,
							identifier: 'priceDescription',
							initial: 'Description'
						},
						Value: {location: cloudCommonModule, identifier: 'priceValue', initial: 'Value'},
						Total: {location: cloudCommonModule, identifier: 'priceTotal', initial: 'Total'},
						TotalOc: {location: cloudCommonModule, identifier: 'priceTotalOc', initial: 'TotalOc'},
						Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						Formula: {location: cloudCommonModule, identifier: 'priceFormula', initial: 'Formula'},
						IsPriceComponent: {
							location: cloudCommonModule,
							identifier: 'priceComponent',
							initial: 'priceComponent'
						},
						IsActivated: {
							location: basicsPriceConditionModule,
							identifier: 'entityIsActivated',
							initial: 'Is Activated'
						},
						Date:{
							location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'
						},
						Userdefined1:{
							location: cloudCommonModule, identifier: 'entityUserDefined',  param: { p_0: 1 }, initial: 'User-Defined 1'
						},
						Userdefined2:{
							location: cloudCommonModule, identifier: 'entityUserDefined',  param: { p_0: 2 }, initial: 'User-Defined 2'
						},
						Userdefined3:{
							location: cloudCommonModule, identifier: 'entityUserDefined',  param: { p_0: 3 }, initial: 'User-Defined 3'
						},
						Userdefined4:{
							location: cloudCommonModule, identifier: 'entityUserDefined',  param: { p_0: 4 }, initial: 'User-Defined 4'
						},
						Userdefined5:{
							location: cloudCommonModule, identifier: 'entityUserDefined',  param: { p_0: 5 }, initial: 'User-Defined 5'
						}
					}
				},
				overloads: {
					'prcpriceconditiontypefk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupField: 'PrcPriceConditionTypeFk',
								lookupDirective: 'procurement-common-price-condition-type-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcpriceconditiontype',
								displayMember: 'DescriptionInfo.Translated'
							},
							bulkSupport: false
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-price-condition-type-lookup',
							bulkSupport: false
						}
					},
					value: {
						'grid': {
							editor: 'factor',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.HasValue',
								domainType: 'factor'
							}
						}
					},
					total: {
						'readonly': true,
						'grid': {
							'id': 'conditionTotal',
							editor: 'factor',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.HasTotal',
								domainType: 'factor'
							}
						}
					},
					totaloc: {
						'readonly': true,
						'grid': {
							editor: 'factor',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.HasTotal',
								domainType: 'factor'
							}
						}
					},
					code: {
						'readonly': true,
						'grid': {
							editor: 'code',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.Code',
								domainType: 'code'
							}
						}
					},
					formula: {
						'readonly': true,
						'grid': {
							editor: 'remark',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.Formula',
								domainType: 'remark'
							}
						}
					},
					ispricecomponent: {'readonly': true},
					date:{
						'readonly': true,
						formatterOptions: {
							domainType: 'dateutc'
						},
						formatter:function(row, cell, value,columnDef){
							columnDef.formatterOptions = columnDef.formatterOptions || {
								domainType: 'dateutc'
							};
							value=value?moment.utc(value):value;
							var domain = columnDef.formatterOptions.domainType;
							var domainTypeFormatter = platformGridDomainService.formatter(domain);
							if (domainTypeFormatter && typeof domainTypeFormatter === 'function') {
								value = domainTypeFormatter(row, cell, value, columnDef, null);
							}
							return value || '';
						}
					},
					userdefined1: {
						'readonly': true,
						'grid': {
							editor: 'description',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.Userdefined1',
								domainType: 'description'
							}
						}
					},
					userdefined2: {
						'readonly': true,
						'grid': {
							editor: 'description',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.Userdefined2',
								domainType: 'description'
							}
						}
					},
					userdefined3: {
						'readonly': true,
						'grid': {
							editor: 'description',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.Userdefined3',
								domainType: 'description'
							}
						}
					},
					userdefined4: {
						'readonly': true,
						'grid': {
							editor: 'description',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.Userdefined4',
								domainType: 'description'
							}
						}
					},
					userdefined5: {
						'readonly': true,
						'grid': {
							editor: 'description',
							formatter: valueFormatter,
							formatterOptions: {
								controlField: 'PriceConditionType.Userdefined5',
								domainType: 'description'
							}
						}
					}
				}
			};
		}]
	);

	angular.module(moduleName).factory('basicsPriceConditionStandardConfigurationService', ['platformUIStandardConfigService',
		'basicsMaterialTranslationService', 'basicsMaterialPriceConditionLayout', 'platformSchemaService', 'basicsCommonRoundingService',

		function (platformUIStandardConfigService, translationService,
			layout, platformSchemaService, roundingService) {

			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache(
				{
					typeName: 'MaterialPriceConditionDto',
					moduleSubModule: 'Basics.Material'
				});

			let basRoundingDataService = roundingService.getService('basics.material');
			layout.overloads.value.roundingField = 'MdcPriceCondition_Value';
			layout.overloads.total.roundingField = 'MdcPriceCondition_Total';
			layout.overloads.totaloc.roundingField = 'MdcPriceCondition_TotalOc';
			basRoundingDataService.uiRoundingConfig(layout);

			function PriceConditionUIStandardService(layout, schema, translateService) {
				BaseService.call(this, layout, schema, translateService);
				this.getStandardConfigForListView().columns[5].width = 120;
			}

			PriceConditionUIStandardService.prototype = Object.create(BaseService.prototype);
			PriceConditionUIStandardService.prototype.constructor = PriceConditionUIStandardService;

			return new PriceConditionUIStandardService(layout, domainSchema.properties, translationService);
		}
	]);
})();

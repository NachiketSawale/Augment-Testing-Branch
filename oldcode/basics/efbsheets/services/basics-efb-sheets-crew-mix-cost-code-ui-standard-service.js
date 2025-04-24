/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'basics.efbsheets';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsCrewMixCostCodeUIStandardService
     * @function
     *
     * @description
     *basicsEfbsheetsCrewMixCostCodeUIStandardService
     */
	angular.module(moduleName).factory('basicsEfbsheetsCrewMixCostCodeUIStandardService',
		['platformUIStandardConfigService', 'basicsEfbsheetsTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, basicsEfbsheetsTranslationService, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;
				let efbSheetsCrewMixAfLayout = {

					'fid': 'basics.efbsheets.crewmix2costcode.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['mdccostcodefk']
						}
					],

					'overloads': {
						'mdccostcodefk': {
							navigator: {
								moduleName: 'basics.costcodes'
							},
							'grid': {
								'editor': 'lookup',
								'enableCache': false,
								'editorOptions': {
									'directive': 'estimate-main-cost-codes-lookup',
									'lookupOptions': {
										'enableCache': false,
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': [{
											id: 'Description',
											field: 'DescriptionInfo',
											name: 'Description',
											formatter: 'translation',
											width: 100,
											name$tr$: 'cloud.common.entityDescription',
											searchable: true
										},
										{
											id: 'Rate',
											field: 'Rate',
											name: 'Market Rate',
											formatter: 'money',
											width: 70,
											name$tr$: 'basics.costcodes.unitRate'
										}]
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'estcostcodeslist',
									'displayMember': 'Code'
								}
							},
							'detail': {
								'type': 'directive',
								'directive':  'estimate-main-cost-codes-lookup',
								'options': {
									'lookupDirective':  'estimate-main-cost-codes-lookup',
									'descriptionField': 'CostCodeDescription',
									'descriptionMember': 'DescriptionInfo.Translated',
									'lookupOptions': {
										'initValueField': 'CostCode',
										'showClearButton': true
									}
								}
							}
						}
					}
				};

				let efbSheetCrewMix2CostCodeDomainSchema = platformSchemaService.getSchemaFromCache({typeName: 'EstCrewMix2CostCodeDto',moduleSubModule: 'Basics.EfbSheets'});
				if (efbSheetCrewMix2CostCodeDomainSchema) {
					efbSheetCrewMix2CostCodeDomainSchema = efbSheetCrewMix2CostCodeDomainSchema.properties;
				}

				function EfbSheetUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				EfbSheetUIStandardService.prototype = Object.create(BaseService.prototype);
				EfbSheetUIStandardService.prototype.constructor = EfbSheetUIStandardService;
				return new BaseService(efbSheetsCrewMixAfLayout, efbSheetCrewMix2CostCodeDomainSchema, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);


/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'basics.efbsheets';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsProjectCrewMixCostCodeUIStandardService
     * @function
     *
     * @description
     *basicsEfbsheetsProjectCrewMixCostCodeUIStandardService
     */
	angular.module(moduleName).factory('basicsEfbsheetsProjectCrewMixCostCodeUIStandardService',
		['platformUIStandardConfigService', 'basicsEfbsheetsTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, basicsEfbsheetsTranslationService, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;
				let efbSheetsCrewMixAfLayout = {

					'fid': 'basics.efbsheets.projectcrewmix2costcode.layout',
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
								moduleName: 'estimate.main'
							},
							'grid': {
								'editor': 'lookup',
								'enableCache': false,
								'editorOptions': {
									'directive': 'estimate-main-project-cost-codes-lookup',
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
									'lookupType': 'estprjcostcodes',
									'displayMember': 'Code',
									'valueMember' : 'Id',
									'valMember' : 'Id',
								}
							},
							'detail': {
								'type': 'directive',
								'directive':  'estimate-main-project-cost-codes-lookup',
								'options': {
									'lookupDirective':  'estimate-main-project-cost-codes-lookup',
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

				let efbSheetProjectCrewMix2CostCodeDomainSchema = platformSchemaService.getSchemaFromCache({typeName: 'PrjCrewMix2CostCodeDto',moduleSubModule: 'Basics.EfbSheets'});
				if (efbSheetProjectCrewMix2CostCodeDomainSchema) {
					efbSheetProjectCrewMix2CostCodeDomainSchema = efbSheetProjectCrewMix2CostCodeDomainSchema.properties;
				}

				function EfbSheetUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				EfbSheetUIStandardService.prototype = Object.create(BaseService.prototype);
				EfbSheetUIStandardService.prototype.constructor = EfbSheetUIStandardService;
				return new BaseService(efbSheetsCrewMixAfLayout, efbSheetProjectCrewMix2CostCodeDomainSchema, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);


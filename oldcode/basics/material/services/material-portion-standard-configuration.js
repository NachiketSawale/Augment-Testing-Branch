(function () {
	'use strict';
	/* global angular */
	let moduleName = 'basics.material';
	let cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsMaterialPortionLayout',['_', '$injector', '$http','basicsCommonRoundingService',
		function (_, $injector, $http,basicsCommonRoundingService) {
			let layout={
				fid: 'basics.material.portion.detail',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				translationInfos: {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						Code: { location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
						Description: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
						CostPerUnit: { location: moduleName, identifier: 'portion.costPerUnit', initial: 'Cost Per Unit' },
						IsEstimatePrice: { location: moduleName, identifier: 'portion.isEstimatePrice', initial: 'Is Estimate Price' },
						IsDayworkRate: { location: moduleName, identifier: 'portion.isDayworkRate', initial: 'Is Daywork Rate' },
						MdcCostCodeFk: { location: cloudCommonModule, identifier: 'entityCostCode', initial: 'Cost Code' },
						PrcPriceconditionFk: { location: cloudCommonModule, identifier: 'entityPriceCondition', initial: 'Price Condition' },
						PriceExtra: {location: moduleName, identifier: 'portion.priceExtras', initial: 'Price Extras'},
						MaterialPortionTypeFk: {location: moduleName, identifier: 'portion.materialPortionType', initial: 'Material Portion Type'}
					}
				},
				groups: [
					{
						'gid': 'basicData',
						'attributes': ['code', 'description', 'costperunit', 'quantity', 'isestimateprice', 'isdayworkrate', 'mdccostcodefk', 'prcpriceconditionfk', 'priceextra',
							'materialportiontypefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					code:{
						bulkSupport: false
					},
					prcpriceconditionfk: {
						'detail': {
							'type': 'directive',
							'directive': 'basics-Material-Price-Condition-Combobox',
							'options': {
								showClearButton: true,
								dataService: 'basicsMaterialPriceConditionDataServiceNew'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									dataService: 'basicsMaterialPriceConditionDataServiceNew'
								},
								directive: 'basics-Material-Price-Condition-Combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcPricecondition',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					mdccostcodefk: {
						'detail': {
							'type': 'directive',
							'directive': 'basics-cost-codes-lookup',
							'options': {
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = angular.copy(args.selectedItem);
											if (selectedItem && args.entity) {
												args.entity.CostPerUnit = selectedItem.Rate;
											}
										}
									}
								]
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'costcode',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupField: 'CostCodeFk',
								lookupOptions: {
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												let selectedItem = angular.copy(args.selectedItem);
												if(!args.entity){
													let entities = $injector.get('basicsMaterialPortionDataService').getSelectedEntities();
													_.forEach(entities,function (d) {
														d.CostPerUnit = selectedItem.Rate;
													});
												}
												if (selectedItem && args.entity) {
													args.entity.CostPerUnit = selectedItem.Rate;
												}
											}
										}
									]
								},
								directive: 'basics-cost-codes-lookup'
							}
						}
					},
					priceextra: {
						readonly: true
					},
					materialportiontypefk:{
						'detail': {
							bulkSupport: false,
							'type': 'directive',
							'directive': 'basics-material-portion-type-lookup',
							'options': {
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											MaterialPortionTypeChanged(e, args);
										}
									}
								]
							}
						},
						'grid': {
							bulkSupport: false,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'materialportiontype',
								displayMember: 'ExternalCode',
								version: 3
							},
							editor: 'lookup',
							editorOptions: {
								lookupField: 'MaterialPortionTypeFk',
								lookupOptions: {
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												MaterialPortionTypeChanged(e, args);
											}
										}
									]
								},
								directive: 'basics-material-portion-type-lookup'
							}
						}
					}
				}
			};
			basicsCommonRoundingService.getService('basics.material').uiRoundingConfig(layout);
			return layout;

			function MaterialPortionTypeChanged(e, args){
				let portionEntity = args.entity;
				let portionTypeEntity = args.selectedItem;
				if (portionEntity && portionTypeEntity){
					if (!portionEntity.MdcCostCodeFk && portionTypeEntity.MdcCostCodeFk){
						portionEntity.MdcCostCodeFk = portionTypeEntity.MdcCostCodeFk;
						$http.post(globals.webApiBaseUrl + 'basics/costcodes/getcostcodebyid', {Id: portionTypeEntity.MdcCostCodeFk})
							.then(function(response){
								let data = response.data;
								if (data && data.Rate){
									args.entity.CostPerUnit = data.Rate;

									$injector.get('basicsMaterialPortionDataService').fieldChanged('CostPerUnit',portionEntity);
								}
							});
					}

					if (!portionEntity.PrcPriceConditionFk && portionTypeEntity.PrcPriceConditionFk){
						portionEntity.PrcPriceConditionFk = portionTypeEntity.PrcPriceConditionFk;
						let basicsMaterialPortionValidationService = $injector.get('basicsMaterialPortionValidationService');
						basicsMaterialPortionValidationService.asyncValidatePrcPriceConditionFk(portionEntity, portionEntity.PrcPriceConditionFk,'PrcPriceConditionFk');
					}
				}
			}
		}
	]);

	angular.module(moduleName).factory('basicsMaterialPortionStandardConfigurationService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService',
			'basicsMaterialPortionLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService,layout, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;
				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialPortionDto',
					moduleSubModule: 'Basics.Material'
				});

				function MdcPortionUIStandardService(layout, schema, translateService) {
					BaseService.call(this, layout, schema, translateService);
				}

				MdcPortionUIStandardService.prototype = Object.create(BaseService.prototype);
				MdcPortionUIStandardService.prototype.constructor = MdcPortionUIStandardService;

				return new MdcPortionUIStandardService(layout, domainSchema.properties, translationService);
			}
		]);
})();
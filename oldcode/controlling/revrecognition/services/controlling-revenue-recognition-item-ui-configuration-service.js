/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	var cloudCommonModule = 'cloud.common';
	/**
     * @ngdoc service
     * @name controllingRevenueRecognitionUIConfigurationService
     * @function
     * @requires
     *
     * @description
     * The UI configuration service for the module.
     */
	angular.module(moduleName).factory('controllingRevenueRecognitionItemLayout', [
		function controllingRevenueRecognitionItemLayout() {
			return {
				fid: 'controlling.revenuerecognition.ItemForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['code','description','amountcontract','amountcontractco','amountcontracttotal','amountpervious','amountinc','amounttotal','percentage','remark','headerdate','prraccrualtype','postingnarrative','relevantdate','businesspartner']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						'Code': {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						'AmountContract': {location: moduleName, identifier: 'entityAmountContract', initial: 'Contract Value'},
						'AmountContractCo': {location: moduleName, identifier: 'entityAmountContractCo', initial: 'Change Order Value'},
						'AmountContractTotal': {location: moduleName, identifier: 'entityAmountContractTotal', initial: 'Total Contract Value'},
						'AmountPervious': {location: moduleName, identifier: 'entityAmountPerviousPeriod', initial: 'Previous Period'},
						'AmountInc': {location: moduleName, identifier: 'entityAmountIncPeriod', initial: 'Current Period'},
						'AmountTotal': {location: moduleName, identifier: 'entityTotal', initial: 'Total'},
						'Percentage': {location: moduleName, identifier: 'entityPercentage', initial: '%'},
						'HeaderDate': {location: moduleName, identifier: 'entityHeaderDate', initial: 'Header Date'},
						'RelevantDate': {location: moduleName, identifier: 'entityRelevantDate', initial: 'Relevant Date'},
						'PrrAccrualType': {location: moduleName, identifier: 'PrrAccrualType', initial: 'Accrual Type'},
						'PostingNarrative':{location: moduleName, identifier: 'PostingNarrative', initial: 'Posting Narrative'},
						'BusinessPartner':{location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'}
					}
				},
				overloads:{
					'code':{
						readonly:true,
						'grid':{
							formatter: function (row, cell, value, columnDef, entity) {
								if(entity.Abbreviation&&entity.Abbreviation.length>0){
									value=value+'<sup style="top: 0.2em;">'+entity.Abbreviation+'</sup>';
								}
								return value;
							}
						}
					},
					'postingnarrative':{
						'maxLength': 252
					},
					'prraccrualtype': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {'showClearButton': true},
								'directive': 'controlling-revenue-recognition-accrual-type-combobox'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'RevenueRecognitionAccrualType', 'displayMember': 'Description', 'version':3},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'controlling-revenue-recognition-accrual-type-combobox',
								'descriptionMember': 'Description'
							}
						}
					},
					'businesspartner': {
						readonly: true
					}
				}
			};
		}
	]);


	angular.module(moduleName).factory('controllingRevenueRecognition2ItemUIStandardService',

		['platformUIStandardConfigService', 'controllingRevenueRecognitionTranslationService', 'platformSchemaService', 'controllingRevenueRecognitionItemLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, controllingRevenueRecognitionItemLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrrItemDto',
					moduleSubModule: 'Controlling.RevRecognition'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(controllingRevenueRecognitionItemLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, controllingRevenueRecognitionItemLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);

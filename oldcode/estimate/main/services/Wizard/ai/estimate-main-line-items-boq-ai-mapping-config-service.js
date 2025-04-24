/**
 * Created by gvj on 9/10/2018.
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainLineItemsBoqAiMappingLayout', {
		fid: 'estimate.main.aiLineItemsBoq.dialog',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'ischeckai', 'descriptioninfo', 'boqitemfk', 'origboqitemfk']
			}
		],
		translationInfos: {
			'extraModules': [moduleName],
			'extraWords': {
				IsCheckAi: {location: moduleName, identifier: 'aiWizard.checkSuggested', initial: 'Check Suggested'},
				Code: {location: moduleName, identifier: 'aiWizard.lineItemCode', initial: 'Line Item Code'},
				DescriptionInfo: {
					location: moduleName,
					identifier: 'aiWizard.lineItemDescription',
					initial: 'Line Item Description'
				},
				BoqItemFk: {
					location: moduleName,
					identifier: 'aiWizard.suggestedBoqCode',
					initial: 'Suggested Boq Code'
				},
				OrigBoqItemFk: {
					location: moduleName,
					identifier: 'aiWizard.originalBoqCode',
					initial: 'Original Boq Code'
				}
			}
		},
		'overloads': {
			'code': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					width: 80
				}
			},
			'boqitemfk': {
				'grid': {
					width: 150,
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true
						},
						lookupDirective: 'estimate-main-line-items-boq-ai-mapping-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BoqItem',
						displayMember: 'Reference'
					},
					validator: 'validateBoqItemFk'
				}
			},
			'ischeckai': {
				headerChkbox: true,
				width: 120,
				editor: 'boolean',
				formatter: 'boolean',
				cssClass: 'cell-center'
			},
			'descriptioninfo': {
				'readonly': true,
				'grid': {width: 210}
			},

			'origboqitemfk': {
				'readonly': true,
				'grid': {
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BoqItem',
						displayMember: 'Reference'
					}
				}
			}
		},
		'addition': {
			grid: [
				{
					lookupDisplayColumn: true,
					field: 'BoqItemFk',
					name$tr$: 'estimate.main.aiWizard.suggestedBoqDescription',
					displayMember: 'BriefInfo.Translated',
					width: 210
				},
				{
					lookupDisplayColumn: true,
					field: 'OrigBoqItemFk',
					name$tr$: 'estimate.main.aiWizard.originalBoqDescription',
					displayMember: 'BriefInfo.Translated',
					width: 210
				}
			]
		}

	});

	angular.module(moduleName).factory('estimateMainLineItemsBoqAiMappingConfiguration',
		['platformUIStandardConfigService', 'estimateMainLineItemsBoqAiMappingTranslationService',
			'estimateMainLineItemsBoqAiMappingLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstLineItem2BoqMappingDto',
					moduleSubModule: 'Estimate.Main'
				});

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;
				let service = new BaseService(layout, domainSchema.properties, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema.properties);

				return service;
			}
		]);
})();


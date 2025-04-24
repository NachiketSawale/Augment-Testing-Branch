/**
 * Created by chd on 4/16/2020.
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainLineItemsActivityAiMappingLayout', {
		fid: 'estimate.main.aiLineItemsActivity.dialog',
		'version': '1.2.0',
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'ischeckai', 'descriptioninfo', 'psdactivityfk', 'origpsdactivityfk']
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
				PsdActivityFk: {
					location: moduleName,
					identifier: 'aiWizard.suggestedActivityCode',
					initial: 'Suggested Activity Code'
				},
				OrigPsdActivityFk: {
					location: moduleName,
					identifier: 'aiWizard.originalActivityCode',
					initial: 'Original Activity Code'
				}
			}
		},
		'overloads': {
			'code': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					width: 100
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
				'grid': {width: 180}
			},
			'psdactivityfk': {
				'grid': {
					width: 150,
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true
						},
						lookupDirective: 'estimate-main-line-items-activity-ai-mapping-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SchedulingActivity',
						displayMember: 'Code'
					},
					validator: 'validateActivityFk'
				}
			},
			'origpsdactivityfk': {
				'readonly': true,
				'grid': {
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SchedulingActivity',
						displayMember: 'Code'
					}
				}
			}
		},
		'addition': {
			grid: [
				{
					lookupDisplayColumn: true,
					field: 'PsdActivityFk',
					name$tr$: 'estimate.main.aiWizard.suggestedActivityDescription',
					displayMember: 'Description',
					width: 210
				},
				{
					lookupDisplayColumn: true,
					field: 'OrigPsdActivityFk',
					name$tr$: 'estimate.main.aiWizard.originalActivityDescription',
					displayMember: 'Description',
					width: 210
				}
			]
		}

	});

	angular.module(moduleName).factory('estimateMainLineItemsActivityAiMappingConfiguration',
		['platformUIStandardConfigService', 'estimateMainLineItemsActivityAiMappingTranslationService',
			'estimateMainLineItemsActivityAiMappingLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstLineItem2ActivityMappingDto',
					moduleSubModule: 'Estimate.Main'
				});

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;
				let service = new BaseService(layout, domainSchema.properties, translationService);

				platformUIStandardExtentService.extend(service, layout.addition);

				return service;
			}
		]);
})();



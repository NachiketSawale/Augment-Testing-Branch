/**
 * @author: chd
 * @date: 10/20/2020 1:33 PM
 * @description:
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainLineItemsCostGroupAiMappingLayout', {
		fid: 'estimate.main.aiLineItemsCostGroup.dialog',
		'version': '1.1.0',
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'ischeckai', 'descriptioninfo']
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
			}
		}
	});

	angular.module(moduleName).factory('estimateMainLineItemsCostGroupAiMappingConfiguration',
		['platformUIStandardConfigService', 'estimateMainLineItemsCostGroupAiMappingTranslationService',
			'estimateMainLineItemsCostGroupAiMappingLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstLineItem2CostGroupMappingDto',
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



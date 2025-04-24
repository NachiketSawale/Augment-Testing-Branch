/**
 * @author: chd
 * @date: 5/20/2021 10:10 AM
 * @description:
 */

(function () {
	'use strict';
	var modName = 'defect.main';
	var cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('defectAiEstimateCostLayout',
		[
			function () {
				return {
					'fid': 'defect.aiDefectAiEstimateCost.dialog',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['ischecked', 'code', 'description', 'estimatecost', 'origestimatecost']
						}
					],
					'translationInfos': {
						'extraModules': [modName, cloudCommonModule],
						'extraWords': {
							IsChecked: {location: modName, identifier: 'aiWizard.isChecked', initial: 'Is Checked'},
							Code: {location: cloudCommonModule, identifier: 'entityReferenceCode', initial: 'Reference Code'},
							Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
							EstimateCost: {location: modName, identifier: 'aiWizard.aiEstimateCost', initial: 'AI Estimated Cost'},
							OrigEstimateCost: {location: modName, identifier: 'aiWizard.origEstimateCost', initial: 'Original Estimate Cost'}
						}
					},
					'overloads': {
						'code': {
							'mandatory': true,
							'readonly': true,
							'grid': {
								width: 90
							}
						},
						'ischecked': {
							headerChkbox: true,
							width: 90,
							editor: 'boolean',
							formatter: 'boolean',
							cssClass: 'cell-center'
						},
						'description': {
							'mandatory': true,
							'readonly': true,
							'grid': {
								width: 400
							}
						},
						'estimatecost': {
							'mandatory': true,
							'grid': {
								width: 110
							}
						},
						'origestimatecost': {
							'mandatory': true,
							'readonly': true,
							'grid': {
								width: 130
							}
						}
					}
				};
			}
		]);
	angular.module(modName).factory('defectAiEstimateCostUIStandardService',
		['platformUIStandardConfigService', 'defectAiTranslationService',
			'defectAiEstimateCostLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DfmDefectEstimationDto',
					moduleSubModule: 'Defect.Main'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();

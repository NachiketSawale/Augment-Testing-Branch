/**
 * Created by gaz on 04/05/2018.
 */

(function () {
	'use strict';
	var modName = 'defect.main';
	var cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('defectAiEstimateDurationLayout',
		[
			function () {
				return {
					'fid': 'defect.aiDefectAiEstimateDuration.dialog',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['ischecked', 'code', 'description', 'estimatelaborhours','origestimatelaborhours']
						}
					],
					'translationInfos': {
						'extraModules': [modName, cloudCommonModule],
						'extraWords': {
							IsChecked: {location: modName, identifier: 'aiWizard.isChecked', initial: 'Is Checked'},
							Code: {location: cloudCommonModule, identifier: 'entityReferenceCode', initial: 'Reference Code'},
							Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
							EstimateLaborHours: {location: modName, identifier: 'aiWizard.aiEstimateLaborHours', initial: 'AI Estimated Labor Hours'},
							OrigEstimateLaborHours: {location: modName, identifier: 'aiWizard.origEstimateLaborHours', initial: 'Original Labor Hours'}
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
						'estimatelaborhours': {
							'mandatory': true,
							'grid': {
								'editorOptions': {'decimalPlaces': 2},
								width: 150
							}
						},
						'origestimatelaborhours': {
							'mandatory': true,
							'readonly': true,
							'grid': {
								'formatterOptions': {'decimalPlaces': 2},
								width: 120
							}
						}
					}
				};
			}
		]);

	angular.module(modName).factory('defectAiEstimateDurationUIStandardService',
		['platformUIStandardConfigService', 'defectAiTranslationService',
			'defectAiEstimateDurationLayout', 'platformSchemaService', 'platformUIStandardExtentService',

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

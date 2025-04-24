/**
 * Created by gaz on 04/05/2018.
 */
/* global */
(function () {
	'use strict';
	var modName = 'defect.main';
	var cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('defectAiEstimateLayout',
		[
			function () {
				return {
					'fid': 'defect.aiDefectAiEstimate.dialog',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['ischecked', 'code', 'description', 'estimatecost', 'estimatelaborhours', 'origestimatecost','origestimatelaborhours']
						}
					],
					'translationInfos': {
						'extraModules': [modName, cloudCommonModule],
						'extraWords': {
							IsChecked: {location: modName, identifier: 'aiWizard.isChecked', initial: 'Is Checked'},
							Code: {location: cloudCommonModule, identifier: 'entityReferenceCode', initial: 'Reference Code'},
							Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
							EstimateCost: {location: modName, identifier: 'aiWizard.aiEstimateCost', initial: 'AI Estimated Cost'},
							EstimateLaborHours: {location: modName, identifier: 'aiWizard.aiEstimateLaborHours', initial: 'AI Estimated Labor Hours'},
							OrigEstimateCost: {location: modName, identifier: 'aiWizard.origEstimateCost', initial: 'Original Estimate Cost'},
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
						'estimatecost': {
							'mandatory': true,
							'grid': {
								width: 110
							}
						},
						'estimatelaborhours': {
							'mandatory': true,
							'grid': {
								'editorOptions': {'decimalPlaces': 2},
								width: 150
							}
						},
						'origestimatecost': {
							'mandatory': true,
							'readonly': true,
							'grid': {
								width: 130
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
	angular.module(modName).factory('defectAiEstimateUIStandardService',
		['platformUIStandardConfigService', 'defectAiTranslationService',
			'defectAiEstimateLayout', 'platformSchemaService', 'platformUIStandardExtentService',

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

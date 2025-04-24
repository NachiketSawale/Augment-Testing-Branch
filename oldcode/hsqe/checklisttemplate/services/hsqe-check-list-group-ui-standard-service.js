/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklisttemplate';
	var cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('hsqeCheckListGroupLayout', [
		function hsqeCheckListGroupLayout() {
			return {
				fid: 'hsqe.checklisttemplate.groupdetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['code','descriptioninfo', 'isdefault','islive']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						'Code': {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						'IsDefault': { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' },
						'IsLive': { location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Is Live' }
					}
				},
				overloads: {
					'code': {
						'mandatory': true
					},
					'descriptioninfo': {
						detail: {
							maxLength: 255
						},
						grid: {
							maxLength: 255
						}
					},
					'isdefault': {
						change:'setDefault'
					}
				}
			};
		}
	]);

	angular.module(moduleName).factory('hsqeCheckListGroupUIStandardService',

		['platformUIStandardConfigService', 'hsqeCheckListTemplateTranslationService', 'platformSchemaService', 'hsqeCheckListGroupLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, hsqeCheckListGroupLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'HsqCheckListGroupDto',
					moduleSubModule: 'Hsqe.CheckListTemplate'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(hsqeCheckListGroupLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, hsqeCheckListGroupLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);

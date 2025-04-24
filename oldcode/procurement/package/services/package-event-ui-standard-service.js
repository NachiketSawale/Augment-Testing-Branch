/**
 * Created by wuj on 8/19/2015.
 */
(function () {
	'use strict';
	var modName = 'procurement.package';

	angular.module(modName).factory('procurementPackageEventLayout',
		function () {
			return {
				'fid': 'procurement.package.event.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['prceventtypefk', 'startcalculated', 'endcalculated',
							'startoverwrite', 'endoverwrite', 'startactual', 'endactual', 'startrelevant', 'endrelevant', 'commenttext']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'prceventtypefk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurement-structure-event-type-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcEventType',
								displayMember: 'DescriptionInfo.Translated'
							},
							width: 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-structure-event-type-combobox',
							'options': {
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'startcalculated': {readonly: true},
					'endcalculated': {readonly: true},
					'startactual': {readonly: true},
					'endactual': {readonly: true},
					'startrelevant': {readonly: true},
					'endrelevant': {readonly: true}
				}
			};
		});

	angular.module(modName).factory('procurementPackageEventUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageTranslationService', 'procurementPackageEventLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcPackageEventDto',
					moduleSubModule: 'Procurement.Package'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();
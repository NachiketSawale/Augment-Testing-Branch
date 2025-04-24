(function () {
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';

	angular.module( modName ).value('procurementCommonMilestoneLayout', {
		'fid': 'procurement.common.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['prcmilestonetypefk', 'mdctaxcodefk', 'amount', 'milestone', 'commenttext']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				PrcMilestonetypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'entityType' },
				Milestone: { location: cloudCommonModule, identifier: 'entityDate', initial: 'entityDate' },
				CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment' },
				MdcTaxCodeFk: { location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'entityTaxCode'},
				Amount: { location: cloudCommonModule, identifier: 'entityAmount', initial: 'entityAmount'}
			}
		},
		'overloads': {
			'prcmilestonetypefk': {
				'detail': {
					'type': 'directive',
					'directive': 'procurement-common-milestone-type-combobox'
				},
				'grid': {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MilestoneType',
						displayMember: 'DescriptionInfo.Translated'
					},
					editor: 'lookup',
					editorOptions: {
						directive: 'procurement-common-milestone-type-combobox'
					},
					validator: 'prcMilestoneTypeValidator',
					width: 120
				}
			},
			'mdctaxcodefk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'basics-master-data-context-tax-code-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				'grid': {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'TaxCode',
						displayMember: 'Code'
					},
					editor: 'lookup',
					editorOptions: {
						lookupField: 'MdcTaxCodeFk',
						lookupOptions: {
							showClearButton: true
						},
						directive: 'basics-master-data-context-tax-code-lookup'
					},
					width: 100
				}
			},
			'milestone': {
				'mandatory': true
			},
			'commenttext': {
				'mandatory': true
			}

		}
	});

	angular.module( modName ).factory('procurementCommonMilestoneUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonMilestoneLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcMilestoneDto',
					moduleSubModule: 'Procurement.Common'
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
				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function (){
					return angular.copy(basicGetStandardConfigForDetailView());
				};
				return service;
			}
		]);
})();

(function () {
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).value('procurementCommonCertificateLayout', {
		'fid': 'procurement.common.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['bpdcertificatetypefk', 'isrequired', 'ismandatory', 'isrequiredsubsub', 'ismandatorysubsub', 'requiredby',
					'requiredamount', 'commenttext', 'guaranteecost', 'guaranteecostpercent', 'validfrom', 'validto']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				BpdCertificateTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'entityType' },
				Isrequired: { location: modName, identifier: 'certificateIsRequired', initial: 'certificateIsRequired' },
				Ismandatory: { location: modName, identifier: 'certificateIsMandatory', initial: 'certificateIsMandatory' },
				Isrequiredsubsub: { location: modName, identifier: 'certificateIsRequiredSubSub', initial: 'certificateIsRequiredSubSub' },
				Ismandatorysubsub: { location: modName, identifier: 'certificateIsMandatorySubSub', initial: 'certificateIsMandatorySubSub' },
				RequiredBy: { location: modName, identifier: 'certificateRequiredBy', initial: 'certificateRequiredBy' },
				RequiredAmount: { location: modName, identifier: 'certificateRequiredAmount', initial: 'certificateRequiredAmount' },
				CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment' },
				GuaranteeCost: {location: cloudCommonModule, identifier: 'guaranteeCost', initial: 'Guarantee Cost'},
				GuaranteeCostPercent: {location: cloudCommonModule, identifier: 'guaranteeCostPercent', initial: 'Guarantee Cost Percent'},
				ValidFrom: {location: cloudCommonModule, identifier: 'validFrom', initial: 'Valid From'},
				ValidTo: {location: cloudCommonModule, identifier: 'validTo', initial: 'Valid To'}
			}
		},
		'overloads': {
			'bpdcertificatetypefk': {
				'detail': {
					'type': 'directive',
					'directive': 'businesspartner-certificate-certificate-type-combobox',
					'options': {
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'prc-certificate-type-filter'
						}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'businesspartner-certificate-certificate-type-combobox',
						lookupOptions: { filterKey: 'prc-certificate-type-filter' }
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CertificateType',
						displayMember: 'Description'
					},
					width: 80
				}
			},
			'isrequired': {
				'mandatory': true
			},
			'ismandatory': {
				'mandatory': true
			},
			'isrequiredsubsub': {
				'mandatory': true
			},
			'ismandatorysubsub': {
				'mandatory': true
			},
			'requiredby': {
				'mandatory': true
			},
			'requiredamount': {
				'mandatory': true
			},
			'commenttext': {
				'mandatory': true
			}
		}
	});

	angular.module(modName).factory('procurementCommonCertificateUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonCertificateLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcCertificateDto',
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

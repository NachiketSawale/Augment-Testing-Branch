/**
 * Created by wuj on 3/4/2015.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementstructure', cloudCommonModule = 'cloud.common';
	var mod = angular.module(modName);

	mod.factory('basicsProcurementConfiguration2CertLayout',
		['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'basics.procurementstructure.configuration2Cert.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['prcconfigheaderfk', 'bpdcertificatetypefk', 'isrequired',
							'ismandatory', 'isrequiredsubsub', 'ismandatorysubsub', 'commenttext',
							'guaranteecost', 'guaranteecostpercent', 'amount', 'validfrom', 'validto']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						PrcConfigHeaderFk: {location: modName, identifier: 'configuration', initial: 'Configuration Header'},
						BpdCertificateTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						IsRequired: {location: modName, identifier: 'isRequired', initial: 'Is Required'},
						IsMandatory: {location: modName, identifier: 'isMandatory', initial: 'Is Mandatory'},
						IsRequiredSubSub: {
							location: modName,
							identifier: 'isRequiredSubSub',
							initial: 'Is Required Sub Sub'
						},
						IsMandatorySubSub: {
							location: modName,
							identifier: 'isMandatorySubSub',
							initial: 'Is Mandatory Sub Sub'
						},
						CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
						GuaranteeCost: {location: cloudCommonModule, identifier: 'guaranteeCost', initial: 'Guarantee Cost'},
						GuaranteeCostPercent: {location: cloudCommonModule, identifier: 'guaranteeCostPercent', initial: 'Guarantee Cost Percent'},
						Amount: {location: cloudCommonModule, identifier: 'amount', initial: 'Amount'},
						ValidFrom: {location: cloudCommonModule, identifier: 'validFrom', initial: 'Valid From'},
						ValidTo: {location: cloudCommonModule, identifier: 'validTo', initial: 'Valid To'}
					}
				},
				'overloads': {
					'prcconfigheaderfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-config-header-combo-box'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcConfigHeader',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurement-configuration-config-header-combo-box'
							},
							width: 120
						}
					},
					'bpdcertificatetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.main.certificatetype')
				}
			};
		}]);

	mod.factory('basicsProcurementConfiguration2CertUIStandardService',
		['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
			'basicsProcurementConfiguration2CertLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcConfiguration2CertDto',
					moduleSubModule: 'Basics.ProcurementStructure'
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
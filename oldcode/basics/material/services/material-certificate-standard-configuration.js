/**
 * Created by clv on 3/12/2018.
 */
(function(angular){

	'use strict';

	var moduleName = 'basics.material', cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsMaterial2CertificateLayout', ['basicsLookupdataConfigGenerator', function(basicsLookupdataConfigGenerator){
		return {
			fid : 'basics.material.certificate.detail',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [{
				gid: 'basicData',
				attributes: ['materialfk', 'prcstructurefk','bpdcertificatetypefk', 'isrequired', 'ismandatory', 'isrequiredsub', 'ismandatorysub', 'commenttext']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}],
			translationInfos:{
				extraModules: [moduleName, cloudCommonModule],
				extraWords: {
					MaterialFk: {location: moduleName, identifier: 'record.material', initial: 'Material'},
					PrcStructureFk: {location: moduleName, identifier: 'materialSearchLookup.htmlTranslate.structure', initial: 'Structure'},
					BpdCertificateTypeFk: {location: moduleName, identifier: 'certificate.type', initial: 'Certificate Type'},
					IsRequired: {location: moduleName, identifier: 'certificate.isRequired', initial: 'Is Required'},
					IsMandatory: {location: moduleName, identifier: 'certificate.isMandatory', initial: 'Is Mandatory'},
					IsRequiredSub: {
						location: moduleName,
						identifier: 'certificate.isRequiredSubSub',
						initial: 'Is Required Sub'
					},
					IsMandatorySub: {
						location: moduleName,
						identifier: 'certificate.isMandatorySubSub',
						initial: 'Is Mandatory Sub'
					},
					CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'}
				}
			},
			overloads: {
				materialfk: {
					detail: {
						type: 'directive',
						directive: 'basics-material-material-lookup',
						options: {
							filterKey: 'material-certificate-material-filter'
						}
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						}
					},
					readonly: true
				},
				prcstructurefk: {
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'Prcstructure',
							'displayMember': 'Code'
						},
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-procurementstructure-structure-dialog',
							'lookupOptions': {
								'showClearButton': true
							}
						},
						'width': 150
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-procurementstructure-structure-dialog',
							'descriptionMember': 'DescriptionInfo.Translated',
							'lookupOptions': {
								'showClearButton': true
							}
						}
					}
				},
				bpdcertificatetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.main.certificatetype')
			}
		};
	}]);

	angular.module(moduleName).factory('basicsMaterial2CertificateUIStandardService', basicsMaterial2CertificateUIStandardService);
	basicsMaterial2CertificateUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsMaterialTranslationService',
		'basicsMaterial2CertificateLayout', 'platformSchemaService'];
	function basicsMaterial2CertificateUIStandardService(platformUIStandardConfigService, basicsMaterialTranslationService,
					 basicsMaterial2CertificateLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Material2CertificateDto',
			moduleSubModule: 'Basics.Material'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}
		function UIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UIStandardService.prototype = Object.create(BaseService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;

		return new BaseService(basicsMaterial2CertificateLayout, domainSchema, basicsMaterialTranslationService);
	}
})(angular);
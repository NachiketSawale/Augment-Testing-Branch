

/**
 * Created by wwa on 11/4/2015.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var modName = 'businesspartner.main', cloudCommon = 'cloud.common';

	angular.module(modName).factory('businessPartnerRelationLayout', ['platformModuleNavigationService', 'platformObjectHelper', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataConfigGenerator',
		function (naviservice, platformObjectHelper, basicsLookupdataLookupDescriptorService, basicsLookupdataConfigGenerator) {
			return {
				'fid': 'businesspartner.main.relation.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['businesspartnerfk', 'businesspartner2fk', 'relationtypefk', 'remark', 'bpsubsidiaryfk', 'bpsubsidiary2fk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [cloudCommon],
					'extraWords': {
						BusinessPartnerFk: {
							location: modName,
							identifier: 'entityBpOwner',
							initial: 'BP Owner'
						},

						BusinessPartner2Fk: {
							location: modName,
							identifier: 'entityBpOpposite',
							initial: 'BP Opposite'
						},

						RelationTypeFk: {
							location: modName,
							identifier: 'bpRelation',
							initial: 'Business Partner Relation'
						},
						Remark: {
							location: cloudCommon,
							identifier: 'entityRemark',
							initial: 'remark'
						},
						BpSubsidiaryFk: {
							location: modName,
							identifier: 'bpBranch',
							initial: 'BP Branch'
						},
						BpSubsidiary2Fk: {
							location: modName,
							identifier: 'bpOppositeBranch',
							initial: 'BP Opposite Branch'
						}
					}
				},
				'overloads': {
					'businesspartnerfk': {
						'grid': {
							'formatter': 'lookup',// fieldFormatter,
							'formatterOptions': {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-main-business-partner-dialog',
								lookupOptions: {}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog',
							'options': {
								lookupDirective: 'business-partner-main-business-partner-dialog'
							},
							'model': 'BusinessPartnerFk'
						},
						'width': 150,
						'readonly': true
					},
					'businesspartner2fk': {
						'navigator': {
							// modulename can't not equalt to businesspartner.main because basic function[platform-grid-domain-service] will check if is current module
							// if is current module,navigator do
							moduleName: 'businesspartner.main.opposite',
							// registerService: 'businesspartnerMainHeaderDataService'
							navFunc: function (options, entity) {
								// set the real modulename to navigator
								var opt = angular.copy(options);
								opt.navigator.moduleName = modName;
								naviservice.navigate(opt.navigator, entity, opt.field || opt.model);
							}
						},
						'grid': {
							'formatter': 'lookup',// fieldFormatter,
							'formatterOptions': {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-main-business-partner-dialog',
								lookupOptions: {}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog',
							'options': {
								lookupDirective: 'business-partner-main-business-partner-dialog'
							}
						},
						'width': 150
					},
					'relationtypefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'BusinessPartnerRelationType',
								displayMember: 'DescriptionInfo.Translated'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-relation-type-Lookup',
								lookupOptions: {}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-relation-type-Lookup'
						},
						'width': 150
					},
					'bpsubsidiaryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
						additionalColumns: false,
						enableCache: true,
						filter: function (item) {
							if (item) {
								return (item && item.BusinessPartnerFk) ? (item.BusinessPartnerFk) : -1;
							}
							return 0;
						}
					}),
					'bpsubsidiary2fk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									displayMember: 'SubsidiaryDescription',
									filterKey: 'businesspartner-main-relation-subsidiary2-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'SubsidiaryDescription'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								filterKey: 'businesspartner-main-relation-subsidiary2-filter',
								showClearButton: true,
								displayMember: 'SubsidiaryDescription'
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'businesspartnerfk',
							'id': 'OwnerStatus',
							'field': 'BusinessPartnerFk',
							'name': 'Owner Status',
							'name$tr$': modName + '.OwnerStatus',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'StatusDescriptionTranslateInfo.Translated'
							},
							width: 140
						},
						{
							'afterId': 'businesspartner2fk',
							'id': 'OppositeStatus',
							field: 'BusinessPartner2Fk',
							'name': 'Opposite Status',
							'name$tr$': modName + '.OppositeStatus',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'StatusDescriptionTranslateInfo.Translated'
							},
							width: 140
						},
						{
							afterId: 'businesspartner2fk',
							id: 'AddressLine',
							field: 'AddressLine',
							name: 'Address',
							name$tr$: modName +'.oppositeAddress',
							sortable: true,
							formatter: 'comment',
							readonly: true,
							width: 140
						},
						{
							afterId: 'bpsubsidiaryfk',
							id: 'subsidiaryAddress',
							field: 'BpSubsidiaryFk',
							name: 'BP Branch Address',
							name$tr$: modName + '.bpBranchAddress',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'businessPartnerMainSubsidiaryLookupDataService',
								dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
								displayMember: 'AddressDto.AddressLine'
							},
							readonly: true,
							width: 140
						},
						{
							afterId: 'bpsubsidiary2fk',
							id: 'subsidiary2Address',
							field: 'BpSubsidiary2Fk',
							name: 'BP Opposite Branch Address',
							name$tr$: modName + '.bpOppositeBranchAddress',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine'
							},
							readonly: true,
							width: 140
						}
					],
					'detail': [
						{
							'afterId': 'businesspartner2fk',
							'rid': 'OwnerStatus',
							'gid': 'basicData',
							'model': 'BusinessPartnerFk',
							'label': 'Owner Status',
							'label$tr$': modName + '.OwnerStatus',
							'readonly': true,
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								lookupDirective: 'business-partner-main-business-partner-dialog-without-teams',
								displayMember: 'StatusDescriptionTranslateInfo.Translated'
							}
						},
						{
							'afterId': 'relationtypefk',
							'rid': 'OppositeStatus',
							'gid': 'basicData',
							'model': 'BusinessPartner2Fk',
							'label': 'Opposite Status',
							'label$tr$': modName + '.OppositeStatus',
							'readonly': true,
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								lookupDirective: 'business-partner-main-business-partner-dialog-without-teams',
								displayMember: 'StatusDescriptionTranslateInfo.Translated'
							}
						},
						{
							afterId: 'relationtypefk',
							rid: 'AddressLine',
							gid: 'basicData',
							model: 'AddressLine',
							label: 'Address',
							label$tr$: 'cloud.common.entityAddress',
							readonly: true,
							type: 'comment'
						},
						{
							'afterId': 'bpsubsidiaryfk',
							'rid': 'bpBranchAddress',
							'gid': 'basicData',
							'model': 'BpSubsidiaryFk',
							'label': 'BP Branch Address',
							'label$tr$': modName + '.bpBranchAddress',
							'readonly': true,
							'type': 'directive',
							'directive': 'basics-lookup-data-by-custom-data-service',
							'options': {
								lookupType: 'businessPartnerMainSubsidiaryLookupDataService',
								dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
								valueMember: 'Id',
								displayMember: 'AddressDto.AddressLine',
								lookupModuleQualifier: 'businessPartnerMainSubsidiaryLookupDataService',
								isClientSearch: true
							}
						},
						{
							'afterId': 'bpsubsidiary2fk',
							'rid': 'bpOppositeBranchAddress',
							'gid': 'basicData',
							'model': 'BpSubsidiary2Fk',
							'label': 'BP Opposite Branch Address',
							'label$tr$': modName + '.bpOppositeBranchAddress',
							'readonly': true,
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								lookupDirective: 'business-partner-main-subsidiary-lookup',
								displayMember: 'AddressLine'
							}
						}
					]
				}
			};

			// eslint-disable-next-line no-unused-vars
			function fieldFormatter(row, cell, value, columnDef, dataContext, plainText) {// jshint ignore: line
				var result = '';
				var targetData = basicsLookupdataLookupDescriptorService.getData(columnDef.formatterOptions.lookupType);
				if (dataContext) {
					value = platformObjectHelper.getValue(dataContext, columnDef.field);
				}
				if (!_.isEmpty(targetData)) {
					var item = targetData[value];
					if (!_.isEmpty(item)) {
						result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember);
					}
				}

				if (result === null) {
					result = '';
				}
				return plainText ? value : result;
			}
		}]);

	angular.module(modName).factory('businessPartnerRelationUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainTranslationService', 'businessPartnerRelationLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'BusinessPartnerRelationDto',
					moduleSubModule: 'BusinessPartner.Main'
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

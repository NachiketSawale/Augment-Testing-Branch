/**
 * Created by lcn on 11/16/2021.
 */

(function () {

	'use strict';
	var moduleName = 'procurement.package';
	var procurementCommonModule = 'procurement.common';
	var cloudCommonModule = 'cloud.common';
	var procurementRfqModule = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementPackage2ExtBidderLayout', procurementPackage2ExtBidderLayout);
	procurementPackage2ExtBidderLayout.$inject = ['basicsLookupdataConfigGenerator', '$injector', 'basicsCommonCommunicationFormatter'];

	function procurementPackage2ExtBidderLayout(basicsLookupdataConfigGenerator, $injector, communicationFormatter) {
		function getDataService() {
			return $injector.get('procurementPackage2ExtBidderService').loadControllerInitData().dataService;
		}

		return {
			'fid': 'procurement.package.extbidder.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['subsidiaryfk', 'bpname1', 'bpname2', 'street',
						'city', 'zipcode', 'email', 'countryfk', 'telephone', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4',
						'userdefined5', 'commenttext', 'remark','rolefk', 'bpdstatusfk']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'overloads': {
				'zipcode': {regex: '^[\\s\\S]{0,20}$'},
				'bpdstatusfk': {
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartnerStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						},
						name: 'Status',
						name$tr$: 'procurement.common.entityBusinessPartnerStatus'
					},
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-status-combobox',
						'options': {
							readOnly: true,
							imageSelector: 'platformStatusIconService'
						},
						'label': 'Status',
						'label$tr$': 'procurement.common.entityBusinessPartnerStatus'
					},
					readonly: true
				},
				'bpname1': {
					'navigator': {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService',
						targetIdProperty: 'BusinessPartnerFk',
						hide: function (entity) {
							return !entity || !entity.BusinessPartnerFk;
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'filter-business-partner-dialog-bidders-lookup',
						'options': {
							displayMember: 'BusinessPartnerName1',
							isTextEditable: true,
							showClearButton: true,
							'IsShowBranch': true,
							'mainService':'procurementPackage2ExtBidderService',
							'BusinessPartnerField':'BusinesspartnerFk',
							'SubsidiaryField':'SubsidiaryFk',
						},
						'label': 'Business Partner',
						'label$tr$': 'procurement.common.entityBusinessPartnerName1'
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							'directive': 'filter-business-partner-dialog-bidders-lookup',
							showClearButton: true,
							displayMember: 'BusinessPartnerName1',
							isTextEditable: true,
							'IsShowBranch': true,
							'mainService':'procurementPackage2ExtBidderService',
							'BusinessPartnerField':'BusinesspartnerFk',
							'SubsidiaryField':'SubsidiaryFk'
						},
						name: 'Business Partner',
						name$tr$: 'procurement.common.entityBusinessPartnerName1'
					}
				},
				'subsidiaryfk': {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							filterKey: 'procurement-package-extbidder-businesspartner-subsidiary-filter',
							showClearButton: true,
							displayMember: 'AddressLine'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								filterKey: 'procurement-package-extbidder-businesspartner-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						}
					}
				},
				'rolefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.bprole'),
				'countryfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.country'),
				'email': {
					'grid': {
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-email-input',
							getDataService: getDataService
						},
						formatter: communicationFormatter,
						formatterOptions: {
							domainType: 'email'
						},
						width: 150
					},
					'detail': {
						type: 'directive',
						directive: 'basics-common-email-input',
						getDataService: getDataService
					}
				},
				'telephone': {
					'grid': {
						formatter: communicationFormatter,
						formatterOptions: {
							lookupDisplayColumn: true,
							domainType: 'phone',
							getItemText: function (model) {
								return model;
							}
						}
					},
					'detail': {
						readonly: false,
						'lookupDisplayColumn': true,
						'type': 'directive',
						'directive': 'basics-common-telephone-dialog',
						'options': {
							hideEditButton: true,
							getItemText: function (model) {
								return model;
							}
						}
					}
				}
			},
			'translationInfos': {
				'extraModules': [procurementCommonModule, cloudCommonModule, procurementRfqModule],
				'extraWords': {
					BpdStatusFk: {
						location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'
					},
					ContactFk: {
						location: procurementCommonModule, identifier: 'contactFirstName', initial: 'Contact First Name'
					},
					SubsidiaryFk: {
						location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'
					},
					BpName1: {
						location: cloudCommonModule, identifier: 'entityBusinessPartnerName1', initial: 'Business Partner Name1'
					},
					BpName2: {
						location: cloudCommonModule, identifier: 'entityBusinessPartnerName2', initial: 'Business Partner Name2'
					},
					Street: {
						location: cloudCommonModule, identifier: 'entityStreet', initial: 'Street'
					},
					City: {
						location: cloudCommonModule, identifier: 'entityCity', initial: 'City'
					},
					Zipcode: {
						location: cloudCommonModule, identifier: 'entityZipCode', initial: 'Zip Code'
					},
					Email: {
						location: cloudCommonModule, identifier: 'email', initial: 'E-Mail'
					},
					CountryFk: {
						location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country'
					},
					Telephone: {
						location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: 'Phone Number'
					},
					UserDefined1: {
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined1', param: {'p_0': '1'}
					},
					UserDefined2: {
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined2', param: {'p_0': '2'}
					},
					UserDefined3: {
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined3', param: {'p_0': '3'}
					},
					UserDefined4: {
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined4', param: {'p_0': '4'}
					},
					UserDefined5: {
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined5', param: {'p_0': '5'}
					},
					CommentText: {
						location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'
					},
					Remark: {
						location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'
					},
					RoleFk: {
						location: procurementCommonModule, identifier: 'entityBPRole', initial: 'BP Role'
					}
				}
			}
		};
	}

	angular.module(moduleName).factory('procurementPackage2ExtBidderUIStandardService', procurementPackage2ExtBidderUIStandardService);
	procurementPackage2ExtBidderUIStandardService.$inject = ['platformUIStandardConfigService', 'procurementPackage2ExtBidderLayout', 'procurementCommonTranslationService', 'platformSchemaService', 'procurementPackage2ExtBidderLayout', 'platformUIStandardExtentService'];

	function procurementPackage2ExtBidderUIStandardService(platformUIStandardConfigService, procurementPackage2ExtBidderLayout, procurementCommonTranslationService, platformSchemaService, layout, platformUIStandardExtentService) {

		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'}).properties;
		var service = new BaseService(procurementPackage2ExtBidderLayout, domains, procurementCommonTranslationService);
		platformUIStandardExtentService.extend(service, layout.addition, domains);
		return service;
	}
})();
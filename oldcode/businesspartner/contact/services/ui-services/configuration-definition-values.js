/**
 * Created by zos on 4/8/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	let moduleName = 'businesspartner.contact';
	let businesspartnerMainModule = 'businesspartner.main';
	let cloudCommonModule = 'cloud.common';

	/**
	 * layout for businesspartner contact 'contact' grid /form container.
	 */
	angular.module(moduleName).factory('businessPartnerContactLayout', [
		'basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter', 'basicsLookupdataConfigGeneratorExtension', '$translate', 'basicsCommonCommunicationFormatter',
		function (basicsLookupdataConfigGenerator, complexFormatter, basicsLookupdataConfigGeneratorExtension, $translate, communicationFormatter) {

			return {
				fid: 'businesspartner.contact.contact.detail',
				version: '1.1.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['businesspartnerfk', 'contactrolefk', 'titlefk', 'title', 'firstname', 'initials', 'familyname', 'pronunciation', 'companyfk', 'islive','isdefaultbaseline']
					},
					{
						gid: 'communication',
						attributes: ['telephonenumberdescriptor', 'telephonenumber2descriptor', 'telefaxdescriptor', 'mobiledescriptor', 'internet', 'email', 'baslanguagefk', 'emailprivate']
					},
					{
						gid: 'addresses',
						attributes: ['countryfk', 'subsidiaryfk', 'addressdescriptor', 'privatetelephonenumberdescriptor']
					},
					{
						gid: 'marketing',
						attributes: ['clerkresponsiblefk', 'contacttimelinessfk', 'contactoriginfk', 'contactabcfk']
					},
					{
						gid: 'other',
						attributes: ['birthdate', 'nickname', 'partnername', 'children', 'remark', 'isdefault']
					},
					{
						gid: 'itwoPortal',
						attributes: ['provider', 'providerid', 'providerfamilyname', 'provideremail', 'provideraddress',
							'providercomment', 'portalusergroupname', 'logonname', 'identityprovidername', 'lastlogin', 'statement', 'setinactivedate']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				translationInfos: {
					extraModules: [moduleName, businesspartnerMainModule, cloudCommonModule],
					extraWords: {
						communication: {location: businesspartnerMainModule, identifier: 'groupCommunication', initial: 'Communication'},
						addresses: {location: businesspartnerMainModule, identifier: 'groupAddresses', initial: 'Addresses'},
						marketing: {location: businesspartnerMainModule, identifier: 'groupMarketing', initial: 'Marketing'},
						other: {location: businesspartnerMainModule, identifier: 'groupOther', initial: 'Other'},
						itwoPortal: {location: businesspartnerMainModule, identifier: 'groupITwoPortal', initial: 'iTWO Portal'},
						ContactRoleFk: {location: businesspartnerMainModule, identifier: 'role', initial: 'Role'},
						TitleFk: {location: moduleName, identifier: 'title', initial: 'Opening'},
						Title: {location: moduleName, identifier: 'titleName', initial: 'Title'},
						FirstName: {location: businesspartnerMainModule, identifier: 'firstName', initial: 'First Name'},
						Initials: {location: businesspartnerMainModule, identifier: 'initials', initial: 'Initials'},
						FamilyName: {location: businesspartnerMainModule, identifier: 'familyName', initial: 'Last Name'},
						Pronunciation: {location: businesspartnerMainModule, identifier: 'pronunciation', initial: 'Pronunciation'},
						CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
						BasLanguageFk: {location: businesspartnerMainModule, identifier: 'import.language', initial: 'Language'},
						TelephoneNumberDescriptor: {location: businesspartnerMainModule, identifier: 'telephoneNumber', initial: 'Telephone'},
						TelephoneNumber2Descriptor: {location: businesspartnerMainModule, identifier: 'telephoneNumber2', initial: 'Other Tel.'},
						TeleFaxDescriptor: {location: businesspartnerMainModule, identifier: 'telephoneFax', initial: 'Telefax'},
						MobileDescriptor: {location: businesspartnerMainModule, identifier: 'mobileNumber', initial: 'Mobile'},
						Internet: {location: businesspartnerMainModule, identifier: 'internet', initial: 'Internet'},
						Email: {location: businesspartnerMainModule, identifier: 'email', initial: 'E-mail'},
						CountryFk: {location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country'},
						BusinessPartnerFk: {location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
						SubsidiaryFk: {location: businesspartnerMainModule, identifier: 'subsidiaryAddress', initial: 'Subsidiary'},
						AddressDescriptor: {location: businesspartnerMainModule, identifier: 'contactAddress', initial: 'Private address'},
						PrivateTelephoneNumberDescriptor: {location: businesspartnerMainModule, identifier: 'contactTelephoneNumber', initial: 'Private phone'},
						ClerkResponsibleFk: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
						ContactTimelinessFk: {location: businesspartnerMainModule, identifier: 'timeliness', initial: 'Timeliness'},
						ContactOriginFk: {location: businesspartnerMainModule, identifier: 'origin', initial: 'Origin'},
						ContactAbcFk: {location: businesspartnerMainModule, identifier: 'customerAbc', initial: 'ABC Classification'},
						BirthDate: {location: businesspartnerMainModule, identifier: 'birthDate', initial: 'Birth Date'},
						NickName: {location: businesspartnerMainModule, identifier: 'nickname', initial: 'Nick Name'},
						PartnerName: {location: businesspartnerMainModule, identifier: 'partnerName', initial: 'Partner Name'},
						Children: {location: businesspartnerMainModule, identifier: 'children', initial: 'Children'},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
						LastLogin: {location: businesspartnerMainModule, identifier: 'lastLogin', initial: 'Last Logon'},
						Provider: {location: businesspartnerMainModule, identifier: 'provider', initial: 'Provider'},
						ProviderId: {location: businesspartnerMainModule, identifier: 'providerId', initial: 'Provider Id'},
						ProviderFamilyName: {location: businesspartnerMainModule, identifier: 'providerFamilyName', initial: 'Provider Family Name'},
						ProviderEmail: {location: businesspartnerMainModule, identifier: 'providerEmail', initial: 'Provider E-mail'},
						ProviderAddress: {location: businesspartnerMainModule, identifier: 'providerAddress', initial: 'Provider Address'},
						ProviderComment: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
						PortalUserGroupName: {location: businesspartnerMainModule, identifier: 'portalAccessGroup', initial: 'Portal Access Group'},
						LogonName: {location: cloudCommonModule, identifier: 'User_LogonName', initial: 'Logon Name'},
						IdentityProviderName: {location: businesspartnerMainModule, identifier: 'identityProviderName', initial: 'Identity Provider Name'},
						Statement: {location: businesspartnerMainModule, identifier: 'state', initial: 'State'},
						SetInactiveDate: {location: businesspartnerMainModule, identifier: 'setInactiveDate', initial: 'Set Inactive Date'},
						IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
						EmailPrivate: {location: cloudCommonModule, identifier: 'emailPrivate', initial: 'Private E-Mail'},
						IsLive: {location: cloudCommonModule, identifier: 'contactIsLive', initial: 'Active'},
						IsDefaultBaseline: {location: businesspartnerMainModule, identifier: 'isDefaultBaseline', initial: 'Is Default Baseline'}

					}
				},
				overloads: {
					'islive': {readonly: true},
					'provider': {
						'grid': {
							'maxLength': 64
						},
						'detail': {
							'maxLength': 64
						},
						'readonly': true
					},
					'providerid': {
						'readonly': true
					},
					'providerfamilyname': {
						'readonly': true
					},
					'provideremail': {
						'readonly': true
					},
					'provideraddress': {
						'grid': {
							'maxLength': 320
						},
						'detail': {
							'maxLength': 320
						},
						'readonly': true
					},
					'providercomment': {
						'readonly': true
					},
					'portalusergroupname': {
						'grid': {
							'maxLength': 50
						},
						'detail': {
							'maxLength': 50
						},
						'readonly': true
					},
					'logonname': {
						'grid': {
							'maxLength': 252
						},
						'detail': {
							'maxLength': 252
						},
						'readonly': true
					},
					'identityprovidername': {
						'grid': {
							'maxLength': 50
						},
						'detail': {
							'maxLength': 50
						},
						'readonly': true
					},
					'statement': {
						'readonly': true
					},
					'setinactivedate': {
						'readonly': true
					},
					'businesspartnerfk': {
						navigator: {
							moduleName: 'businesspartner.main'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-business-partner-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							directive: 'business-partner-main-business-partner-dialog',
							options: {
								showClearButton: true
							}
						}
					},
					'contactrolefk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.contact.role', null, {showClearButton: true}),
					'baslanguagefk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.language', null, {showClearButton: true}),
					'titlefk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-title-combobox',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'title',
								displayMember: 'DescriptionInfo.Translated'
							},
							width: 110
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-title-combobox',
							options: {
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'companyfk': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-company-company-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'Code'
							},
							width: 120
						},
						detail: {
							model: 'CompanyFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName'
							}
						}
					},
					'telephonenumberdescriptor': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberFk',
									titleField: 'businesspartner.contact.telephoneNumber',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							},
							width: 150
						},
						detail: {
							'type': 'directive',
							'model': 'TelephoneNumberDescriptor',
							'directive': 'basics-common-telephone-dialog',
							'options': {
								titleField: 'businesspartner.contact.telephoneNumber',
								showClearButton: true
							}
						}
					},
					'telephonenumber2descriptor': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumber2Fk',
									titleField: 'businesspartner.contact.telephoneNumber2',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							},
							width: 150
						},
						detail: {
							'type': 'directive',
							'model': 'TelephoneNumber2Descriptor',
							'directive': 'basics-common-telephone-dialog',
							'options': {
								titleField: 'businesspartner.contact.telephoneNumber',
								showClearButton: true
							}
						}
					},
					'telefaxdescriptor': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberTelefaxFk',
									titleField: 'businesspartner.contact.telephoneFax',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							model: 'TeleFaxDescriptor',
							directive: 'basics-common-telephone-dialog',
							options: {
								titleField: 'businesspartner.contact.telephoneFax',
								showClearButton: true
							}
						}
					},
					'mobiledescriptor': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberMobilFk',
									titleField: 'businesspartner.contact.mobileNumber',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							model: 'MobileDescriptor',
							directive: 'basics-common-telephone-dialog',
							options: {
								titleField: 'businesspartner.contact.mobileNumber',
								showClearButton: true
							}
						}
					},
					'email': {
						'grid': {
							editor: 'directive',
							editorOptions: {
								directive: 'basics-common-email-input',
								dataServiceName: 'businesspartnerMainContactDataService',
								field: 'Email'
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
							dataServiceName: 'businesspartnerMainContactDataService',
							model: 'Email'
						}
					},
					'countryfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.lookup.country', null, {showClearButton: true}),
					'subsidiaryfk': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									filterKey: 'contact-subsidiary-filter',
									showClearButton: true,
									displayMember: 'DisplayText',
									disableDataCaching: true,
									inputSearchMembers: ['SubsidiaryDescription', 'Street', 'ZipCode', 'City', 'Iso2']
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'DisplayText'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							model: 'SubsidiaryFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								showClearButton: true,
								disableDataCaching: true,
								inputSearchMembers: ['SubsidiaryDescription', 'Street', 'ZipCode', 'City', 'Iso2'],
								lookupDirective: 'business-partner-main-subsidiary-lookup',
								descriptionMember: 'AddressLine',
								lookupOptions: {
									filterKey: 'contact-subsidiary-filter',
									displayMember: 'DisplayText'
								}
							}
						}
					},
					'addressdescriptor': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								lookupOptions: {
									foreignKey: 'AddressFk',
									titleField: 'businesspartner.contact.contactAddress',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'AddressLine'
							},
							width: 200
						},
						detail: {
							type: 'directive',
							model: 'AddressDescriptor',
							directive: 'basics-common-address-dialog',
							options: {
								titleField: 'businesspartner.contact.contactAddress',
								showClearButton: true
							}
						}
					},
					'privatetelephonenumberdescriptor': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephonePrivatFk',
									titleField: 'businesspartner.contact.contactTelephoneNumber',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							model: 'PrivateTelephoneNumberDescriptor',
							directive: 'basics-common-telephone-dialog',
							options: {
								titleField: 'businesspartner.contact.contactTelephoneNumber',
								showClearButton: true
							}
						}
					},
					'clerkresponsiblefk': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							model: 'ClerkResponsibleFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					'contacttimelinessfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.contact.timeliness', null, {showClearButton: true}),
					'contactoriginfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.contact.origin', null, {showClearButton: true}),
					'contactabcfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.contact.abc', null, {showIcon: true}),
					'lastlogin': {
						readonly: true
					},
					'wrongattempts': {
						grid: {
							width: 150
						},
						readonly: true
					},
					'internet': {
						maxLength: 100
					}
				},
				addition: {
					grid: [
						{
							afterId: 'companyfk',
							id: 'CompanyName',
							field: 'CompanyFk',
							name: 'Company Name',
							name$tr$: 'cloud.common.entityCompanyName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 150
						},
						{
							afterId: 'clerkresponsiblefk',
							id: 'ClerkDescription',
							field: 'ClerkResponsibleFk',
							name: 'Requisition Name',
							name$tr$: 'cloud.common.entityResponsibleName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							},
							width: 150
						},
						{
							afterId: 'subsidiaryfk',
							id: 'subsidiaryAdress',
							field: 'SubsidiaryFk',
							name: 'Subsidiary Address',
							name$tr$: 'businesspartner.contact.subsidiaryAddressInfo',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine'
							},
							width: 150
						},
						{
							afterId: 'subsidiaryAdress',
							id: 'city',
							field: 'SubsidiaryFk',
							name: 'City',
							name$tr$: 'cloud.common.entityCity',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'City'
							},
							width: 150
						},
						{
							afterId: 'city',
							id: 'zipCode',
							field: 'SubsidiaryFk',
							name: 'Zip Code',
							name$tr$: 'cloud.common.entityZipCode',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'ZipCode'
							},
							width: 150
						},
						{
							afterId: 'zipCode',
							id: 'street',
							field: 'SubsidiaryFk',
							name: 'Street',
							name$tr$: 'cloud.common.entityStreet',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'Street'
							},
							width: 150
						}
					],
					detail: [
						{
							'rid': 'city',
							'afterId': 'country',
							'gid': 'addresses',
							'label': 'City',
							'label$tr$': 'cloud.common.entityCity',
							'model': 'SubsidiaryFk',
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								displayMember: 'City'
							},
							'readonly':true
						},
						{
							'rid': 'zipCode',
							'afterId': 'city',
							'gid': 'addresses',
							'label': 'Zip Code',
							'label$tr$': 'cloud.common.entityZipCode',
							'model': 'SubsidiaryFk',
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								displayMember: 'ZipCode'
							},
							'readonly':true
						},
						{
							'rid': 'street',
							'afterId': 'zipCode',
							'gid': 'addresses',
							'label': 'Street',
							'label$tr$': 'cloud.common.entityStreet',
							'model': 'SubsidiaryFk',
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								displayMember: 'Street'
							},
							'readonly':true
						}
					]
				}
			};
		}
	]);

	angular.module(moduleName).factory('businessPartnerContactCreateService', ['$q', 'businesspartnerContactDataService', function ($q, businesspartnerContactDataService) {
		let service = {};
		service.createItem = function (creationOptions, customCreationData) {
			return businesspartnerContactDataService.createItemSimple(creationOptions, customCreationData, function (data) {
				service.updateData = data;
				return data;
			});
		};
		service.update = function (data) {
			return businesspartnerContactDataService.updateSimple({
				'Contact': !_.isNil(data) ? data : service.updateData,
				'EntitiesCount': 1
			});
		};
		service.deleteItem = function () {
			service.updateData = null;
			return $q.when(true);
		};
		return service;
	}]);

	angular.module(moduleName).factory('businessPartnerContactCreateOptions', ['$injector', function ($injector) {
		return {
			dataService: 'businessPartnerContactCreateService',
			uiStandardService: $injector.get('businessPartnerContactUIStandardService'),
			validationService: 'businessPartnerContactValidationService',
			fields: ['ContactRoleFk', 'TitleFk', 'Title', 'FirstName', 'FamilyName', 'TelephoneNumberDescriptor', 'Email'],
			creationData: {mainItemId: null}
		};
	}]);

	angular.module(moduleName).factory('businessPartnerContactDetailOptions', ['businesspartnerContactDataService',
		function (contactDataService) {
			return {
				isEditable: true,
				dataService: 'businessPartnerContactCreateService',
				uiStandardService: 'businessPartnerContactUIStandardService',
				validationService: 'businessPartnerContactValidationService',
				readonlyFields: ['businesspartnerfk', 'companyfk'],
				detailConverter: contactDataService.convertLookupDto
			};
		}]);

	// businesspartnerContact2BpAssignment
	angular.module(moduleName).factory('businesspartnerContact2BpAssignmentLayout',
		['basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', '$translate',
			// eslint-disable-next-line no-unused-vars
			function (basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, $translate) {
				return {
					'fid': 'businesspartner.contact.bpAssignment.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [{
						'gid': 'basicData', 'attributes': ['businesspartnerfk', 'subsidiaryfk', 'contactrolefk', 'islive', 'ismain', 'isportal']
					}, {
						'gid': 'entityHistory', 'isHistory': true
					}
					],
					'translationInfos': {
						extraModules: [businesspartnerMainModule, cloudCommonModule],
						extraWords: {
							BpdBusinessPartnerFk: {location: businesspartnerMainModule, identifier: 'businessPartnerName1', initial: 'Business Partner'},
							BpdSubsidiaryFk: {location: businesspartnerMainModule, identifier: 'subsidiaryAddress', initial: 'Subsidiary'},
							BpdContactRoleFk: {location: businesspartnerMainModule, identifier: 'role', initial: 'Role'},
							IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
							IsMain: {location: moduleName, identifier: 'businessPartnerAssignment.isMain', initial: 'Is Main'},
							IsPortal: {location: moduleName, identifier: 'businessPartnerAssignment.isPortal', initial: 'Is Portal'}
						}
					},
					'overloads': {

						'businesspartnerfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-business-partner-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BusinessPartner',
									displayMember: 'BusinessPartnerName1'
								},
								width: 150
							},
							detail: {
								type: 'directive',
								directive: 'business-partner-main-business-partner-dialog',
								options: {
									showClearButton: true
								}
							}
						},
						'subsidiaryfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-subsidiary-lookup',
									lookupOptions: {
										filterKey: 'contact-subsidiary-filter',
										showClearButton: true,
										displayMember: 'DisplayText',
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'DisplayText'
								},
								width: 150
							},
							detail: {
								type: 'directive',
								directive: 'business-partner-main-subsidiary-lookup',
								options: {
									filterKey: 'contact-subsidiary-filter',
									showClearButton: true,
									displayMember: 'DisplayText'
								}
							}
						},
						'contactrolefk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.contact.role', null, {showClearButton: true}),
						'ismain': {
							'grid': {
								considerReadonly: true
							},
							'detail': {
								considerReadonly: true
							}
						}
					}
				};
			}]);

	// businessPartnerContact2Company
	angular.module(moduleName).factory('businessPartnerContact2CompanyLayout', [
		function () {
			return {
				'fid': 'businesspartner.contact.tocompany.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['bascompanyfk', 'bascompanyresponsiblefk', 'remark', 'basclerkfk', 'isactive']
					},
					{
						'gid': 'userDefined',
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						userDefined: {
							location: moduleName,
							identifier: 'groupUserDefined',
							initial: 'User Defined Fields'
						},
						BasCompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
						BasCompanyResponsibleFk: {
							location: moduleName,
							identifier: 'companyResponsibleCompany',
							initial: 'Responsible Profit Centre'
						},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'},
						UserDefined1: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 1',
							param: {'p_0': '1'}
						},
						UserDefined2: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 2',
							param: {'p_0': '2'}
						},
						UserDefined3: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 3',
							param: {'p_0': '3'}
						},
						BasClerkFk: {
							location: cloudCommonModule,
							identifier: 'entityResponsible',
							initial: 'Clerk Code'
						},
						IsActive: {
							location: cloudCommonModule,
							identifier: 'entityIsActive',
							initial: 'IsActive'
						}
					}
				},
				'overloads': {
					'bascompanyfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-company-company-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'Code'
							},
							width: 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'BasCompanyFk',
							'options': {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
								lookupOptions: {}
							}
						}
					},
					'bascompanyresponsiblefk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-company-company-lookup',
								lookupOptions: {filterKey: 'business-partner-contact-to-company-responsible-company-filter'}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'Code'
							},
							width: 200
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'BasCompanyResponsibleFk',
							'options': {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
								lookupOptions: {filterKey: 'business-partner-contact-to-company-responsible-company-filter'}
							}
						}
					},
					'basclerkfk': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'clerk',
								displayMember: 'Code'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							model: 'BasClerkFk',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'bascompanyfk',
							id: 'CompanyName',
							field: 'BasCompanyFk',
							name: 'Company Name',
							name$tr$: 'cloud.common.entityCompanyName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 150
						},
						{
							'afterId': 'bascompanyresponsiblefk',
							id: 'ResponsibleCompanyName',
							field: 'BasCompanyResponsibleFk',
							name: 'Responsible Profit Centre (Description)',
							name$tr$: 'businesspartner.main.companyResponsibleCompanyName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 250
						},
						{
							afterId: 'basclerkfk',
							id: 'ClerkResponsibleDescription',
							field: 'BasClerkFk',
							name: 'Clerk Description',
							name$tr$: 'cloud.common.entityResponsibleDescription',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'clerk',
								displayMember: 'Description'
							},
							width: 250
						}
					]
				}
			};
		}]);
	angular.module(moduleName).factory('businessPartnerContactExtRoleLayout',
		['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'businesspartner.contact.externalrole.list',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['externalrolefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						ExternalRoleFk: {location: moduleName, identifier: 'ExternalRoleFk', initial: 'External Role'}
					}
				},
				'overloads': {
					'externalrolefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.main.extrole')
				}
			};
		}]);

	//Contact2ExternaL
	angular.module(moduleName).factory('businessPartnerContact2ExternalLayout',
		['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'businesspartner.contact.contact2external.list',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['externalid','externaldescription','externalsourcefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						ExternalId: {location: moduleName, identifier: 'ExternalId', initial: 'External Id'},
						ExternalSourceFk: {location: moduleName, identifier: 'externalSourceFk', initial: 'External Source'},
						ExternalDescription: {location: moduleName, identifier: 'externalDescription', initial: 'External Description'},
					}
				},
				'overloads': {
					'externalsourcefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsource', 'Description')
				}
			};
		}]);
})(angular);

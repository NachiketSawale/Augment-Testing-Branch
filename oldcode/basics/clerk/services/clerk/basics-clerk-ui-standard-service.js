/**
 * Created by baf on 05.09.2014
 */
(function (angular) {
	'use strict';
	const moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of clerk entities
	 */
	angular.module(moduleName).factory('basicsClerkUIStandardService', ['platformLayoutHelperService', 'platformUIStandardConfigService', 'basicsClerkTranslationService', 'basicsLookupdataConfigGenerator',
		'platformSchemaService', 'basicsCommonComplexFormatter', 'platformObjectHelper', 'platformUIStandardExtentService','$translate', 'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter',

		function (platformLayoutHelperService, platformUIStandardConfigService, basicsClerkTranslationService, basicsLookupdataConfigGenerator,
			platformSchemaService, basicsCommonComplexFormatter, platformObjectHelper, platformUIStandardExtentService,$translate, complexFormatter, communicationFormatter) {

			function createMainDetailLayout() {
				return {

					'fid': 'basics.clerk.clerkdetailform',
					'version': '1.0.0',
					'showGrouping': true,
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['code', 'description', 'familyname', 'firstname', 'titlefk', 'validfrom', 'validto', 'userfk', 'companyfk',
								'title', 'department', 'signature', 'telephonenumberfk', 'telephonetelefaxfk', 'telephonemobilfk', 'email', 'addressfk',
								'telephoneprivatfk', 'telephoneprivatmobilfk', 'privatemail', 'birthdate', 'workflowtype', 'notificationemails', 'escalationemails',
								'escalationto', 'clerkproxyfk', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'remark',
								'islive', 'txuser', 'txpw', 'clerksuperiorfk', 'procurementorganization', 'procurementgroup', 'isclerkgroup']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						titlefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.title'),
						userfk:platformLayoutHelperService.provideUserLookupDialogOverload(),
						companyfk: {
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
								width: 140
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {}
								}
							}
						},
						'telephonenumberfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-telephone-dialog',
								'model': 'TelephoneNumber',
								'options': {
									titleField: 'cloud.common.telephoneNumber',
									foreignKey: 'TelephoneNumberFk',
									showClearButton: true
								}
							}, 'grid': {
								'editor': 'lookup',
								'field': 'TelephoneNumber',
								'editorOptions': {
									'lookupDirective': 'basics-common-telephone-dialog',
									'lookupOptions': {
										foreignKey: 'TelephoneNumberFk',
										titleField: 'cloud.common.telephoneNumber'
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						},
						'telephonetelefaxfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-telephone-dialog',
								'model': 'TelephoneNumberTelefax',
								'options': {
									titleField: 'cloud.common.fax',
									foreignKey: 'TelephoneTelefaxFk',
									showClearButton: true
								}
							},
							'grid': {
								'editor': 'lookup',
								'field': 'TelephoneNumberTelefax',
								'editorOptions': {
									'lookupDirective': 'basics-common-telephone-dialog',
									'lookupOptions': {
										foreignKey: 'TelephoneTelefaxFk',
										titleField: 'cloud.common.fax'
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						},
						'telephonemobilfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-telephone-dialog',
								'model': 'TelephoneMobil',
								'options': {
									titleField: 'cloud.common.mobile',
									foreignKey: 'TelephoneMobilFk',
									showClearButton: true
								}
							},
							'grid': {
								'editor': 'lookup',
								'field': 'TelephoneMobil',
								'editorOptions': {
									'lookupDirective': 'basics-common-telephone-dialog',
									'lookupOptions': {
										foreignKey: 'TelephoneMobilFk',
										titleField: 'cloud.common.mobile'
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						},
						'telephoneprivatfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-telephone-dialog',
								'model': 'TelephonePrivat',
								'options': {
									titleField: 'cloud.common.telephonePrivat',
									foreignKey: 'TelephonePrivatFk',
									showClearButton: true
								}
							},
							'grid': {
								'editor': 'lookup',
								'field': 'TelephonePrivat',
								'editorOptions': {
									'lookupDirective': 'basics-common-telephone-dialog',
									'lookupOptions': {
										foreignKey: 'TelephonePrivatFk',
										titleField: 'cloud.common.telephonePrivat'
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						},
						'telephoneprivatmobilfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-telephone-dialog',
								'model': 'TelephonePrivatMobil',
								'options': {
									titleField: 'cloud.common.privatMobil',
									foreignKey: 'TelephonePrivatMobilFk',
									showClearButton: true
								}
							},
							'grid': {
								'editor': 'lookup',
								'field': 'TelephonePrivatMobil',
								'editorOptions': {
									'lookupDirective': 'basics-common-telephone-dialog',
									'lookupOptions': {
										foreignKey: 'TelephonePrivatMobilFk',
										titleField: 'cloud.common.privatMobil'
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						},
						'addressfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-address-dialog',
								'model': 'Address',
								'options': {
									titleField: 'cloud.common.address',
									foreignKey: 'AddressFk',
									showClearButton: true
								}
							},
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'lookupDirective': 'basics-common-address-dialog',
									'lookupOptions': {
										foreignKey: 'AddressFk',
										titleField: 'cloud.common.address'
									}
								},
								'formatter': 'description',
								'field': 'Address',
								'formatterOptions': {
									displayMember: 'Address'
								}
							}
						},
						'clerkproxyfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'model': 'ClerkProxyFk',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
										// filterKey: 'mdc-material-catalog-clerk-filter'
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										// filterKey: '',
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Code'
								},
								width: 145
							}
						},
						txpw: {
							'grid': {
								// exclude: true

								placeholder: function (entity) {
									return entity.IsTxUser ? '*****' : $translate.instant('basics.common.passwordEnterTip');
								}
							},
							'detail': {
								placeholder: function (entity) {
									return entity.IsTxUser ? '*****' : $translate.instant('basics.common.passwordEnterTip');
								}
							}
						},
						'email': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'basics-common-email-input',
									dataServiceName: 'basicsClerkMainService'
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
								dataServiceName: 'basicsClerkMainService'
							}
						},
						'privatemail': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									field: 'PrivatEmail',
									directive: 'basics-common-email-input',
									dataServiceName: 'basicsClerkMainService'
								},
								formatter: communicationFormatter,
								formatterOptions: {
									domainType: 'email'
								},
								width: 150
							},
							'detail': {
								model: 'PrivatEmail',
								type: 'directive',
								directive: 'basics-common-email-input',
								dataServiceName: 'basicsClerkMainService'
							}
						},
						clerksuperiorfk:{
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: false
									}
								},
								requiredInErrorHandling: true
							},
							grid: {

								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Description'
								}
							}
						}
					}
				};
			}

			let clerkDetailLayout = createMainDetailLayout();

			let BaseService = platformUIStandardConfigService;

			let unitClerkAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'ClerkDto',
				moduleSubModule: 'Basics.Clerk'
			});
			unitClerkAttributeDomains = unitClerkAttributeDomains.properties;

			function ClerkUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
			ClerkUIStandardService.prototype.constructor = ClerkUIStandardService;


			function extendGroupingFn() {
				return {
					'addition': {
						'grid': platformObjectHelper.extendGrouping([
							{
								'afterId': 'clerkproxyfk',
								'id': 'ClerkDescription_description',
								'field': 'ClerkProxyFk',
								'name': 'Clerk Description',
								'name$tr$': 'basics.clerk.clerkdesc',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Description'
								},
								width: 140
							}
						])
					}
				};
			}

			let service = new BaseService(clerkDetailLayout, unitClerkAttributeDomains, basicsClerkTranslationService);
			platformUIStandardExtentService.extend(service, extendGroupingFn().addition, unitClerkAttributeDomains);

			return service;
		}
	]);
})(angular);

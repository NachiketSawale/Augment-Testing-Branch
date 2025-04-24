/*
 * $Id: privacy-main-container-information-service.js 627998 2021-03-16 15:37:51Z leo $
 * Copyright (c) RIB Software SE
 */

( (angular) => {

	'use strict';
	let privacyMainModule = angular.module('privacy.main');

	/**
	 * @ngdoc service
	 * @name privacyMainContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */

	privacyMainModule.service('privacyMainContainerInformationService', PrivacyMainContainerInformationService);

	PrivacyMainContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'privacyMainConstantValues'];

	function PrivacyMainContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator, privacyMainConstantValues) {
		let self = this;

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case privacyMainConstantValues.uuid.container.requestList: // privacyMainPrivacyRequestListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPrivacyRequestServiceInfos(), self.getPrivacyRequestLayout);
					break;
				case privacyMainConstantValues.uuid.container.requestDetail: // privacyMainPrivacyRequestDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPrivacyRequestServiceInfos(), self.getPrivacyRequestLayout);
					break;
			}

			return config;
		};

		this.getPrivacyRequestServiceInfos = function getPrivacyRequestServiceInfos() {
			return {
				standardConfigurationService: 'privacyMainPrivacyRequestLayoutService',
				dataServiceName: 'privacyMainPrivacyRequestDataService',
				validationServiceName: ''
			};
		};

		this.getPrivacyRequestLayout = function getPrivacyRequestLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'privacy.main',
				['privacyhandledtypefk','privacyrequestedbyfk','privacygradefk','rendereddataid', 'confirmedbyuserfk', 'iswithbackup']);
			res.overloads = platformLayoutHelperService.getOverloads(['privacyhandledtypefk','privacyrequestedbyfk','privacygradefk','rendereddataid','confirmedbyuserfk'], self);
			res.overloads.iswithbackup = {readonly: true};
			return res;
		};

		let lookupInfo = {};
		lookupInfo[privacyMainConstantValues.handledType.clerk] = {
			column: 'RenderedDataId',
			lookup: {
				directive: 'cloud-clerk-clerk-dialog-without-teams',
				options: {
					descriptionMember: 'Description',
					showClearButton: true,
					displayMember: 'Code',
					lookupType: 'Clerk'
				}
			}
		};
		lookupInfo[privacyMainConstantValues.handledType.contact] = {
			column: 'RenderedDataId',
			lookup: {
				directive: 'business-partner-main-filtered-contact-combobox-without-teams',
				options: {
					showClearButton: true,
					displayMember: 'FamilyName',
					lookupType: 'contact'
				}
			}
		};
		lookupInfo[privacyMainConstantValues.handledType.businessPartner] = {
			column: 'RenderedDataId',
			lookup: {
				directive: 'business-partner-main-business-partner-dialog-without-teams',
				options: {
					showClearButton: true,
					lookupType: 'BusinessPartner',
					displayMember: 'BusinessPartnerName1'
				}
			}
		};
		lookupInfo[privacyMainConstantValues.handledType.user] = {
			column: 'RenderedDataId',
			lookup: {
				directive: 'usermanagement-user-user-dialog',
				options: {
					descriptionMember: 'Description',
					showClearButton: true,
					displayMember: 'Description',
					lookupType: 'User'
				}
			}
		};

		function getRenderedDataIdOverload() {
			return {
				readonly: true,
				detail: {
					type: 'directive',
					directive: 'dynamic-grid-and-form-lookup',
					options: {
						isTextEditable: false,
						dependantField: 'PrivacyHandledTypeFk',
						lookupInfo: lookupInfo,
						grid: false,
						dynamicLookupMode: true,
						showClearButton: true,
					}
				},
				grid: {
					editor: 'directive',
					editorOptions: {
						directive: 'dynamic-grid-and-form-lookup',
						dependantField: 'PrivacyHandledTypeFk',
						lookupInfo: lookupInfo,
						isTextEditable: false,
						dynamicLookupMode: true,
						grid: true,
					},
					formatter: 'dynamic',
					domain: function (item, column, flag) {
						let info = lookupInfo[item.PrivacyHandledTypeFk];
						if (info) {
							let prop = info.lookup.options;
							column.formatterOptions = {
								lookupType: prop.lookupType,
								displayMember: prop.displayMember,
								dataServiceName: prop.dataServiceName
							};
							if (prop.version) {
								column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
							}
						}
						else {
							column.formatterOptions = null;
						}

						return flag ? 'directive' : 'lookup';
					}
				}
			};
		}

		this.getOverload = function getOverload(overload) {
			let ovl = null;

			switch (overload) {
				case 'privacyhandledtypefk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('privacy.config.handledtype'); break;
				case 'privacyrequestedbyfk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('privacy.config.requestedby'/**/); break;
				case 'privacygradefk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('privacy.config.grade'); break;
				case 'rendereddataid': ovl = getRenderedDataIdOverload(); break;
				case 'confirmedbyuserfk': {
					ovl = platformLayoutHelperService.provideUserLookupDialogOverload();
					ovl.readonly = true;
					break;
				}
			}

			return ovl;
		};

	}
})(angular);

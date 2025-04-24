/**
 * Created by Sudarshan on 16.03.2023
 */
(function (angular) {
	'use strict';
	let timekeepingCertificateModule = angular.module('timekeeping.certificate');

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingCertificateModule.service('timekeepingCertificateContainerInformationService', TimekeepingCertificateContainerInformationService);

	TimekeepingCertificateContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',  'timekeepingCertificateConstantValues','platformModuleNavigationService','platformModalService'];

	function TimekeepingCertificateContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, timekeepingCertificateConstantValues,platformModuleNavigationService,platformModalService) {
		let self = this;
		let guids = timekeepingCertificateConstantValues.uuid.container;
		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};

			switch (guid) {
				case guids.certificateList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getCertificateServiceInfo(), self.getCertificateLayout);
					break;
				case guids.certificateDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCertificateServiceInfo(), self.getCertificateLayout);
					break;
				case guids.certifiedEmployeeList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getCertifiedEmployeeServiceInfo(), self.getCertifiedEmployeeLayout);
					break;
				case guids.certifiedEmployeeDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCertifiedEmployeeServiceInfo(), self.getCertifiedEmployeeLayout);
					break;
				case guids.certificateDocList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getCertificateDocumentServiceInfo(), self.getCertificateDocumentLayout);
					break;
				case guids.certificateDocDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCertificateDocumentServiceInfo(), self.getCertificateDocumentLayout);
					break;
			}
			return config;
		};

		this.getCertificateDocumentServiceInfo = function getCertificateDocumentServiceInfo() {
			return {
				standardConfigurationService: 'timekeepingCertificateDocumentLayoutService',
				dataServiceName: 'timekeepingCertificateDocumentDataService',
				validationServiceName: 'timekeepingCertificateDocumentValidationService',
			};
		};

		this.getCertificateServiceInfo = function getCertificateServiceInfo() {
			return {
				standardConfigurationService: 'timekeepingCertificateLayoutService',
				dataServiceName: 'timekeepingCertificateDataService',
				validationServiceName: 'timekeepingCertificateValidationService',
			};
		};

		this.getCertifiedEmployeeServiceInfo = function getCertifiedEmployeeServiceInfo() {
			return {
				standardConfigurationService: 'timekeepingCertifiedEmployeeLayoutService',
				dataServiceName: 'timekeepingCertifiedEmployeeDataService',
				validationServiceName: 'timekeepingCertifiedEmployeeValidationService',
			};
		};

		this.getCertificateDocumentLayout = function getCertificateDocumentLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.certificate.document',
				['documenttypefk', 'description', 'certificatedoctypefk', 'date', 'barcode', 'originfilename']);
			res.overloads = platformLayoutHelperService.getOverloads(['documenttypefk', 'certificatedoctypefk', 'originfilename'], self);
			res.addAdditionalColumns = true;
			return res;
		};

		this.getCertifiedEmployeeLayout = function getCertifiedEmployeeLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.certificate', ['employeefk', 'employeestatusfk', 'validfrom', 'validto', 'commenttext']);

			res.overloads = platformLayoutHelperService.getOverloads(['employeefk', 'employeestatusfk'], self);
			res.addAdditionalColumns = true;
			return res;
		};

		this.getCertificateLayout = function getCertificateLayout() {
			let res = platformLayoutHelperService.getFiveGroupsBaseLayout(
				'1.0.0',
				'timekeeping.certificate',
				['description', 'empcertificatetypefk', 'empcertficatestatusfk', 'validfrom', 'validto', 'comment', 'remark'],
				{
					gid: 'contactInfo',
					attributes: ['clerkfk', 'businesspartnerfk', 'contactfk', 'supplierfk'],
				},
				platformLayoutHelperService.getUserDefinedTextGroup(5, null, null, '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, null, null, '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, null, null, '0')
			);

			res.overloads = platformLayoutHelperService.getOverloads(['empcertificatetypefk', 'empcertficatestatusfk', 'clerkfk', 'contactfk', 'supplierfk','businesspartnerfk'], self);

			res.addAdditionalColumns = true;

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			let ovl = null;

			switch (overload) {
				case 'empcertficatestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig(
						'basics.customize.timekeepingemployeecertificatestatus',
						null, {showIcon: true}
					);
					break;
				case 'empcertificatetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeecertificatetype');
					break;
				case 'clerkfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'contactfk':
					ovl = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupDlgOverload('timekeeping-certificate-business-partner-contact-filter');
					break;
				case 'supplierfk':
					ovl = platformLayoutHelperService.provideBusinessPartnerSupplierLookupOverload('timekeeping-certificate-businesspartner-supplier-filter');
					break;
				case 'employeefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeeLookupDataService',
						navigator: {
							moduleName: 'timekeeping.employee'
						}
					});
					ovl.readonly = true;
					break;
				case 'originfilename':
					ovl = {readonly: true};
					break;
				case 'documenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype');
					break;
				case 'certificatedoctypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeecertificatedocumenttype');
					break;
				case 'employeestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingemployeestatus', null, {showIcon: true});
					break;
				case 'businesspartnerfk':
					ovl = {
						'navigator': {
							moduleName: 'businesspartner.main',
							registerService: 'businesspartnerMainHeaderDataService',
							navFunc: function (options, entity) {
								if (entity && entity.BusinessPartnerFk > 0) {
									platformModuleNavigationService.navigate(options.navigator, entity, options.field);
								} else {
									platformModalService.showMsgBox($translate.instant('businesspartner.certificate.businessPartnerRequire'), 'Warning', 'warning');
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-business-partner-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							}
						},
						'detail': {
							'type': 'directive',
							directive: 'business-partner-main-business-partner-dialog'
						},
						'change': 'formOptions.onPropertyChanged'
					};
					break;

			}
			return ovl;
		};
	}
})(angular);

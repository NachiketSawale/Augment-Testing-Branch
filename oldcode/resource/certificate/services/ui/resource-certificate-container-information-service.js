/*
 * $Id: resource-certificate-container-information-service.js 552319 2019-07-25 15:18:37Z henkel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var resourceCertificateModule = angular.module('resource.certificate');

	/**
	 * @ngdoc service
	 * @name resourceCertificateContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	resourceCertificateModule.service('resourceCertificateContainerInformationService', ResourceCertificateContainerInformationService);

	ResourceCertificateContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService', 'resourceCommonLayoutHelperService', 'resourceCertificateConstantValues'];

	function ResourceCertificateContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService, resourceCommonLayoutHelperService, resourceCertificateConstantValues) {
		var self = this;
		var guids = resourceCertificateConstantValues.uuid.container;

		(function registerFilter(){
			var resourceCertificateRelatedFilters = [
				{
					key: 'resource-certificate-business-partner-contact-filter',
					serverSide: true,
					serverKey: 'business-partner-contact-filter-by-simple-business-partner',
					fn: function(entity){
						return {
							BusinessPartnerFk: entity.BusinessPartnerFk
						};
					}
				},
				{
					key: 'resource-certificate-businesspartner-supplier-filter',
					serverSide: true,
					serverKey: 'businesspartner-main-supplier-common-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity !== null ? entity.BusinessPartnerFk : null
						};
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(resourceCertificateRelatedFilters);
		})();

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};

			switch (guid) {
				case guids.certificateList: // resourceSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCertificateServiceInfo(), self.getCertificateLayout);
					break;
				case guids.certificateDetails: // resourceSkillMainEntityNameDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCertificateServiceInfo(), self.getCertificateLayout);
					break;
				case guids.certificateDocList: // resourceSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCertificateDocumentServiceInfo(), self.getCertificateDocumentLayout);
					break;
				case guids.certificateDocDetails: // resourceSkillMainEntityNameDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCertificateDocumentServiceInfo(), self.getCertificateDocumentLayout);
					break;
				case guids.certificatedPlantList: // resourceSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCertificatedPlantServiceInfo(), self.getCertificatedPlantLayout);
					break;
				case guids.certificatedPlantDetails: // resourceSkillMainEntityNameDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCertificatedPlantServiceInfo(), self.getCertificatedPlantLayout);
					break;
			}

			return config;
		};

		this.getCertificateServiceInfo = function getCertificateServiceInfo() {
			return {
				standardConfigurationService: 'resourceCertificateLayoutService',
				dataServiceName: 'resourceCertificateDataService',
				validationServiceName: 'resourceCertificateValidationService'
			};
		};

		this.getCertificateLayout = function getCertificateLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'resource.certificate.certificate',
				['descriptioninfo', 'certificatetypefk', 'certificatestatusfk', 'validfrom', 'validto', 'comment', 'remark'],
				{
					gid: 'contactInfo',
					attributes: ['clerkfk', 'businesspartnerfk', 'contactfk', 'supplierfk']
				},
				platformLayoutHelperService.getUserDefinedTextGroup(5, null, null, '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, null, null, '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, null, null, '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['certificatetypefk', 'certificatestatusfk', 'clerkfk', 'contactfk', 'supplierfk'], self);

			res.overloads.businesspartnerfk = self.getBusinessPartnerLookup('resourceCertificateDataService');

			res.addAdditionalColumns = true;

			return res;
		};

		this.getCertificateDocumentServiceInfo = function getCertificateDocumentServiceInfo() {
			return {
				standardConfigurationService: 'resourceCertificateDocumentLayoutService',
				dataServiceName: 'resourceCertificateDocumentDataService',
				validationServiceName: 'resourceCertificateDocumentValidationService'
			};
		};

		this.getCertificateDocumentLayout = function getCertificateDocumentLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.certificate.document',
				['documenttypefk', 'descriptioninfo', 'certificatedocumenttypefk', 'date', 'barcode', 'originfilename']);

			res.overloads = platformLayoutHelperService.getOverloads(['documenttypefk', 'certificatedocumenttypefk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getCertificatedPlantServiceInfo = function getCertificatedPlantServiceInfo() {
			return {
				standardConfigurationService: 'resourceCertificatedPlantLayoutService',
				dataServiceName: 'resourceCertificatedPlantDataService',
				validationServiceName: 'resourceCertificatedPlantValidationService'
			};
		};

		this.getCertificatedPlantLayout = function getCertificatedPlantLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.certificate.certificatedplant',
				['plantfk', 'comment', 'validfrom', 'validto']);

			res.overloads = platformLayoutHelperService.getOverloads(['plantfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getBusinessPartnerLookup = function getBusinessPartnerLookup(dataServiceName) {
			let ovl = platformLayoutHelperService.provideBusinessPartnerLookupOverload();

			// grid
			ovl.grid.editorOptions.lookupOptions.mainService = dataServiceName;
			ovl.grid.editorOptions.lookupOptions.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.grid.editorOptions.lookupOptions.SubsidiaryField = 'SubsidiaryFk';

			// detail
			ovl.detail.options.mainService = dataServiceName;
			ovl.detail.options.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.detail.options.SubsidiaryField = 'SubsidiaryFk';

			return ovl;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'certificatestatusfk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantcertificatestatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusIconService'
				}); break;
				case 'certificatetypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantcertificatetype'); break;
				case 'clerkfk': ovl = platformLayoutHelperService.provideClerkLookupOverload(); break;
				case 'contactfk': ovl = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupDlgOverload(
					'resource-certificate-business-partner-contact-filter'
				); break;
				case 'plantfk': ovl = platformLayoutHelperService.providePlantLookupOverload(); break;
				case 'supplierfk': ovl = platformLayoutHelperService.provideBusinessPartnerSupplierLookupOverload('resource-certificate-businesspartner-supplier-filter'); break;
				case 'documenttypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype'); break;
				case 'certificatedocumenttypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantcertificatedoctype'); break;
				
			}

			return ovl;
		};
	}
})(angular);

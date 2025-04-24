/**
 * Created by jie on 2024.08.12
 */
(function(angular) {

	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('packageExtBidder2ContactLayout', packageExtBidder2ContactLayout);
	packageExtBidder2ContactLayout.$inject = ['basicsLookupdataConfigGenerator', '$injector', 'basicsCommonCommunicationFormatter'];
	function packageExtBidder2ContactLayout(basicsLookupdataConfigGenerator, $injector, communicationFormatter) {
		return {
			fid: 'procurement.package.extbidder2contact.detail',
			version: '1.1.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['bpdcontactfk', 'bpdcontactrolefk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				'bpdcontactfk': {
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-contact-dialog',
						'options': {
							displayMember: 'FirstName',
							filterKey: 'procurement-package-extbidder-businesspartner-contact-filter',
							showClearButton: true
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-contact-dialog',
							lookupOptions: {
								filterKey: 'procurement-package-extbidder-businesspartner-contact-filter',
								showClearButton: true,
								displayMember: 'FirstName'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FirstName'
						}
					}
				},
				'bpdcontactrolefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.contact.role', null, {showClearButton: true}),
			},
			addition: {
				'grid': extendGridGrouping([
					{
						'afterId': 'ContactFk',
						'id': 'FamilyName',
						'field': 'BpdContactFk',
						'name': 'Family Name',
						'name$tr$': 'procurement.package.contactFamilyName',
						'width': 120
					},
					{
						'afterId': 'FamilyName',
						'id': 'Title',
						'field': 'BpdContactFk',
						'name': 'Title',
						'name$tr$': 'procurement.package.businessPartnerContactTitle',
						'width': 120
					},
					{
						'afterId': 'Title',
						'id': 'Telephone1',
						'field': 'BpdContactFk',
						'name': 'Telephone1',
						'name$tr$': 'procurement.package.businessPartnerContactTel1',
						'formatter': communicationFormatter,
						'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telephone1', 'domainType': 'lookup', 'communicationType': 'phone'},
						'width': 120
					},
					{
						'afterId': 'Telephone1',
						'id': 'Telephone2',
						'field': 'BpdContactFk',
						'name': 'Telephone2',
						'name$tr$': 'procurement.package.businessPartnerContactTel2',
						'formatter': communicationFormatter,
						'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telephone2', 'domainType': 'lookup', 'communicationType': 'phone'},
						'width': 120
					},
					{
						'afterId': 'Telephone2',
						'id': 'Telefax',
						'field': 'BpdContactFk',
						'name': 'Telefax',
						'name$tr$': 'procurement.package.businessPartnerContactTelefax',
						'formatter': communicationFormatter,
						'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telefax', 'domainType': 'lookup', 'communicationType': 'phone'},
						'width': 120
					},
					{
						'afterId': 'Telefax',
						'id': 'Mobile',
						'field': 'BpdContactFk',
						'name': 'Mobile',
						'name$tr$': 'procurement.package.businessPartnerContactMobile',
						'formatter': communicationFormatter,
						'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Mobile', 'domainType': 'lookup', 'communicationType': 'phone'},
						'width': 120
					},
					{
						'afterId': 'Mobile',
						'id': 'Internet',
						'field': 'BpdContactFk',
						'name': 'Internet',
						'name$tr$': 'procurement.package.businessPartnerContactInternet',
						'width': 120
					},
					{
						'afterId': 'Internet',
						'id': 'contactEmail',
						'field': 'BpdContactFk',
						'name': 'Email',
						'name$tr$': 'procurement.package.businessPartnerContactEmail',
						'formatter': communicationFormatter,
						'displayMember': 'Email',
						'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Email', 'domainType': 'lookup', 'communicationType': 'email'},
						'width': 120
					},
					{
						'afterId': 'contactEmail',
						'id': 'BpdContactSubsidiary',
						'field': 'BpdContactFk',
						'name': 'Subsidiary Description',
						'name$tr$': 'procurement.package.businessPartnerContactSubsidiaryDescription',
						'displayMember': 'Description',
						'width': 170
					},
					{
						'afterId': 'BpdContactSubsidiary',
						'id': 'AddressLine',
						'field': 'BpdContactFk',
						'name': 'Address',
						'name$tr$': 'procurement.package.businessPartnerContactSubsidiaryAddress',
						'width': 120
					}]),
				'detail': extendDetailGrouping([
					{
						'afterId': 'ContactFk',
						'rid': 'FamilyName',
						'model': 'BpdContactFk',
						'label': 'Family Name',
						'label$tr$': 'procurement.package.contactFamilyName'
					},
					{
						'afterId': 'FamilyName',
						'rid': 'Title',
						'model': 'BpdContactFk',
						'label': 'Title',
						'label$tr$': 'procurement.package.businessPartnerContactTitle'
					},
					{
						'afterId': 'Title',
						'rid': 'Telephone1',
						'model': 'BpdContactFk',
						'label': 'Telephone1',
						'label$tr$': 'procurement.package.businessPartnerContactTel1'
					},
					{
						'afterId': 'Telephone1',
						'rid': 'Telephone2',
						'model': 'BpdContactFk',
						'label': 'Contact Telephone2',
						'label$tr$': 'procurement.package.businessPartnerContactTel2'
					},
					{
						'afterId': 'Telephone2',
						'rid': 'Telefax',
						'model': 'BpdContactFk',
						'label': 'Telefax',
						'label$tr$': 'procurement.package.businessPartnerContactTelefax'
					},
					{
						'afterId': 'Telefax',
						'rid': 'Mobile',
						'model': 'BpdContactFk',
						'label': 'Mobile',
						'label$tr$': 'procurement.package.businessPartnerContactMobile'
					},
					{
						'afterId': 'Mobile',
						'rid': 'Internet',
						'model': 'BpdContactFk',
						'label': 'Internet',
						'label$tr$': 'procurement.package.businessPartnerContactInternet'
					},
					{
						'afterId': 'Internet',
						'rid': 'contactEmail',
						'model': 'BpdContactFk',
						'label': 'Email',
						'label$tr$': 'procurement.package.businessPartnerContactEmail',
						'displayMember': 'Email'
					},
					{
						'afterId': 'contactEmail',
						'rid': 'BpdContactSubsidiary',
						'model': 'BpdContactFk',
						'label': 'Branch Description',
						'label$tr$': 'procurement.package.businessPartnerContactSubsidiaryDescription',
						'displayMember': 'Description'
					},
					{
						'afterId': 'BpdContactSubsidiary',
						'rid': 'AddressLine',
						'model': 'BpdContactFk',
						'label': 'Address',
						'label$tr$': 'procurement.package.businessPartnerContactSubsidiaryAddress'
					}
				])
			},

		};
	}

	function extendGridGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			if (column.field === 'BpdContactFk') {
				if (!column.formatterOptions) {
					angular.extend(column, {
						'formatterOptions': {'lookupType': 'contact', 'displayMember': column.displayMember || column.id},
					});
				}
				angular.extend(column, {
					'grouping': {
						'title': column.name$tr$,
						'getter': column.displayMember || column.id,
						'aggregators': [],
						'aggregateCollapsed': true
					},
					'editor': 'lookup',
					'editorOptions': {
						'directive': 'business-partner-main-contact-dialog-without-teams',
						'lookupOptions': {'filterKey': 'procurement-package-extbidder-businesspartner-contact-filter', 'displayMember': column.displayMember || column.id}
					},
					'formatter': 'lookup'
				});
			}
		});
		return gridColumns;
	}
	function extendDetailGrouping(detailColumns) {
		angular.forEach(detailColumns, function (column) {
			if (column.model === 'BpdContactFk') {
				angular.extend(column, {
					'gid': 'basicData',
					'type': 'directive',
					'directive': 'business-partner-main-contact-dialog-without-teams',
					'options': {
						'filterKey': 'procurement-package-extbidder-businesspartner-contact-filter',
						'displayMember': column.displayMember || column.rid,
					}
				});

			}
		});
		return detailColumns;
	}

	angular.module(moduleName).factory('packageExtBidder2ContactUIStandardService', packageExtBidder2ContactUIStandardService);
	packageExtBidder2ContactUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'packageExtBidder2ContactLayout', 'procurementPackageTranslationService','platformUIStandardExtentService'];
	function packageExtBidder2ContactUIStandardService(platformUIStandardConfigService, platformSchemaService,
		packageExtBidder2ContactLayout, procurementPackageTranslationService,platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule: 'Procurement.Common'}).properties;
		var service = new BaseService(packageExtBidder2ContactLayout, domains, procurementPackageTranslationService);
		platformUIStandardExtentService.extend(service, packageExtBidder2ContactLayout.addition, domains);
		return service;
	}
})(angular);
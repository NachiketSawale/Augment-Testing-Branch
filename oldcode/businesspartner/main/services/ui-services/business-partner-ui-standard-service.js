/**
 * Created by chi on 4/27/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainActivityUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.main').factory('businessPartnerMainBusinessPartnerUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainHeaderLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			/* jshint -W072 */
			function (platformUIStandardConfigService, businesspartnerMainHeaderLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'}).properties;

				const entityInformation = { module: angular.module('businesspartner.main'), moduleName: 'Businesspartner.Main', entity: 'BusinessPartner' };
				var service = new BaseService(businesspartnerMainHeaderLayout, domains, businesspartnerMainTranslationService, entityInformation);
				var specialGroupings = [
					{
						id: 'address',
						grouping: {
							getter: 'SubsidiaryDescriptor.AddressDto.AddressLine'
						}
					},
					{
						id: 'telephone',
						grouping: {
							getter: 'SubsidiaryDescriptor.TelephoneNumber1Dto.Telephone'
						}
					},
					{
						id: 'telephone2',
						grouping: {
							getter: 'SubsidiaryDescriptor.TelephoneNumber2Dto.Telephone'
						}
					},
					{
						id: 'telefax',
						grouping: {
							getter: 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto.Telephone'
						}
					},
					{
						id: 'mobile',
						grouping: {
							getter: 'SubsidiaryDescriptor.TelephoneNumberMobileDto.Telephone'
						}
					}
				];
				businessPartnerHelper.extendSpecialGrouping(specialGroupings, businessPartnerHelper.extendGrouping(businesspartnerMainHeaderLayout.addition.grid));
				platformUIStandardExtentService.extend(service, businesspartnerMainHeaderLayout.addition, domains);

				return service;
			}
		]);
})(angular);

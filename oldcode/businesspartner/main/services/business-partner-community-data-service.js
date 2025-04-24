/**
 * Created by chi on 07.12.2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainCommunityService', businessPartnerMainCommunityService);

	businessPartnerMainCommunityService.$inject = [
		'_',
		'platformDataServiceFactory',
		'globals',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'platformContextService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService',
		'businesspartnerMainHeaderDataService',
		'$injector'
	];

	function businessPartnerMainCommunityService(
		_,
		platformDataServiceFactory,
		globals,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		platformContextService,
		platformRuntimeDataService,
		basicsLookupdataLookupFilterService,
		businesspartnerMainHeaderDataService,
		$injector
	) {

		var options = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'businessPartnerMainCommunityService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'businesspartner/main/community/',
					endRead: 'getbyparentid'
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var bp = businesspartnerMainHeaderDataService.getSelected();
							if (bp) {
								creationData.PKey1 = bp.Id;
							}
						},
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'Community',
						parentService: businesspartnerMainHeaderDataService
					}
				},
				// dataProcessor: [processItem()],
				actions: {
					create: 'flat',
					delete: true
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(options);
		var service = serviceContainer.service;
		service.registerEntityDeleted(onBusinessPartnerMainCommunityDeleted);
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'CommunityDto',
			moduleSubModule: 'BusinessPartner.Main',
			validationService: 'businessPartnerMainCommunityValidationService',
			mustValidateFields: ['BidderFk']
		});

		// service.canDelete = canDelete;
		// service.canCreate = canCreate;
		return service;
		function onBusinessPartnerMainCommunityDeleted() {
			let businessPartnerMainCommunityValidationService=$injector.get('businessPartnerMainCommunityValidationService');
			let nowData = service.getList();
			if (nowData&&nowData.length>0) {
				businessPartnerMainCommunityValidationService.validatePercentage(nowData[0],nowData[0].Percentage,'Percentage');
			}
		}
		// //////////////////////////
		function incorporateDataRead(readData, data) {
			var dataRead = null;
			if (angular.isArray(readData)) {
				dataRead = data.handleReadSucceeded(readData, data);
			} else if (angular.isObject(readData)) {
				basicsLookupdataLookupDescriptorService.attachData(readData || {});
				dataRead = data.handleReadSucceeded(readData.Main, data);
			}

			service.goToFirst(data);
			return dataRead || [];
		}
	}

})(angular);
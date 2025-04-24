/**
 * Created by clv on 7/31/2017.
 */
(function (angular){

	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonSuggestedBiddersDataService',procurementCommonSuggestedBiddersDataService);
	procurementCommonSuggestedBiddersDataService.$inject = ['globals', '$injector','procurementCommonDataServiceFactory',
		'procurementCommonSuggestedBidderReadonlyProcessor','basicsLookupdataLookupFilterService','platformDataServiceDataProcessorExtension', 'platformContextService', '$http', 'basicsLookupdataLookupDescriptorService'];
	/* 'basicsCommonReadDataInterceptor', */
	function procurementCommonSuggestedBiddersDataService(globals, $injector,dataServiceFactory, procurementCommonSuggestedBidderReadonlyProcessor,basicsLookupdataLookupFilterService,platformDataServiceDataProcessorExtension// ,
		/* readDataInterceptor */, platformContextService, $http, basicsLookupdataLookupDescriptorService){

		return dataServiceFactory.createService(constructorFn,'procurementCommonSuggestedBiddersDataService');

		function constructorFn(parentService){
			var listResult = {};
			var serviceContainer = null;
			// if it is in rfq module, it is readonly -can not delete items or create new items.
			var isProcurementRfqModule = (parentService.getModule() && parentService.getModule().name || ' ') === 'procurement.rfq';
			var createAction = isProcurementRfqModule ? false : 'flat';
			var tmpServiceInfo = {
				flatLeafItem: {
					serviceName: 'procurementCommonSuggestedBiddersDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl+'procurement/common/suggestedbidder/'
					},
					presenter: {
						list: {
							initCreationData: initCreationData,
							incorporateDataRead: incorporateDataRead,
							handleCreateSucceeded: createSucceeded
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {delete: !isProcurementRfqModule, create: createAction},
					entityRole: { leaf: {itemName: 'PrcSuggestedBidder',parentService: parentService} },
					dataProcessor: [procurementCommonSuggestedBidderReadonlyProcessor]
				}
			};
			serviceContainer  = dataServiceFactory.createNewComplete(tmpServiceInfo,{readonly: ['Id']});

			var service = serviceContainer.service;
			// readDataInterceptor.init(serviceContainer.service,serviceContainer.data);

			service.reload = function(){
				serviceContainer.data.usesCache = false;
				serviceContainer.data.doReadData(serviceContainer.data);
			};
			service.clearCache = function clearCacheAndItems(){
				serviceContainer.data.cache = {};
				serviceContainer.service.setList([]);
			};

			service.getCellEditable = procurementCommonSuggestedBidderReadonlyProcessor.getCellEditable;

			// service.setEntityReadonly = setEntityReadonly;
			// var onParentItemCreated = function onParentItemCreated(e, args){
			// service.setCreatedItems(args.bidder, true);
			// };
			//
			// if(parentService.completeItemCreated){
			// parentService.completeItemCreated.register(onParentItemCreated);
			// }

			if(isProcurementRfqModule){
				service.deleteItem = null;
			}

			let userInfo = platformContextService.getContext();

			var filters = [
				{
					key: 'procurement-common-suggestedbidder-businesspartner-subsidiary-filter',
					serverSide: true,
					serverKey: 'businesspartner-main-subsidiary-common-filter',
					fn: function () {
						var dataService= $injector.get('procurementCommonSuggestedBiddersDataService');
						var currentItem = dataService.getService(parentService).getSelected();
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null
						};
					}
				},
				{
					key: 'procurement-common-suggestedbidder-businesspartner-contact-filter',
					serverSide: true,
					serverKey: 'procurement-rfq-businesspartner-contact-filter',
					fn: function () {
						var dataService= $injector.get('procurementCommonSuggestedBiddersDataService');
						var currentItem = dataService.getService(parentService).getSelected();
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
							SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
						};
					}
				},
				{
					key: 'procurement-common-suggestedbidder-businesspartner-supplier-filter',
					serverSide: true,
					serverKey: 'procurement-rfq-req-package-filter',
					fn: function (currentItem) {
						return {
							BusinessPartnerFk: currentItem.BusinessPartnerFk,
							SubledgerContextFk: service.companyInfo.SubledgerContextFk,
							SubsidiaryFk: currentItem.SubsidiaryFk
						};
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.getFieldDisplayText = function (model, id, field) {
				var ret = '';
				var modelData;

				if(model === 'ContactFk') {
					modelData = listResult.contact;
					var found = 0;
					if(modelData && modelData.length > 0){
						for(var i = 0; i < modelData.length; ++i){
							if(modelData[i].Id === id){
								ret = modelData[i][field];
								found = 1;
								break;
							}
						}
					}
					if(found === 0){
						var contacts =	basicsLookupdataLookupDescriptorService.getData('contact');
						if(!_.isNil(contacts)){
                      var contact = _.find(contacts,{Id: id});
                      if(!_.isNil(contact)){
	                      ret = contact[field];
                      }
						}
					}
				}

				return ret;
			};

			service.doProcessData = function doProcessData(items) {
				platformDataServiceDataProcessorExtension.doProcessData(items, serviceContainer.data);
			};

			service.companyInfo = null;
			service.getCompanyById = function getCompanyById(companyId) {
				$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId)
					.then(function (response) {
						service.companyInfo = response.data;
					});
			};
			service.getCompanyById(userInfo.signedInClientId);
			return service;

			// ///////////////////
			function initCreationData(creationData) {
				var prcParentItem = parentService.getSelected();
				var prcHeader = prcParentItem.PrcHeaderEntity;
				if(prcHeader){
					creationData.mainItemId = prcHeader.Id;
				}else{
					creationData.mainItemId = prcParentItem.PrcHeaderFk;
				}
			}

			function incorporateDataRead(result, data){
				if (!result) {
					return serviceContainer.data.handleReadSucceeded([], data, true);
				}
				if (!angular.isArray(result)) {
					listResult = result;
					var parentItem = parentService.getSelected();
					if(parentItem !== null && parentItem !== undefined){
						angular.forEach(result.Main, function (item) {
							// fixed task: #125423
							item.PrcHeaderEntity = parentItem.PrcHeaderEntity;
						});
					}
					return serviceContainer.data.handleReadSucceeded(result.Main, data, true);
				}
				else {
					return serviceContainer.data.handleReadSucceeded(result, data, true);
				}
			}
			function createSucceeded(newData){
				var parentItem = parentService.getSelected();
				if(parentItem !== null && parentItem !== undefined){
					// fixed task: #125423, search the bp will set the defaut structure from main entity
					newData.PrcHeaderEntity = parentItem.PrcHeaderEntity;
				}

			}
		}
	}
})(angular);

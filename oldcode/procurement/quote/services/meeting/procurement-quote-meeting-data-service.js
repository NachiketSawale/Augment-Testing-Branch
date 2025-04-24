/**
 * Created by yanga on 10.08.2022
 */
(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'procurement.quote';

	angular.module(moduleName).factory('procurementQuoteMeetingService', [
		'_', '$http', 'platformDataServiceFactory', 'procurementQuoteHeaderDataService', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'ServiceDataProcessDatesExtension', 'basicsMeetingHeaderReadonlyProcessor', 'basicsMeetingCreateService', 'basicsMeetingMainService',
		function (_, $http, platformDataServiceFactory, procurementQuoteHeaderDataService, lookupDescriptorService,
			lookupFilterService, basicsLookupdataLookupDataService, ServiceDataProcessDatesExtension, basicsMeetingHeaderReadonlyProcessor, basicsMeetingCreateService, basicsMeetingMainService) {

			let serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementQuoteMeetingService',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/meeting/', endCreate: 'createnew'},
					httpRead: {route: globals.webApiBaseUrl + 'procurement/quote/header/', endRead: 'getmeeting'},
					dataProcessor: [basicsMeetingHeaderReadonlyProcessor,
						new ServiceDataProcessDatesExtension(['DateReceived', 'StartTime', 'FinishTime'])],
					presenter: {
						list: {
							initReadData: function initReadData(readData) {
								let selectCheckList = procurementQuoteHeaderDataService.getSelected();
								let checklistId = -1;
								if (selectCheckList) {
									checklistId = selectCheckList.Id;
								}
								readData.filter = '?QtnHeaderFk=' + checklistId;
							},
							handleCreateSucceeded: function initCreationData(newData) {
								let selectedItem = procurementQuoteHeaderDataService.getSelected();
								if (selectedItem) {
									newData.CheckListFk = selectedItem.Id;
									newData.Code = 'Is generated';
								}
							}
						}
					},
					actions: {
						delete: {}, create: 'flat',
						canDeleteCallBackFunc: function (item) {
							let readonlyStatusItems = _.filter(lookupDescriptorService.getData('MeetingStatus'), {IsReadonly: true});
							return !_.some(readonlyStatusItems, {Id: item.MtgStatusFk});
						}
					},
					entityRole: {
						leaf: {
							itemName: 'MtgHeader',
							parentService: procurementQuoteHeaderDataService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			let data = serviceContainer.data;

			initialize();

			service.createItem = function createMeeting() {
				let quoteHeaderItem = procurementQuoteHeaderDataService.getSelected();
				if (!quoteHeaderItem) return;
				let contextData = {
					QtnHeaderFk: quoteHeaderItem.Id
				};
				if (quoteHeaderItem.ProjectFk) {
					contextData = angular.extend(contextData, {ProjectFk: quoteHeaderItem.ProjectFk});
				}
				// set clerk context data
				let clerks = [];
				if (quoteHeaderItem.ClerkPrcFk) {
					clerks.push(quoteHeaderItem.ClerkPrcFk);
				}
				if (quoteHeaderItem.ClerkReqFk) {
					clerks.push(quoteHeaderItem.ClerkReqFk);
				}
				if (clerks.length > 0) {
					basicsMeetingCreateService.setClerkFromMainData(clerks);
					basicsMeetingCreateService.setClerkFromContext(clerks);
				}
				// active copy from context button
				basicsMeetingCreateService.setClerkCopyFromContextStatus(true);
				basicsMeetingCreateService.setContactCopyFromContextStatus(false);
				basicsMeetingCreateService.showCreateDialog(null, contextData, service);
			};

			service.deleteSelection = function deleteSelection() {
				basicsMeetingMainService.deleteMeeting(service, data);
			};
			return service;

			function initialize() {
				let filters = [
					{
						key: 'meeting-attendee-subsidiary-filter',
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						serverSide: true,
						fn: function (item) {
							return {
								BusinessPartnerFk: !_.isNil(item) ? item.BusinessPartnerFk : null
							};
						}
					},
					{
						key: 'meeting-attendee-contact-filter',
						serverSide: true,
						serverKey: 'business-partner-contact-filter-by-simple-business-partner',
						fn: function (item) {
							return {
								BusinessPartnerFk: !_.isNil(item) ? item.BusinessPartnerFk : null
							};
						}
					},
					{
						key: 'basics-meeting-clerk-filter',
						serverSide: true,
						fn: function () {
							return 'IsLive=true';
						}
					},
					{
						key: 'basics-meeting-rfqheaderfk-filter',
						serverKey: 'basics-meeting-rfqheaderfk-filter',
						serverSide: true,
						fn: function (item) {
							return {RfqHeaderFk: null, CompanyFk: item.CompanyFk, ProjectFk: item.ProjectFk};
						}
					},
					{
						key: 'basics-meeting-quote-filter',
						serverKey: 'basics-meeting-quote-filter',
						serverSide: true,
						fn: function (item) {
							return {RfqHeaderFk: null, CompanyFk: item.CompanyFk, ProjectFk: item.ProjectFk};
						}
					},
					{
						key: 'basics-meeting-checklist-filter',
						serverSide: true,
						fn: function (item) {
							if (!_.isNil(item.ProjectFk)) {
								return 'BasCompanyFk = ' + item.CompanyFk + ' && PrjProjectFk = ' + item.ProjectFk;
							} else {
								return 'BasCompanyFk = ' + item.CompanyFk;
							}
						}
					},
					{
						key: 'basics-meeting-defect-filter',
						serverSide: true,
						fn: function (item) {
							if (!_.isNil(item.ProjectFk)) {
								return 'BasCompanyFk = ' + item.CompanyFk + ' && PrjProjectFk = ' + item.ProjectFk;
							} else {
								return 'BasCompanyFk = ' + item.CompanyFk;
							}
						}
					},
					{
						key: 'basics-meeting-sales-filter',
						serverSide: true,
						fn: function (item) {
							if (!_.isNil(item.ProjectFk)) {
								return 'CompanyFk = ' + item.CompanyFk + ' && ProjectFk = ' + item.ProjectFk;
							} else {
								return 'CompanyFk = ' + item.CompanyFk;
							}
						}
					},
					{
						key: 'basics-meeting-project-info-request-filter',
						serverSide: true,
						serverKey: 'basics-meeting-project-info-request-filter',
						fn: function (item) {
							return {ProjectFk: item.ProjectFk, CompanyFk: item.CompanyFk};
						}
					},
				];
				lookupFilterService.registerFilter(filters);
			}
		}
	]);
})(angular);

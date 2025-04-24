/**
 * Created by zjo on 08.25.2022
 */
(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('rfqMeetingService', [
		'_', '$http','platformDataServiceFactory', 'procurementRfqMainService', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'ServiceDataProcessDatesExtension', 'basicsMeetingHeaderReadonlyProcessor','basicsMeetingCreateService','basicsMeetingMainService','procurementRfqBusinessPartnerService',
		function (_, $http,platformDataServiceFactory, procurementRfqMainService, lookupDescriptorService,
			lookupFilterService, basicsLookupdataLookupDataService, ServiceDataProcessDatesExtension, basicsMeetingHeaderReadonlyProcessor,basicsMeetingCreateService,basicsMeetingMainService,procurementRfqBusinessPartnerService) {

			let serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'rfqMeetingService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/meeting/', endCreate: 'createnew' },
					httpRead: { route: globals.webApiBaseUrl + 'procurement/rfq/header/', endRead: 'getmeeting' },
					dataProcessor: [basicsMeetingHeaderReadonlyProcessor,
						new ServiceDataProcessDatesExtension(['DateReceived', 'StartTime', 'FinishTime'])],
					presenter: {
						list: {
							initReadData: function initReadData(readData) {
								let selectRfq = procurementRfqMainService.getSelected();
								let rfqId = -1;
								if (selectRfq) {
									rfqId = selectRfq.Id;
								}
								readData.filter = '?rfqFk=' + rfqId;
							},
							handleCreateSucceeded: function initCreationData(newData) {
								let selectedItem = procurementRfqMainService.getSelected();
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
							parentService: procurementRfqMainService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			let data = serviceContainer.data;
			initialize();
			service.createItem = function createMeeting() {
				let rfqItem = procurementRfqMainService.getSelected();
				if(!rfqItem) return;
				let contextData = {
					RfqHeaderFk:rfqItem.Id
				};
				if(rfqItem.ProjectFk) {
					contextData = angular.extend(contextData,{ProjectFk:rfqItem.ProjectFk});
				}
				// set clerk context data
				let clerks = [];
				if(rfqItem.ClerkPrcFk) {
					clerks.push(rfqItem.ClerkPrcFk);
				}
				if(rfqItem.ClerkReqFk) {
					clerks.push(rfqItem.ClerkReqFk);
				}
				if(clerks.length > 0 ) {
					basicsMeetingCreateService.setClerkFromMainData(clerks);
					basicsMeetingCreateService.setClerkFromContext(clerks);
				}
				// set bp and contact context data
				// TODO Support multiple bp
				let bps = procurementRfqBusinessPartnerService.getList();
				if(bps.length > 0) {
					let bp = bps[0];
					basicsMeetingCreateService.setBPFromMainData(bp.BusinessPartnerFk);
					basicsMeetingCreateService.setBPFromContext(bp.BusinessPartnerFk);
					let contacts = [];
					contacts.push(bp.ContactFk);
					basicsMeetingCreateService.setContactFromMainData(contacts);
					basicsMeetingCreateService.setContactFromContext(contacts);
				}
				// active copy from context button
				basicsMeetingCreateService.setClerkCopyFromContextStatus(true);
				basicsMeetingCreateService.setContactCopyFromContextStatus(true);
				basicsMeetingCreateService.showCreateDialog(null, contextData,service);
			};

			service.deleteSelection = function deleteSelection() {
				basicsMeetingMainService.deleteMeeting(service,data);
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
							return { RfqHeaderFk: null, CompanyFk: item.CompanyFk, ProjectFk: item.ProjectFk };
						}
					},
					{
						key: 'basics-meeting-quote-filter',
						serverKey: 'basics-meeting-quote-filter',
						serverSide: true,
						fn: function (item) {
							return { RfqHeaderFk: null, CompanyFk: item.CompanyFk, ProjectFk: item.ProjectFk };
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
							return { ProjectFk: item.ProjectFk, CompanyFk: item.CompanyFk };
						}
					},
				];
				lookupFilterService.registerFilter(filters);
			}
		}
	]);
})(angular);

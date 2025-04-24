/**
 * Created by zjo on 08.25.2022
 */
(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'hsqe.checklist';

	angular.module(moduleName).factory('hsqeMeetingService', [
		'_', '$http','$injector','platformDataServiceFactory','hsqeCheckListDataService', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'ServiceDataProcessDatesExtension', 'hsqeMeetingReadonlyProcessor','basicsMeetingCreateService','basicsMeetingMainService','platformContextService',
		function (_, $http,$injector,platformDataServiceFactory, hsqeCheckListDataService, lookupDescriptorService,
			lookupFilterService, basicsLookupdataLookupDataService, ServiceDataProcessDatesExtension, hsqeMeetingReadonlyProcessor,basicsMeetingCreateService,basicsMeetingMainService,platformContextService) {

			let serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'hsqeMeetingService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/meeting/', endCreate: 'createnew' },
					httpRead: { route: globals.webApiBaseUrl + 'hsqe/checklist/header/', endRead: 'getmeeting' },
					dataProcessor: [hsqeMeetingReadonlyProcessor,
						new ServiceDataProcessDatesExtension(['DateReceived', 'StartTime', 'FinishTime'])],
					presenter: {
						list: {
							initReadData: function initReadData(readData) {

								let selectCheckList = hsqeCheckListDataService.getSelected();
								let checklistId = -1;
								if (selectCheckList) {
									checklistId = selectCheckList.Id;
								}
								readData.filter = '?checklistFk=' + checklistId;
							},
							handleCreateSucceeded: function initCreationData(newData) {
								let selectedItem = hsqeCheckListDataService.getSelected();
								if (selectedItem) {
									newData.CheckListFk = selectedItem.Id;
									newData.Code = 'Is generated';
								}
							}
						}
					},
					actions: {
						delete: {}, create: 'flat',
						canCreateCallBackFunc: function () {
							return isMeetingEditable();
						},
						canDeleteCallBackFunc: function (item) {
							let readonlyStatusItems = _.filter(lookupDescriptorService.getData('MeetingStatus'), {IsReadonly: true});
							return !_.some(readonlyStatusItems, {Id: item.MtgStatusFk}) && isMeetingEditable();
						}
					},
					entityRole: {
						leaf: {
							itemName: 'MtgHeader',
							parentService: hsqeCheckListDataService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			let data = serviceContainer.data;

			initialize();

			service.createItem = function createMeeting() {
				let checklistItem = hsqeCheckListDataService.getSelected();
				if(!checklistItem) return;
				let contextData = {
					CheckListFk:checklistItem.Id
				};
				if(checklistItem.PrjProjectFk) {
					contextData = angular.extend(contextData,{ProjectFk:checklistItem.PrjProjectFk});
				}
				// set clerk context data
				let clerks = [];
				if(checklistItem.BasClerkChkFk) {
					clerks.push(checklistItem.BasClerkChkFk);
				}
				if(checklistItem.BasClerkHsqFk) {
					clerks.push(checklistItem.BasClerkHsqFk);
				}
				if(clerks.length > 0 ) {
					basicsMeetingCreateService.setClerkFromMainData(clerks);
					basicsMeetingCreateService.setClerkFromContext(clerks);
				}
				// active copy from context button
				basicsMeetingCreateService.setClerkCopyFromContextStatus(true);
				basicsMeetingCreateService.setContactCopyFromContextStatus(false);
				basicsMeetingCreateService.showCreateDialog(null, contextData,service);
			};

			service.deleteSelection = function deleteSelection() {
				basicsMeetingMainService.deleteMeeting(service,data);
			};
			return service;

			function isMeetingEditable() {
				let selectCheckList = hsqeCheckListDataService.getSelected();
				let loginCompany = platformContextService.clientId;
				return selectCheckList !== null && selectCheckList.BasCompanyFk === loginCompany;

			}
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

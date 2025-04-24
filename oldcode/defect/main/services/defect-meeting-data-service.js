/**
 * Created by chd on 06.15.2022
 */
(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'defect.main';

	angular.module(moduleName).factory('defectMeetingService', [
		'_', '$http', 'platformDataServiceFactory', 'defectMainHeaderDataService', 'basicsLookupdataLookupDescriptorService', 'basicsMeetingMainService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'ServiceDataProcessDatesExtension', 'basicsMeetingHeaderReadonlyProcessor', 'basicsMeetingCreateService',
		function (_, $http, platformDataServiceFactory, defectMainHeaderDataService, lookupDescriptorService, basicsMeetingMainService,
			lookupFilterService, basicsLookupdataLookupDataService, ServiceDataProcessDatesExtension, basicsMeetingHeaderReadonlyProcessor, basicsMeetingCreateService) {

			let setReadonly = function () {
				// if parent satus is readonly, then the form data should not be editable
				if(!_.isNil(defectMainHeaderDataService)){
					var parentSelectItem = defectMainHeaderDataService.getSelected();
					if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
						return false;
					}
				}

				return true;
			};

			let serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'defectMeetingService',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/meeting/', endCreate: 'createnew'},
					httpRead: {route: globals.webApiBaseUrl + 'defect/main/header/', endRead: 'getmeeting'},
					dataProcessor: [basicsMeetingHeaderReadonlyProcessor,
						new ServiceDataProcessDatesExtension(['DateReceived', 'StartTime', 'FinishTime'])],
					presenter: {
						list: {
							initReadData: function initReadData(readData) {
								let selectDefect = defectMainHeaderDataService.getSelected();
								let defectId= -1;
								if (selectDefect) {
									defectId =  selectDefect.Id;
								}
								readData.filter = '?defectId=' + defectId;
							},
							handleCreateSucceeded: function initCreationData(newData) {
								let selectedItem = defectMainHeaderDataService.getSelected();
								if (selectedItem) {
									newData.DefectFk = selectedItem.Id;
									newData.Code = 'Is generated';
								}
							}
						}
					},
					actions: {
						delete: {}, create: 'flat',
						canCreateCallBackFunc: function () {
							return setReadonly();
						},
						canDeleteCallBackFunc: function (item) {
							let readonlyStatusItems = _.filter(lookupDescriptorService.getData('MeetingStatus'), {IsReadonly: true});
							return !_.some(readonlyStatusItems, {Id: item.MtgStatusFk}) && setReadonly();
						}
					},
					entityRole: {
						leaf: {
							itemName: 'MtgHeader',
							parentService: defectMainHeaderDataService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			service.setReadonly = setReadonly;
			let data = serviceContainer.data;

			initialize();

			service.createItem = function createMeeting() {
				let defectItem = defectMainHeaderDataService.getSelected();
				if(!defectItem) return;
				let contextData = {
					DefectFk: defectItem.Id,
					ProjectFk: defectItem.PrjProjectFk
				};

				// set clerk context data
				let clerks = [];
				if(defectItem.BasClerkFk) {
					clerks.push(defectItem.BasClerkFk);
				}
				if(defectItem.BasClerkRespFk) {
					clerks.push(defectItem.BasClerkRespFk);
				}
				if(clerks.length > 0 ) {
					basicsMeetingCreateService.setClerkFromMainData(clerks);
					basicsMeetingCreateService.setClerkFromContext(clerks);
				}

				// set contact context data
				let contacts = [];
				if(defectItem.BpdContactFk) {
					contacts.push(defectItem.BpdContactFk);
				}
				if(contacts.length > 0 ) {
					basicsMeetingCreateService.setContactFromContext(contacts);
				}

				basicsMeetingCreateService.setBPFromContext(defectItem.BpdBusinesspartnerFk);

				// active copy from context button
				basicsMeetingCreateService.setClerkCopyFromContextStatus(true);
				basicsMeetingCreateService.setContactCopyFromContextStatus(true);
				basicsMeetingCreateService.showCreateDialog(null, contextData,service);
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
								BusinessPartnerFk: !_.isNil(item)? item.BusinessPartnerFk : null
							};
						}
					},
					{
						key: 'meeting-attendee-contact-filter',
						serverSide: true,
						serverKey: 'business-partner-contact-filter-by-simple-business-partner',
						fn: function (item) {
							return {
								BusinessPartnerFk: !_.isNil(item)? item.BusinessPartnerFk : null
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
							return {RfqHeaderFk: null, CompanyFk:item.CompanyFk, ProjectFk: item.ProjectFk};
						}
					},
					{
						key: 'basics-meeting-quote-filter',
						serverKey: 'basics-meeting-quote-filter',
						serverSide: true,
						fn: function (item) {
							return {RfqHeaderFk: null, CompanyFk:item.CompanyFk, ProjectFk: item.ProjectFk};
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
						key:'basics-meeting-project-info-request-filter',
						serverSide: true,
						serverKey: 'basics-meeting-project-info-request-filter',
						fn:function(item){
							return { ProjectFk: item.ProjectFk, CompanyFk: item.CompanyFk };
						}
					},
				];
				lookupFilterService.registerFilter(filters);
			}
		}
	]);
})(angular);

/**
 * Created by chd on 04/14/2022.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).service('basicsMeetingCreateService',
		['_', '$injector','$timeout','$http', 'platformModalService', function (_, $injector, $timeout,$http,platformModalService) {

			let service = {}, requiredClerks = [], requiredContacts = [], optionalClerks = [], optionalContacts = [], clerkFromContext = [],
				contactFromContext = [], bpFromContext = null, projectId = null, clerkFromMainData = [],copyFromContextForClerk = false,copyFromContextForContact = false
				,contactFromMainData = [],bpFromMainData =  null;

			// attendeeContext --> {clerkContext: []; contactContext: []}
			service.showCreateDialog = function showCreateDialog(attendeeContext,contextData,dataService) {
				let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
				let context = cloudDesktopPinningContextService.getContext();
				let item =_.find(context, {'token': 'project.main'});
				if (item){
					let project = {
						Id : item.id
					};
					service.setContextInfo(project);
				} else if(angular.isDefined(contextData) && Object.prototype.hasOwnProperty.call(contextData, 'ProjectFk')) {
					service.setContextInfo({
						Id : contextData.ProjectFk
					});
				}

				if (attendeeContext && angular.isDefined(attendeeContext.clerkContext) && angular.isArray(attendeeContext.clerkContext)) {
					service.setClerkFromContext(attendeeContext.clerkContext);
				}

				if (attendeeContext && angular.isDefined(attendeeContext.contactContext) && angular.isArray(attendeeContext.contactContext)) {
					service.setContactFromContext(attendeeContext.contactContext);
				}

				let modalOption = {
					templateUrl: globals.appBaseUrl + 'basics.meeting/templates/meeting-create-dialog.html',
					project: item,
					contextData:contextData,
					dataService:dataService
				};

				platformModalService.showDialog(modalOption).then(function() {
					service.clearAllSelected();
					service.clearContext();
				});
			};

			service.setClerkFromMainData  = function setClerkFromMainData(items) {
				clerkFromMainData = items;
			};
			service.getClerkFromMainData  = function getClerkFromMainData() {
				return clerkFromMainData;
			};
			service.setClerkCopyFromContextStatus  = function setClerkCopyFromContextStatus(status) {
				copyFromContextForClerk = status;
			};
			service.setContactCopyFromContextStatus  = function setContactCopyFromContextStatus(status) {
				copyFromContextForContact = status;
			};
			service.getClerkCopyFromContextStatus  = function getClerkCopyFromContextStatus() {
				return service.getSelectedProjectId() !== null || copyFromContextForClerk;
			};
			service.getContactCopyFromContextStatus  = function getContactCopyFromContextStatus() {
				return service.getSelectedProjectId() !== null || copyFromContextForContact;
			};
			service.setRequiredClerks = function setRequiredClerks(items) {
				requiredClerks = items;
			};

			service.setOptionalClerks = function setOptionalClerks(items) {
				optionalClerks = items;
			};

			service.getSelectedClerks = function getSelectedClerks() {
				let clerkIds = [];
				clerkIds = clerkIds.concat(requiredClerks);
				clerkIds = clerkIds.concat(optionalClerks);
				return clerkIds;
			};

			service.setRequiredContacts = function setRequiredContacts(items) {
				requiredContacts = items;
			};

			service.setOptionalContacts = function setOptionalContacts(items) {
				optionalContacts = items;
			};

			service.getSelectedContacts = function getSelectedContacts() {
				let contactIds = [];
				contactIds = contactIds.concat(requiredContacts);
				contactIds = contactIds.concat(optionalContacts);
				return contactIds;
			};

			service.setContextInfo = function setContextInfo(item) {
				if(item === null) { // unselected project
					projectId = null;
					service.clearProjectRelatedContext();
					service.setClerkFromContext(service.getClerkFromMainData());
					service.setBPFromContext(service.getBPFromMainData());
					service.setContactFromContext(service.getContactFromMainData());
				} else {
					projectId = item.Id;
					let url = globals.webApiBaseUrl + 'basics/meeting/getprojectclerkcontactinfo?projectId=' + projectId;
					$http.get(url).then(function (response) {
						if (response.data){
							service.setClerkFromContext(response.data.Clerks);
							service.setContactFromContext(response.data.Contacts);
							service.setBPFromContext(response.data.BusinessPartner);
						}
					});
				}
			};
			service.getSelectedProjectId = function getSelectedProjectId() {
				return projectId;
			};

			service.clearAllSelected = function clearAllSelected() {
				requiredClerks = [];
				requiredContacts = [];
				optionalClerks = [];
				optionalContacts = [];
				projectId = null;
			};

			service.getClerkFromContext = function getClerkFromContext() {
				return clerkFromContext;
			};

			service.setClerkFromContext = function setClerkFromContext(items) {
				items.forEach(item=>{
					let clerk = _.find(clerkFromContext, item);
					if(!clerk) {
						clerkFromContext.push(item);
					}
				});
			};

			service.getContactFromContext = function getContactFromContext() {
				return contactFromContext;
			};

			service.setContactFromContext = function setContactFromContext(items) {
				contactFromContext = items;
			};

			service.getBPFromContext = function getBPFromContext() {
				return bpFromContext;
			};

			service.setBPFromContext = function setBPFromContext(items) {
				bpFromContext = items;
			};

			service.setBPFromMainData = function setBPFromContext(items) {
				return bpFromMainData =  items;
			};
			service.getBPFromMainData = function getBPFromMainData() {
				return bpFromMainData;
			};

			service.setContactFromMainData = function setContactFromMainData(items) {
				return contactFromMainData =  items;
			};

			service.getContactFromMainData = function getContactFromMainData() {
				return contactFromMainData;
			};
			service.clearProjectRelatedContext = function clearProjectRelatedContext() {
				clerkFromContext = [];
				contactFromContext = [];
				bpFromContext = null;
			};
			service.clearContext = function clearContext() {
				clerkFromContext = [];
				contactFromContext = [];
				bpFromContext = null;
				copyFromContextForClerk = false;
				copyFromContextForContact = false;
				clerkFromMainData = [];
				bpFromMainData = null;
				contactFromMainData = [];
			};

			return service;
		}]);
})(angular);
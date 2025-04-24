/**
 * Created by chd on 12/9/2021.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';
	let basicsMeetingModule = angular.module('basics.meeting');

	basicsMeetingModule.factory('basicsMeetingMainService', ['$injector', '$translate', 'platformDataServiceFactory','basicsCommonMandatoryProcessor', 'ServiceDataProcessDatesExtension', 'PlatformMessenger', '$http', '$q', '$log',
		'basicsLookupdataLookupFilterService', 'basicsMeetingHeaderReadonlyProcessor', 'platformRuntimeDataService', '$timeout', 'basicsMeetingValidationService', 'cloudDesktopPinningContextService',
		'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService', 'platformDataValidationService', 'meetingNumberGenerationSettingsService','platformModalService', 'basicsMeetingCreateService',

		function ($injector, $translate, platformDataServiceFactory, mandatoryProcessor, ServiceDataProcessDatesExtension, PlatformMessenger, $http, $q, $log,
			basicsLookupdataLookupFilterService, basicsMeetingHeaderReadonlyProcessor, platformRuntimeDataService, $timeout, basicsMeetingValidationService, cloudDesktopPinningContextService,
			lookupDescriptorService, cloudDesktopSidebarService, platformDataValidationService, meetingNumberGenerationSettingsService,platformModalService, basicsMeetingCreateService) {

			let basicsMeetingServiceOption = {
				flatRootItem: {
					module: basicsMeetingModule,
					serviceName: 'basicsMeetingMainService',
					entityNameTranslationID: 'basics.meeting.entityMeetingTitle',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/meeting/', endCreate: 'createnew' },
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/meeting/', endUpdate: 'update'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/meeting/', endRead: 'filtered',usePostForRead: true},
					httpDelete: {route: globals.webApiBaseUrl + 'basics/meeting/', endDelete: 'deletemtg'},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'MtgHeader',
							moduleName: 'basics.meeting.meetingModule',
							handleUpdateDone: handleUpdateDone
						}
					},
					translation: {
						uid: 'basicsMeetingMainService',
						title: 'basics.meeting.entityMeetingTitle'
					},
					presenter: {
						list: {
							handleCreateSucceeded: function initCreationData(newData) {
								let pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
								if (!_.isNil(pinProjectEntity)) {
									newData.ProjectFk = pinProjectEntity.id;
								}
							},
							incorporateDataRead: function (result, data) {
								return serviceContainer.data.handleReadSucceeded(result, data);
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
					dataProcessor: [
						basicsMeetingHeaderReadonlyProcessor,
						new ServiceDataProcessDatesExtension(['DateReceived', 'StartTime', 'FinishTime'])],
					sidebarSearch: {
						options: {
							moduleName: 'basics.meeting',
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: null,
							withExecutionHints: true,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}],
								setContextCallback: function (prjService) {
									cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'PrjProjectFk');
								}
							}
						}
					}
				}
			};

			function handleUpdateDone(updateData, response, data) {
				if (response && response.BlobSpecificationToSave && response.BlobSpecificationToSave.Id !== 0) {
					let childServices = service.getChildServices();
					let SelectedMeetingEntities = service.getSelectedEntities(); // Do not use 'getSelected' method, because 'getSelected' method return the previous item in here.
					if (angular.isArray(SelectedMeetingEntities) && SelectedMeetingEntities[0] && response.MainItemId && response.MainItemId === SelectedMeetingEntities[0].Id) {
						_.forEach(childServices, function (childService) {
							if (childService.setCurrentSpecification) {
								childService.setCurrentSpecification(response.BlobSpecificationToSave);
							}
						});
					}
				}

				data.handleOnUpdateSucceeded(updateData, response, data, true);
			}

			let serviceContainer = platformDataServiceFactory.createNewComplete(basicsMeetingServiceOption);
			let service = serviceContainer.service;
			let data = serviceContainer.data;

			let onCreateSucceeded = data.onCreateSucceeded;
			data.onCreateSucceeded = function (newData, data, creationData) {
				meetingNumberGenerationSettingsService.assertLoaded().then(function () {
					newData.Code = meetingNumberGenerationSettingsService.provideNumberDefaultText();
					let currentItem = service.getSelected();
					let result = {apply: true, valid: true};
					if(newData.Code === ''){
						result.valid = false;
						result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
					}
					platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
					platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
					service.fireItemModified(currentItem);

				});

				return onCreateSucceeded.call(serviceContainer.data, newData, data, creationData).then(function () {
					if(service.completeEntityCreateed !== undefined){
						service.completeEntityCreateed.fire(null, newData);
					}
				});
			};

			// load lookup items, and cache in front end.
			lookupDescriptorService.loadData(['MeetingStatus', 'MeetingType']);

			service.getModuleState = function() {
				let readonlyStatus = false;
				let headerItem = service.getSelected();
				if (!headerItem) {
					readonlyStatus = true;
				} else if (headerItem.IsReadonlyStatus !== undefined && headerItem.IsReadonlyStatus) {
					readonlyStatus = true;
				}
				return readonlyStatus;
			};

			service.doPrepareUpdateCall = function doPrepareMeetingUpdateCall(updateData) {
				if (service.getSelected()) {
					updateData.MainItemId = service.getSelected().Id;

					let childServices = service.getChildServices();
					_.forEach(childServices, function (childService) {
						if (childService.provideMinutesChangesToUpdate) {
							childService.provideMinutesChangesToUpdate(updateData);
						}
					});

					// for Absence creation in desktop -> complete needs to updated with the flag
					if (!_.isEmpty(updateData.AbsencesToSave) && updateData.AbsencesToSave[0]) {
						if (updateData.AbsencesToSave[0].Absences && updateData.AbsencesToSave[0].Absences.TakeAbsenceFromLastPeriod === true) {
							updateData.AbsencesToSave[0].TakeAbsenceFromLastPeriod = true;
						}
					}
				}
			};

			service.getHeaderEditAble = function() {
				return !service.getModuleState();
			};

			service.onCreateFromWizardSucceeded = function (newItem) {
				let newEntity = newItem;
				service.refresh().then(function (data) {
					newEntity = getItemById(data, newEntity.Id);
					if (newEntity) {
						$timeout(function () {
							service.setSelected(newEntity);
						});
					}
				});
			};

			function getItemById(collection, id) {
				return _.find(collection, function (item) {
					return item.Id === id;
				});
			}

			let validator = basicsMeetingValidationService(service);
			data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'MtgHeaderDto',
				moduleSubModule: 'Basics.Meeting',
				validationService: validator,
				mustValidateFields: ['Code']
			});

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

			// register filter by hand
			service.registerFilters = function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			// unload filters
			service.unregisterFilters = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			service.registerFilters();

			service.createItem = function createMeeting() {
				basicsMeetingCreateService.showCreateDialog();
			};

			service.deleteSelection =  function deleteSelection() {
				service.deleteMeeting();
			};

			service.deleteMeeting =  function deleteMeeting(dataService,containerData) {
				if(!angular.isDefined(dataService)) {
					dataService = service;
				}
				if(!angular.isDefined(containerData)) {
					containerData = data;
				}
				let item = dataService.getSelected();
				if(item.Recurrence) {
					let modalOption = {
						templateUrl: globals.appBaseUrl + 'basics.meeting/partials/delete-recurrence-meeting.html',
						dataService:dataService
					};
					platformModalService.showDialog(modalOption);
				} else { // default delete
					var modalOptions = {
						headerTextKey: 'basics.meeting.confirmDeleteTitle',
						bodyTextKey: $translate.instant('basics.meeting.confirmDeleteHeader'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'warning'
					};
					return platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.yes) {
							dataService.deleteItem(dataService.getSelected(containerData));
							// If the Minutes text was modified but was not saved before deleting the meeting item,
							// set modifiedSpecification to null to avoid calling the 'update' API.
							let childServices = dataService.getChildServices();
							_.forEach(childServices, function (childService) {
								if (childService.setSpecificationAsModified) {
									childService.setSpecificationAsModified(null);
								}
							});
						}
					});
				}
			};
			service.navigateTo = function navigateTo(item, triggerfield) {
				var data = null;
				var platformObjectHelper=$injector.get('platformObjectHelper');
				if (item && (platformObjectHelper.getValue(item, triggerfield) || item.MtgHeaderFk)) {
					data = platformObjectHelper.getValue(item, triggerfield) || item.MtgHeaderFk;
					if(angular.isString(data)) {
						cloudDesktopSidebarService.filterSearchFromPattern(data);
					} else  if (angular.isNumber(data)) {
						cloudDesktopSidebarService.filterSearchFromPKeys([data]);
					}
				}
			};
			return service;
		}]);
})(angular);

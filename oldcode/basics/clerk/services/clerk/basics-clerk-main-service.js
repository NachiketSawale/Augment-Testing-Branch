/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsClerkMainService
	 * @function
	 *
	 * @description
	 * basicsClerkMainService is the data service for all clerk related functionality.
	 */
	var moduleName = 'basics.clerk';
	var clerkModule = angular.module('basics.clerk');
	clerkModule.factory('basicsClerkMainService', [
		'$q', '$http', '$translate', '_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformModalService', 'basicsClerkValidationProcessor',
		'platformObjectHelper', 'cloudDesktopSidebarService',
		function (
			$q, $http, $translate, _, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformModalService, basicsClerkValidationProcessor,
			platformObjectHelper, cloudDesktopSidebarService
		) {
			var service;
			var factoryOptions = {
				flatRootItem: {
					module: clerkModule,
					serviceName: 'basicsClerkMainService',
					entityNameTranslationID: 'basics.clerk.entityClerk',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/clerk/', endRead: 'listfiltered', usePostForRead: true
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ClerkDto',
						moduleSubModule: 'Basics.Clerk'
					})],
					actions: {delete: true, create: 'flat'},
					entityRole: {
						root: {
							itemName: 'Clerk',
							moduleName: 'cloud.desktop.moduleDisplayNameClerk',
							handleUpdateDone: handleUpdateDone
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};

			function handleUpdateDone(oringinData, updateData) { // jshint ignore:line
				var childServices = service.getChildServices();
				if (updateData) {
					if (updateData.EmailFooterToSave) {
						_.forEach(childServices, function (childService) {
							if (childService.currentEmailChanged) {
								childService.currentEmailChanged.fire(updateData.EmailFooterToSave);
							}
						});
					}

					if (updateData.FooterToSave) {
						_.forEach(childServices, function (childService) {
							if (childService.currentFooterChanged) {
								childService.currentFooterChanged.fire(updateData.FooterToSave);
							}
						});
					}
				}
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = basicsClerkValidationProcessor;
			serviceContainer.data.eMailSpecificationTransferCallback = null;
			serviceContainer.data.footerSpecificationTransferCallback = null;

			service.navigateTo = function navigateTo(item, triggerfield) {
				var clerkId = null;
				if (item && (platformObjectHelper.getValue(item, triggerfield) || item.JobFk)) {
					clerkId = platformObjectHelper.getValue(item, triggerfield) || item.JobFk;
				}
				cloudDesktopSidebarService.filterSearchFromPKeys([clerkId]);
			};

			serviceContainer.data.waitForOutstandingDataTransfer = function waitForOutstandingDataTransfer() {

				if (serviceContainer.data.selectedItem !== null && serviceContainer.data.selectedItem !== undefined) {
					if (serviceContainer.data.selectedItem.Code === null) {
						serviceContainer.data.selectedItem.Code = guid();
					}

					if (serviceContainer.data.selectedItem.Description === null) {
						serviceContainer.data.selectedItem.Description = serviceContainer.data.selectedItem.FamilyName;
					}
					if (serviceContainer.data.selectedItem.Description === null) {
						serviceContainer.data.selectedItem.Description = serviceContainer.data.selectedItem.FirstName;
					}
					if (serviceContainer.data.selectedItem.Description === null) {
						serviceContainer.data.selectedItem.Description = serviceContainer.data.selectedItem.Code;
					}
				}

				if (serviceContainer.data.eMailSpecificationTransferCallback !== null) {
					serviceContainer.data.eMailSpecificationTransferCallback();
				}
				if (serviceContainer.data.footerSpecificationTransferCallback !== null) {
					serviceContainer.data.footerSpecificationTransferCallback();
				}
				return $q.when(true);
			};

			function createdguid() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}

			function guid() {
				return (createdguid() + createdguid() + createdguid() + createdguid());
			}

			service.SetEMailSpecificationTransferCallback = function SetEMailSpecificationTransferCallback(transferCallback) {
				serviceContainer.data.eMailSpecificationTransferCallback = transferCallback;
			};

			service.SetFooterSpecificationTransferCallback = function SetFooterSpecificationTransferCallback(transferCallback) {
				serviceContainer.data.footerSpecificationTransferCallback = transferCallback;
			};

			service.getModuleState = function getModuleState() {
				return false;
			};

			service.getHeaderEditAble = function() {
				return !service.getModuleState();
			};

			service.doPrepareUpdateCall = function doPrepareClerkUpdateCall(updateData) {
				var childServices = service.getChildServices();
				if (service.getSelected()) {
					updateData.MainItemId = service.getSelected().Id;

					_.forEach(childServices, function (childService) {
						if (childService.provideEmailFooterChangesToUpdate) {
							childService.provideEmailFooterChangesToUpdate(updateData);
						}
					});

					_.forEach(childServices, function (childService) {
						if (childService.provideFooterChangesToUpdate) {
							childService.provideFooterChangesToUpdate(updateData);
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

			service.copyClerkGroup = function copyClerkGroup() {
				let selected = service.getSelected();
				if(!_.isNil(selected)){
					$http.post(globals.webApiBaseUrl + 'basics/clerk/copyclerkgroup', [selected.Id]).then(function () {
						service.load().then(function () {
							return service.setSelected(_.first(_.filter(service.getList(),item => selected.Id === item.Id)));
						});
					});
				}
				else{
					let modalOptions = {
						headerText: $translate.instant('basics.clerk.errMsgCopyClerkGroupNoSelectionTitle'),
						bodyText: $translate.instant('basics.clerk.errMsgCopyClerkGroupNoSelection'),
						iconClass: 'ico-info'
					};
					return platformModalService.showDialog(modalOptions);
				}
			};

			service.updateOwnClerk = function updateOwnClerk() {
				var origin = serviceContainer.data.endUpdate;
				//change the url temp so users can update their own clerk without needing clerk permissions in general.
				serviceContainer.data.endUpdate = 'updateownclerk';
				try {
					return service.update().then(function (result) {
						serviceContainer.data.endUpdate = origin;
						return result;
					}, function () {
						serviceContainer.data.endUpdate = origin;
					});
				} catch (e) {
					serviceContainer.data.endUpdate = origin;
				}
			};

			return service;

		}]);
})(angular);

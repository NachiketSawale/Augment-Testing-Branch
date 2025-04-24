/**
 * Created by chi on 11/21/2017.
 */
(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businesspartnerContactPortalUserManagementService', businesspartnerContactPortalUserManagementService);

	businesspartnerContactPortalUserManagementService.$inject = ['$http', '$q', '_', '$translate', 'globals', 'moment', 'platformModalService', 'basicsCommonLoadingService', '$injector'];

	function businesspartnerContactPortalUserManagementService($http, $q, _, $translate, globals, moment, platformModalService, basicsCommonLoadingService, $injector) {
		let service = {};

		service.reactivateOrInactivatePortalUser = reactivateOrInactivatePortalUser;
		service.maintainingOrphanedPortalRequest = maintainingOrphanedPortalRequest;
		service.loadAndMapProviderInfo = loadAndMapProviderInfo;
		service.portalUserManagement = portalUserManagement;
		service.getAndMapProviderInfo = getAndMapProviderInfo;

		return service;

		// ////////////////////////////
		function reactivateOrInactivatePortalUser(dataService, uiStandard) {
			let defer = $q.defer();
			let selectedEntities = dataService.getSelectedEntities();
			let modalOptions = {
				headerTextKey: 'businesspartner.main.wizardReactivateOrInactivatePortalUserTitle',
				showOkButton: true,
				iconClass: 'ico-info',
				backdrop: false
			};

			selectedEntities = _.filter(selectedEntities, function (selected) {
				return selected.FrmUserExtProviderFk;
			});

			if (!selectedEntities || selectedEntities.length === 0) {
				modalOptions.bodyTextKey = 'businesspartner.main.wizardErrorNoContactSelected';
				platformModalService.showDialog(modalOptions);
				defer.resolve(false);
				return defer.promise;
			}

			let executeType = '1'; // 1: re-activate; 2: in-activate
			let countActive = 0; // count of the contacts which are active;
			let countAll = selectedEntities.length;
			_.forEach(selectedEntities, function (selected) {
				if (selected.State === 1) {
					countActive++;
				}
			});
			executeType = countActive === 0 || countActive < countAll - countActive ? '1' : '2';

			modalOptions.contacts = selectedEntities;
			modalOptions.gridLayout = uiStandard.getStandardConfigForListView();
			modalOptions.templateUrl = globals.appBaseUrl + 'businesspartner.contact/templates/portal-user-dialog.html';
			modalOptions.width = '1000px';
			modalOptions.windowClass = 'form-modal-dialog';
			modalOptions.executeType = executeType;
			modalOptions.executeFunction = function (contacts, executeType) {
				let contactIds = _.map(contacts, function (contact) {
					return contact.Id;
				});
				if (executeType === '1') {
					return $http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/reactivateportalusers', contactIds);
				} else if (executeType === '2') {
					return $http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/inactivateportalusers', contactIds);
				}
			};
			delete modalOptions.showOkButton;
			delete modalOptions.iconClass;
			platformModalService.showDialog(modalOptions).then(function (run) {
				defer.resolve(run);
			});

			return defer.promise;
		}

		function maintainingOrphanedPortalRequest() {
			basicsCommonLoadingService.show({info: $translate.instant('businesspartner.contact.info4RemoveOrphanedRecords')});
			$http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/removeorphanedrecords')
				.then(function (response) {
					let providers = response.data;
					if (!providers || !providers.length) {
						platformModalService.showMsgBox($translate.instant('businesspartner.contact.noOrphanedUserReqFound'), $translate.instant('businesspartner.contact.maintainingOrphanedPortalRequest'), 'ico-info');
					} else {
						platformModalService.showMsgBox($translate.instant('businesspartner.contact.orphanedUserReqFoundDeleted'), $translate.instant('businesspartner.contact.maintainingOrphanedPortalRequest'), 'ico-info');
					}
				})
				.finally(function () {
					basicsCommonLoadingService.hide();
				});
		}

		function loadAndMapProviderInfo(contacts, dataService) {
			let contactIds = _.map(contacts, function (contact) {
				return contact.Id;
			});
			getUserExternalProviderInfoVEntities(contactIds)
				.then(function (response) {
					let providers = response.data;
					_.forEach(contacts, function (contact) {
						let provider = _.find(providers, {contactId: contact.Id});
						mapDataToContact(contact, provider);
					});
					dataService.gridRefresh();
				});
		}

		function mapDataToContact(contact, providerInfo) {
			if (contact && providerInfo) {
				let addressInfo = [];
				contact.Provider = providerInfo.provider;
				contact.ProviderId = providerInfo.providerId;
				contact.ProviderFamilyName = providerInfo.familyName;
				contact.ProviderEmail = providerInfo.email;
				if (providerInfo.zipCode) {
					addressInfo.push(providerInfo.zipCode);
				}
				if (providerInfo.city) {
					addressInfo.push(providerInfo.city);
				}
				if (providerInfo.street) {
					addressInfo.push(providerInfo.street);
				}
				contact.ProviderAddress = addressInfo.join(',');
				contact.ProviderComment = providerInfo.comment;
				contact.PortalUserGroupName = providerInfo.portalUserGroupName;
				contact.LogonName = providerInfo.logonName;
				contact.IdentityProviderName = providerInfo.identityProviderName;
				contact.LastLogin = providerInfo.lastLogin ? moment.utc(providerInfo.lastLogin) : null;
				contact.State = providerInfo.state;
				contact.Statement = contact.State === 1 ? $translate.instant('businesspartner.contact.portalUserActiveState') : (contact.State === 2 ? $translate.instant('businesspartner.contact.portalUserInactiveState') : null);
				contact.SetInactiveDate = providerInfo.setinactivedate ? moment.utc(providerInfo.setinactivedate) : null;
				contact.PortalUserGroupFk = providerInfo.portalusergroupFk;
				contact.UserId = providerInfo.userId;

			}
		}

		// todo header missing
		// todo modalOptions multiple times, onyl one general and the set type specific the rest
		// always use === for equal checking
		function portalUserManagement(param, userParam) {

			let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

			let modalOptions = {
				templateUrl: globals.appBaseUrl + 'businesspartner.contact/templates/portal-user-management-dialog.html',
				headerText: $translate.instant('businesspartner.contact.portalUserManagement'),
				width: '500px',
				height: '650px',
				resizeable: true,
				contextType: userParam.ContextType, // bp, contact, user
				dataItem: null
			};

			return $http.post(globals.webApiBaseUrl + 'basics/customize/FrmPortalUserGroup/list', {})
				.then(function (response) {
						let frmPortalUserGroupObject = response.data;
						let frmPortalUserGroup = [];
						for (let k in frmPortalUserGroupObject) {
						if (Object.prototype.hasOwnProperty.call(frmPortalUserGroupObject, k)) {
							if (frmPortalUserGroupObject[k].Sorting !== 0) {
								frmPortalUserGroup.push({
									Id: frmPortalUserGroupObject[k].Id,
									Name: frmPortalUserGroupObject[k].Name,
									Sorting: frmPortalUserGroupObject[k].Sorting,
									IsDefault: frmPortalUserGroupObject[k].IsDefault
								});
							}
						}
					}
					frmPortalUserGroup = _.sortBy(frmPortalUserGroup, ['Sorting', 'Id']);

					function processItem(item) {
						item.BusinessPartnerName1 = item.BusinessPartnerName1 || '';
						item.FirstName = item.FirstName || '';
						item.FamilyName = item.FamilyName || '';
						item.FrmPortalUserGroup = frmPortalUserGroup;
					}

					function notAPortalUser() {
						platformModalService.showMsgBox('businesspartner.contact.notAPortalUser', 'businesspartner.contact.notAPortalUser', 'ico-info');
					}

					function noSelectContactItem() {
						platformModalService.showErrorBox('businesspartner.contact.selectAContact', 'Portal User Management');
					}

					function noSelectUserItem() {
						platformModalService.showErrorBox('usermanagement.user.wizards.noUserSelected', 'usermanagement.user.wizards.noUserSelected');
					}

					if (userParam.ContextType === 'bp') {
						let bpMainContactDataService = $injector.get('businesspartnerMainContactDataService');
						modalOptions.dataItem = bpMainContactDataService.getSelected();

						if (!modalOptions.dataItem) {
							return noSelectContactItem();
						}

						let bpMainHeaderDataService = $injector.get('businesspartnerMainHeaderDataService');
						let selectedParentItem = bpMainHeaderDataService.getSelected();

						if (modalOptions.dataItem.FrmUserExtProviderFk) {
							modalOptions.dataItem.BusinessPartnerName1 = selectedParentItem.BusinessPartnerName1;
							modalOptions.dataItem.Setinactivedate = modalOptions.dataItem.SetInactiveDate ? moment.utc(modalOptions.dataItem.Setinactivedate).format('YYYY-MM-D H:mm:ss') : null;
							processItem(modalOptions.dataItem);
							platformModalService.showDialog(modalOptions);
						} else {
							notAPortalUser();
						}
					} else if (userParam.ContextType === 'contact') {
						let bpContactDataService = $injector.get('businesspartnerContactDataService');

						modalOptions.dataItem = bpContactDataService.getSelected();
						if (!modalOptions.dataItem) {
							return noSelectContactItem();

						}

						if (modalOptions.dataItem.FrmUserExtProviderFk) {
							let BusinessPartner = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
							modalOptions.dataItem.BusinessPartnerName1 = BusinessPartner ? _.find(BusinessPartner, {Id: modalOptions.dataItem.BusinessPartnerFk}).BusinessPartnerName1 : '';

							$http.post(globals.webApiBaseUrl + 'usermanagement/main/user/list', {
								'filter': '',
								'Pattern': null,
								'PageSize': 100,
								'PageNumber': 0,
								'UseCurrentClient': null,
								'IncludeNonActiveItems': true,
								'ProjectContextId': null,
								'ExecutionHints': false,
								'PKeys': [modalOptions.dataItem.UserId]
							}
							).then(function (result) {
								if (result.data.dtos.length > 0) {
									modalOptions.dataItem.Setinactivedate = result.data.dtos[0].Setinactivedate;
									modalOptions.dataItem.User = result.data.dtos[0];
								}
								processItem(modalOptions.dataItem);
								platformModalService.showDialog(modalOptions);
							});
						} else {
							notAPortalUser();
						}
					} else if (userParam.ContextType === 'user') {
						let userMainService = $injector.get('usermanagementUserMainService');

						modalOptions.dataItem = userMainService.getSelected();
						if (!modalOptions.dataItem) {
							return noSelectUserItem();

						}
						modalOptions.dataItem.FrmPortalUserGroup = frmPortalUserGroup;
						let usermanagementPortalInvitationWizardService = $injector.get('usermanagementPortalInvitationWizardService');

						return usermanagementPortalInvitationWizardService.getContactwithBpdFromUserId(modalOptions.dataItem.Id).then(function (theData) {
							if (theData && !_.isNil(theData.userExtPrvdrInfo)) {

								mapDataToContact(modalOptions.dataItem, theData.userExtPrvdrInfo);
								modalOptions.dataItem.FrmUserExtProviderFk = theData.userExtPrvdrInfo.id;
								modalOptions.dataItem.BusinessPartnerName1 = theData.bpdFullName;
								modalOptions.dataItem.FamilyName = theData.contactFullName;
								processItem(modalOptions.dataItem);
								platformModalService.showDialog(modalOptions);

							} else {
								notAPortalUser();
							}
						});

					}
				}
				);
		}

		function getAndMapProviderInfo(contacts) {
			if (!angular.isArray(contacts) || contacts.length === 0) {
				return $q.when([]);
			}
			let contactIds = _.map(contacts, function (contact) {
				return contact.Id;
			});
			return getUserExternalProviderInfoVEntities(contactIds)
				.then(function (response) {
					let providers = response.data;
					_.forEach(contacts, function (contact) {
						let provider = _.find(providers, {contactId: contact.Id});
						mapDataToContact(contact, provider);
					});
					return contacts;
				});
		}

		function getUserExternalProviderInfoVEntities(contactIds) {
			return $http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/getuserexternalproviderinfoventities', contactIds);
		}
	}
})(angular);
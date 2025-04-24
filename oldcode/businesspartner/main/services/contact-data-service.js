/**
 * Created by zos on 12/19/2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainContactDataServiceNew
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 *
	 * @description Provide contact data service
	 */
	angular.module(moduleName).factory('businesspartnerMainContactDataService', [
		'$http', '_', '$injector', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService',
		'basicsLookupdataLookupFilterService', 'businessPartnerMainContactValidationService', 'platformRuntimeDataService', '$translate',
		'ServiceDataProcessDatesExtension', 'basicsCommonServiceUploadExtension', 'globals', 'platformPermissionService',
		'businesspartnerContactPortalUserManagementService', 'businesspartnerStatusRightService', 'platformModalService', 'PlatformMessenger',
		'businesspartnerMainSubsidiaryDataService', 'initApp', 'businessPartnerHelper',
		function ($http, _, $injector, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService,
		          basicsLookupdataLookupFilterService, businessPartnerMainContactValidationService, platformRuntimeDataService, $translate,
		          ServiceDataProcessDatesExtension, basicsCommonServiceUploadExtension, globals, platformPermissionService,
		          businesspartnerContactPortalUserManagementService, businesspartnerStatusRightService, platformModalService, PlatformMessenger, subsidiaryDataService, initAppService,
		          helperService) {

			var serviceOptions = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerMainContactDataService',
					dataProcessor: [{processItem: processItem}, new ServiceDataProcessDatesExtension(['BirthDate', 'LastLogin', 'SetInactiveDate'])],
					entityRole: {
						node: {
							itemName: 'Contact',
							parentService: businesspartnerMainHeaderDataService,
							doesRequireLoadAlways: platformPermissionService.hasRead('73b6280b180149a09f3a97f142bfc3dc')
						}
					},
					httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/contact/', endCreate: 'createcontact'},
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/',
						endRead: 'listbybusinesspartnerid',
						usePostForRead: true,
						initReadData: initReadData,
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead,
							initCreationData: function (creationData, svcData, creationOptions) {
								creationData.mainItemId = businesspartnerMainHeaderDataService.getIfSelectedIdElse(-1);
								copyTeleInfo(creationData);
								_.assign(creationData, creationOptions);
								serviceContainer.service.filterBtnDisabled = true;
							},
							handleCreateSucceeded: handleCreateSucceeded
						}
					}

				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			let contactList = [];
			let filterList = [];
			let filtereBranchLoad = false;
			let is4Procurement = false;
			serviceContainer.service.filterBranchValue = false;
			serviceContainer.service.defaultContactOption = null;
			let extParams = null;
			let isFromInquiry = false;

			function getExtension() {
				return '*.vcf';
			}

			var uploadOptions = {
				uploadServiceKey: 'business-partner-contact',
				uploadConfigs: {action: 'Import', SectionType: 'Contact'},
				getExtension: getExtension
			};

			basicsCommonServiceUploadExtension.extendForCustom(serviceContainer.service, uploadOptions);

			serviceContainer.service.disablePrev = function () {
				return canContactNavigate();
			};

			serviceContainer.service.disableNext = function () {
				return canContactNavigate('forward');
			};

			serviceContainer.service.getSelectChangeMsg = function () {
				return serviceContainer.data.selectionChanged;
			};

			serviceContainer.service.incorporateDataRead = function (readData) {
				incorporateDataRead(readData, serviceContainer.data);
			};

			serviceContainer.service.getItemStatus = function () {
				return businesspartnerMainHeaderDataService.getItemStatus();
			};

			serviceContainer.service.clickBtnFilterByBranch = function (isCheck) {
				if (isFromInquiry) {
					serviceContainer.service.filterBranchValue = true;
				} else {
					serviceContainer.service.filterBranchValue = isCheck
					filterByBranch();
				}
			}

			serviceContainer.service.filterByBranch = filterByBranch;
			serviceContainer.service.checkDefaultContact = checkDefaultContact;
			function filterByBranch(selectEntity) {
				if (contactList.length > 0) {
					const selected = selectEntity ? selectEntity : subsidiaryDataService.getSelected();
					if (serviceContainer.service.filterBranchValue && selected) {
						filterList = contactList.filter(x => x.SubsidiaryFk === selected.Id);
						filtereBranchLoad = true;
						serviceContainer.service.load();
					} else {
						if (contactList.length > serviceContainer.data.getList().length) {
							filterList = contactList;
							filtereBranchLoad = true;
							serviceContainer.service.load();
						}
					}
				}
			}

			function canContactNavigate(type) {
				type = type || 'backward';
				var select = serviceContainer.service.getSelected();
				var list = serviceContainer.service.getList();
				if (!select || !select.Id || list <= 0) {
					return false;
				}
				var index = type === 'forward' ? list.length - 1 : 0;
				return select === list[index];
			}

			initialize(serviceContainer.service);

			var canCreate = serviceContainer.service.canCreate;
			serviceContainer.service.canCreate = function () {
				return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
			};

			var canDelete = serviceContainer.service.canDelete;
			serviceContainer.service.canDelete = function () {
				return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
			};

			serviceContainer.service.canCopy = function () {
				return serviceContainer.service.getSelected() && serviceContainer.service.canCreate();
			};
			serviceContainer.service.loadedPhoto = false;
			serviceContainer.service.loadedClerkQty = 0;
			serviceContainer.service.finishLoadingEvent = new PlatformMessenger();
			serviceContainer.service.copyPaste = function () {
				var dto = serviceContainer.service.getSelected();
				var list = serviceContainer.service.getList();
				var contactPhotoService = $injector.get('businesspartnerMainContactPhotoDataService');
				var bascisCommonClerkDataServiceFactory = $injector.get('bascisCommonClerkDataServiceFactory');
				var contactClerkService = bascisCommonClerkDataServiceFactory.getService('businesspartner.contact.clerk', 'businesspartnerMainContactDataService', null, true, 'businesspartnerMainContactClerkExtendDataService');
				var existList = _.filter(list, {FirstName: dto.FirstName, FamilyName: dto.FamilyName});
				var roleIds = _.map(existList, 'ContactRoleFk');
				// var maxContactRoleId = _.max(roleIds);
				var sourcePhoto = contactPhotoService.getList()[0];
				if (sourcePhoto) {
					serviceContainer.service.loadedPhoto = true;
				} else {
					serviceContainer.service.loadedPhoto = false;
				}
				var contactClerkList = angular.copy(contactClerkService.getList());
				serviceContainer.service.loadedClerkQty = contactClerkList.length;
				var paramDto = {
					ContactDto: dto,
					RoleIds: roleIds,
					LoadedPhoto: serviceContainer.service.loadedPhoto,
					LoadedClerkQty: serviceContainer.service.loadedClerkQty
				};
				$http.post(globals.webApiBaseUrl + 'businesspartner/contact/deepcopy', paramDto)
					.then(function (response) {
							if (response.data.Contact) {
								var newContact = response.data.Contact;
								var photo = response.data.ContactPhoto;
								var clerkIds = response.data.ContactClerkIds;
								var photos = [];
								serviceContainer.data.onCreateSucceeded(newContact, serviceContainer.data);
								if (photo && serviceContainer.service.loadedPhoto) {
									photos.push(photo);
									contactPhotoService.setList(photos);
									contactPhotoService.storeCacheForCopy(newContact);
								}
								if (clerkIds && serviceContainer.service.loadedClerkQty > 0) {
									var newClerks = angular.copy(contactClerkList);
									var i = 0;
									_.forEach(newClerks, function (item) {
										item.Id = clerkIds[i];
										item.Version = 0;
										item.MainItemId = newContact.Id;
										item.MainItemFk = newContact.Id;
										i++;
									});
									contactClerkService.setList(newClerks);
									contactClerkService.storeCacheForCopy(newContact);
								}
								if (response.data.ContactPhoto && serviceContainer.service.loadedPhoto) {
									photo.Blob.Content = sourcePhoto.Blob.Content;
								}
							} else {
								platformModalService.showMsgBox('businesspartner.main.errorMessage.failedCopyContact', 'businesspartner.main.failedCopyContactTitle', 'warning');
							}
							serviceContainer.service.finishLoadingEvent.fire();
						},
						function (/* error */) {
							serviceContainer.service.finishLoadingEvent.fire();
						}
					);
			};

			serviceContainer.service.setDataReadOnly = setDataReadOnly;

			serviceContainer.service.getExtParams = getExtParams;

			serviceContainer.service.deleteEntities = function () {
				var entities = serviceContainer.service.getSelectedEntities(serviceContainer.data);
				if (entities.length > 0) {
					serviceContainer.service.filterBtnDisabled = true
					const differenceList = _.difference(serviceContainer.service.getList(), entities);
					if (differenceList.length > 0 && differenceList.length === contactList.length) {
						serviceContainer.service.filterBtnDisabled = !sortedIdsAreEqual(differenceList, contactList);
					}
					var contactIds = [];
					_.forEach(entities, function (entity) {
						contactIds.push(entity.Id);
					});

					$http.post(globals.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/listbymainitemids', contactIds).then(function (response) {
						if (response.data.length > 1) {
							var entitiesCanDelete = [];
							var entitiesCantDelete = [];
							var selectedBP = businesspartnerMainHeaderDataService.getSelected();

							_.forEach(entities, function (entity) {
								var bpAssignments = [];
								for (var i = 0; i < response.data.length; ++i) {
									if (response.data[i].ContactFk === entity.Id) {
										bpAssignments.push(response.data[i]);
									}
								}

								if (bpAssignments.length > 1) {
									_.forEach(bpAssignments, function (bpAssignment) {
										if (bpAssignment.BusinessPartnerFk === selectedBP.Id) {
											if (bpAssignment.IsMain === true) {
												entitiesCantDelete.push(entity);
											} else {
												entitiesCanDelete.push((entity));
											}
										}
									});
								} else {
									entitiesCanDelete.push((entity));
								}
							});

							if (entitiesCantDelete.length > 0) {
								var errMsg = $translate.instant('businesspartner.main.contact.deleteError');
								platformModalService.showErrorBox(errMsg, 'cloud.common.errorMessage');
							}

							if (entitiesCanDelete.length > 0) {
								serviceContainer.data.deleteEntities(entitiesCanDelete, serviceContainer.data);
							}
						} else {
							serviceContainer.data.deleteEntities(entities, serviceContainer.data);
						}
					});
				}
			};

			return serviceContainer.service;

			// ///////////////////////////////
			function incorporateDataRead(readData, data) {
				contactList = _.cloneDeep(readData.Main);

				if (isFromInquiry && !filtereBranchLoad && readData.Main.length > 0) {
					let selected = subsidiaryDataService.getSelected();
					if (!selected) {
						const entities = subsidiaryDataService.getSelectedEntities();
						if (entities && entities.length > 0) {
							selected = entities[0];
						}
					}

					let subsidaryId = selected ? selected.Id : null;
					if (subsidaryId) {
						readData.Main = _.filter(readData.Main, {SubsidiaryFk: subsidaryId});
					}else{
						readData.Main = []
					}
					filterList = [];
				}

				serviceContainer.service.filterBtnDisabled = contactList.length <= 0;
				if (filtereBranchLoad) {
					readData.Main = filterList;
					filterList = [];
					filtereBranchLoad = false;
				}
				var status = businesspartnerMainHeaderDataService.getItemStatus();
				if (status.IsReadonly === true) {
					businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
				}

				basicsLookupdataLookupDescriptorService.attachData(readData);

				businesspartnerContactPortalUserManagementService.loadAndMapProviderInfo(readData.Main, serviceContainer.service);
				var ret = data.handleReadSucceeded(readData.Main, data);
				var list = serviceContainer.service.getList();
				const branchFk = subsidiaryDataService.getSelected()?.Id;
				if (businesspartnerMainHeaderDataService.isBaseLine && !checkDefaultContact()) {
					serviceContainer.service.setSelected(null);
				} else {
					var found = is4Procurement ? helperService.getDefaultContactByByConditionKey(list, branchFk, 'IsProcurement') : _.find(list, {IsDefault: true});
					if (found) {
						// go to default
						serviceContainer.service.setSelected(found);
					} else {
						serviceContainer.service.goToFirst();
					}
				}
				return ret;
			}

			function processItem(item) {
				if (item) {
					var validationService = businessPartnerMainContactValidationService(serviceContainer.service);
					var result = validationService.validateCompanyFk(item, item.CompanyFk, 'CompanyFk');
					platformRuntimeDataService.applyValidationResult(result, item, 'CompanyFk');

					var subsidiaries = basicsLookupdataLookupDescriptorService.getData('Subsidiary') || {};
					item.SubsidiaryDescriptor = subsidiaries[item.SubsidiaryFk];
				}
			}

			function handleCreateSucceeded(newItem) {
				processIsDefault(newItem);
			}

			function processIsDefault(item) {
				var dataService = serviceContainer.service;
				if (!item.IsDefault) {
					var allContacts = dataService.getList();
					var foundItem = _.find(allContacts, function (item) {
						return item.IsDefault;
					});
					if (!foundItem) {
						item.IsDefault = true;
						dataService.markItemAsModified(foundItem);
						dataService.gridRefresh();
					}
				}
			}

			// noinspection JSUnusedLocalSymbols
			function onEntityCreated(e, newEntity) {

				if (newEntity && newEntity.Id && newEntity.SubsidiaryFk === null) {
					var select = businesspartnerMainHeaderDataService.getSelected() || {};
					newEntity.SubsidiaryDescriptor = select.SubsidiaryDescriptor;
					newEntity.SubsidiaryFk = select.SubsidiaryDescriptor.Id;
				}

				var result = basicsLookupdataLookupDescriptorService.provideLookupData(newEntity, {
					collect: function (prop) { /* jshint -W074 */
						var result = true;
						// basicsLookupdataLookupDescriptorService will take string from property name except 'Fk' as lookup type name by default,
						// if it is not the right lookup type name, please use convert to return right name.
						switch (prop) {
							case 'BusinessPartnerFk':
							case 'TelephoneNumberFk':
							case 'TelephoneNumber2Fk':
							case 'TelephoneNumberTelefaxFk':
							case 'TelephoneNumberMobilFk':
							case 'AddressFk':
							case 'TelephonePrivatFk':
							case 'ContactAbcFk':
							case 'ContactOriginFk':
							case 'ContactTimelinessFk':
							case 'ContactRoleFk':
							case 'TitleFk':
							case 'CountryFk':
							case 'EncryptionTypeFk':
							case 'BasLanguageFk':
								result = false;
								break;
							case 'ClerkResponsibleFk':
								result = 'clerk';
								break;
							default:
								break;
						}
						return result;
					}
				});
				if (!result.dataReady) {
					result.dataPromise.then(function () {
						serviceContainer.service.gridRefresh();
					});
				}
			}

			function initialize(service) {
				var filters = [
					{
						key: 'contact-subsidiary-filter',
						serverSide: true,
						serverKey: 'contact-subsidiary-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem ? currentItem.BusinessPartnerFk : null
							};
						}
					}];
				basicsLookupdataLookupFilterService.registerFilter(filters);
				service.name = 'businesspartner.contact';

				/**
				 * provide lookup data item to lookup formatter after creating new item.
				 */
				service.registerEntityCreated(onEntityCreated);

				service.loadSubItemsList = function () {
					serviceContainer.data.doesRequireLoadAlways = true;// Baf. Otherwise the service.loadSubItemList will not work correctly.
					serviceContainer.data.loadSubItemList.apply(this, arguments);
					serviceContainer.data.doesRequireLoadAlways = false;
				};
				serviceContainer.service.changeFilterbtnValueMessenger = new PlatformMessenger();
				service.adjustClerkLayout = adjustClerkLayout;
				businesspartnerMainHeaderDataService.filterBranchBtnDisable.register(updateFilterBranchBtnDisable);
				businesspartnerMainHeaderDataService.registerSelectionChanged(changeFilterBranchValue);

			}

			function copyTeleInfo(creationData) {
				var teleInfo = null;
				var selectedItem = businesspartnerMainHeaderDataService.getSelected();

				if (!!selectedItem && !!selectedItem.SubsidiaryDescriptor) {
					teleInfo = selectedItem.SubsidiaryDescriptor.TelephoneNumberTelefaxDto ? selectedItem.SubsidiaryDescriptor.TelephoneNumberTelefaxDto : null;
					if (teleInfo !== null) {
						creationData.FaxDto = {};
						creationData.FaxDto.CountryId = teleInfo.CountryFk;
						creationData.FaxDto.Pattern = teleInfo.Telephone;
						creationData.FaxDto.CommentText = teleInfo.CommentText;
					}

					teleInfo = selectedItem.SubsidiaryDescriptor.TelephoneNumber1Dto ? selectedItem.SubsidiaryDescriptor.TelephoneNumber1Dto : null;
					if (teleInfo !== null) {
						creationData.PhoneDto = {};
						creationData.PhoneDto.CountryId = teleInfo.CountryFk;
						creationData.PhoneDto.Pattern = teleInfo.Telephone;
						creationData.PhoneDto.CommentText = teleInfo.CommentText;
					}
				}
			}

			function adjustClerkLayout(clerkLayout) {
				clerkLayout.addition = {
					grid: [
						{
							id: 'companyCode',
							field: 'CompanyFk',
							name: 'Company Code',
							name$tr$: 'cloud.common.entityCompanyCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Company',
								displayMember: 'Code'
							}
						},
						{
							id: 'companyName',
							field: 'CompanyFk',
							name: 'Company Name',
							name$tr$: 'cloud.common.entityCompanyName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Company',
								displayMember: 'CompanyName'
							}
						},
						{
							lookupDisplayColumn: true,
							field: 'ClerkFk',
							name: 'First Name',
							name$tr$: 'basics.clerk.entityFirstName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'FirstName'
							}
						},
						{
							lookupDisplayColumn: true,
							field: 'ClerkFk',
							name: 'Family Name',
							name$tr$: 'basics.clerk.entityFamilyName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'FamilyName'
							}
						},
						{
							lookupDisplayColumn: true,
							field: 'ClerkFk',
							name: 'Department',
							name$tr$: 'cloud.common.entityDepartment',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Department'
							}
						}
					],
					detail: [
						{
							readonly: true,
							id: 'company',
							gid: 'basicData',
							rid: 'company',
							model: 'CompanyFk',
							label: 'Company',
							label$tr$: 'cloud.common.entityCompany',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'ClerkFk',
							label: 'First Name',
							label$tr$: 'basics.clerk.entityFirstName',
							type: 'directive',
							directive: 'cloud-clerk-clerk-dialog-without-teams',
							options: {
								displayMember: 'FirstName'
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'ClerkFk',
							label: 'Family Name',
							label$tr$: 'basics.clerk.entityFamilyName',
							type: 'directive',
							directive: 'cloud-clerk-clerk-dialog-without-teams',
							options: {
								displayMember: 'FamilyName'
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'ClerkFk',
							label: 'Department',
							label$tr$: 'cloud.common.entityDepartment',
							type: 'directive',
							directive: 'cloud-clerk-clerk-dialog-without-teams',
							options: {
								displayMember: 'Department'
							}
						}
					]
				};
			}

			function setDataReadOnly(data) {
				var businesspartnerStatusRightService = $injector.get('businesspartnerStatusRightService');
				businesspartnerStatusRightService.setListDataReadonly(data, true);
			}

			function updateFilterBranchBtnDisable() {
				serviceContainer.service.filterBtnDisabled = false;
			}

			function changeFilterBranchValue() {
				if (isFromInquiry) {
					serviceContainer.service.filterBranchValue = true;
				} else {
					serviceContainer.service.filterBranchValue = false;
				}
				serviceContainer.service.changeFilterbtnValueMessenger.fire();
			}

			function sortedIdsAreEqual(listA, listB) {
				const ids1 = _.map(listA, 'Id').sort((a, b) => a - b);
				const ids2 = _.map(listB, 'Id').sort((a, b) => a - b);
				return _.isEqual(ids1, ids2);
			}

			function getExtParams() {
				extParams = null;
				isFromInquiry = false;
				const appStartupInfo = initAppService.getStartupInfo();
				if (appStartupInfo && appStartupInfo.navInfo && appStartupInfo.navInfo.extparams) {
					extParams = JSON.parse(appStartupInfo.navInfo.extparams);
					if (extParams.hasOwnProperty('subsidiaryFk')) {
						isFromInquiry = true;
						serviceContainer.service.filterBranchValue = true;
					}
				}
				return extParams;
			}

			function initReadData(readData) {
				readData.Value = businesspartnerMainHeaderDataService.getIfSelectedIdElse(-1);

				const json = getExtParams();
				if (json && json.hasOwnProperty('is4Procurement')) {
					is4Procurement = json.is4Procurement;
				}
			}

			function checkDefaultContact() {
				if (serviceContainer.service.defaultContactOption === null) {
					const systemOptionDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
					if (!systemOptionDataService) {
						return false;
					}
					const systemOptions = systemOptionDataService.getList();
					if (!systemOptions || systemOptions.length === 0) {
						return false;
					}
					const optionWithValue = _.find(systemOptions, {Id: 10116});
					serviceContainer.service.defaultContactOption = optionWithValue && (optionWithValue.ParameterValue === '1' || optionWithValue.ParameterValue === 'true');
				}
				return serviceContainer.service.defaultContactOption;
			}
		}
	]);
})(angular);
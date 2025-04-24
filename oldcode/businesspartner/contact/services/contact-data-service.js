/**
 * Created by zos on 12/19/2014.
 */
(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name businesspartnerContactDataService
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 * @description
	 *
	 * Data service for businesspartner contact 'contact' grid/form controller
	 */
	angular.module(moduleName).factory('businesspartnerContactDataService', [
		'$http', '$q', '_', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
		'businessPartnerContactValidationService', 'platformRuntimeDataService', 'ServiceDataProcessDatesExtension', 'platformModalService',
		'basicsCommonServiceUploadExtension', 'globals', 'businesspartnerContactPortalUserManagementService', '$injector', 'PlatformMessenger',
		function ($http, $q, _, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService,
			businessPartnerContactValidationService, platformRuntimeDataService, ServiceDataProcessDatesExtension, platformModalService,
			basicsCommonServiceUploadExtension, globals, businesspartnerContactPortalUserManagementService, $injector, PlatformMessenger) {

			let serviceOptions = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerContactDataService',
					dataProcessor: [{processItem: processItem}, new ServiceDataProcessDatesExtension(['BirthDate', 'LastLogin', 'SetInactiveDate'])],
					entityRole: {
						root: {
							itemName: 'Contacts', codeField: 'FirstName', descField: 'Remark', moduleName: 'cloud.desktop.moduleDisplayNameContact',
							handleUpdateDone: function (updateData, response, data) {
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								if (response.Contacts && response.Contacts.length >= 1) {
									_.forEach(response.Contacts, function (item) {
										let defaultItem = _.find(service.getList(), {Id: item.Id});
										if (defaultItem && (defaultItem.IsDefault !== item.IsDefault || defaultItem.Version !== item.Version)) {
											defaultItem.IsDefault = item.IsDefault;
											defaultItem.Version = item.Version;
										}
									});
									service.gridRefresh();
								}

								if (response.BusinessPartnerAssignmentToSave) {
									let bRefresh = false;
									for (let i = 0; i < response.BusinessPartnerAssignmentToSave.length; ++i) {
										if (response.BusinessPartnerAssignmentToSave[i].IsMain === true) {
											bRefresh = true;
											break;
										}
									}

									if (bRefresh) {
										let bpAssignmentDataService = $injector.get('businesspartnerContact2BpAssignmentDataService');
										bpAssignmentDataService.load();
									}
								}
							},
							useIdentification: true
						}
					},
					entitySelection: {
						supportsMultiSelection: true
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/',
						endRead: 'listcontact',
						usePostForRead: true
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/',
						endCreate: 'createcontact'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/',
						endDelete: 'deletecontact'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/',
						endUpdate: 'updatecontact'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead,
							initCreationData: initCreationData
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,  // required for filter initialization
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							orderBy: [{Field: 'FirstName'}],
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: false,
							enhancedSearchVersion: '2.0',
							includeDateSearch: true
						}
					},
					sidebarWatchList: {active: true} // enable watchlist for this module
				}
			};

			// eslint-disable-next-line no-unused-vars
			function initCreationData(creationData) {

			}

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = serviceContainer.service;
			function getExtension() {
				return '*.vcf';
			}

			let uploadOptions = {
				uploadServiceKey: 'business-partner-contact',
				uploadConfigs: {action: 'Import', SectionType: 'Contact'},
				getExtension: getExtension
			};

			basicsCommonServiceUploadExtension.extendForCustom(service, uploadOptions);

			service.convertLookupDto = function (lookupDto) {
				if (_.isNumber(lookupDto.Id)) {
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'businesspartner/contact/getbyid?id=' + lookupDto.Id).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				}
			};

			// Pep: Templatory solution for creating new item by custom creation data, it is better implemented in the base class.
			service.createItemSimple = function createItem(creationOptions, customCreationData, onCreateSucceeded) {
				let data = serviceContainer.data;
				let creationData = _.merge(data.doPrepareCreate(data, creationOptions), customCreationData);
				return data.doCallHTTPCreate(creationData, data, onCreateSucceeded);
			};

			service.updateSimple = function (updateData) {
				return serviceContainer.data.doCallHTTPUpdate(updateData, serviceContainer.data);
			};

			service.disablePrev = function () {
				return canContactNavigate();
			};

			service.disableNext = function () {
				return canContactNavigate('forward');
			};

			let originalDeleteItem = serviceContainer.data.deleteItem;
			serviceContainer.data.deleteItem = function () {
				let entity = service.getSelected();
				if(entity){
					$http.get(globals.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/list?mainItemId=' + entity.Id).then(function (response) {
						if(response.data.length > 1){
							platformModalService.showErrorBox('businesspartner.main.contact.deleteError', 'cloud.common.errorMessage');
						}
						else {
							originalDeleteItem(entity, serviceContainer.data);
						}
					});
				}
			};

			function registerNavi() {
				let businessPartnerHelper = $injector.get('businessPartnerHelper');
				businessPartnerHelper.registerNavigation(serviceContainer.data.httpReadRoute, {
					moduleName: moduleName,
					getNavData: function getNavData(item, triggerField) {
						if ((triggerField === 'FirstName' || triggerField === 'FamilyName') && item[triggerField]) {
							return item.Id;
						}
						if (angular.isDefined(item[triggerField])) {
							return item[triggerField] !== null ? item[triggerField] : -1;
						}

						if (angular.isNumber(item) || angular.isString(item) || angular.isArray(item)) {
							return item;
						}

						throw new Error('The property business partner is not recognized.');
					}
				});
			}
			serviceContainer.service.registerNavi = registerNavi;

			service.subsidiaryChanged = new PlatformMessenger();
			service.contactRoleChanged = new PlatformMessenger();
			service.subsidiaryChanged.register(SyncBpAssignmentFields);
			service.contactRoleChanged.register(SyncBpAssignmentFields);

			function SyncBpAssignmentFields(args){
				let bpAssignmentDataService = $injector.get('businesspartnerContact2BpAssignmentDataService');
				let bpAssignments = bpAssignmentDataService.getList();
				if(bpAssignments && bpAssignments.length > 0){
					let bpAssignment = _.find(bpAssignments, {IsMain: true});
					if(bpAssignment && bpAssignment[args.field] !== args.value){
						bpAssignment[args.field] = args.value;
						bpAssignmentDataService.markItemAsModified(bpAssignment);
						bpAssignmentDataService.gridRefresh();
					}

				}
			}

			function canContactNavigate(type) {
				type = type || 'backward';
				let select = service.getSelected();
				let list = service.getList();
				if (!select || !select.Id || list <= 0) {
					return false;
				}
				let index = type === 'forward' ? list.length - 1 : 0;
				return select === list[index];
			}

			initialize(service);

			return service;

			function incorporateDataRead(readData, data) {
				basicsLookupdataLookupDescriptorService.attachData(readData);

				let items = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};

				businesspartnerContactPortalUserManagementService.loadAndMapProviderInfo(readData.Main, service);

				return data.handleReadSucceeded(items, data);
			}

			function processItem(item) {
				if (item) {
					let validationService = businessPartnerContactValidationService(service);
					let result = validationService.validateCompanyFk(item, item.CompanyFk, 'CompanyFk');
					platformRuntimeDataService.applyValidationResult(result, item, 'CompanyFk');

					let subsidiaries = basicsLookupdataLookupDescriptorService.getData('Subsidiary') || {};
					item.SubsidiaryDescriptor = subsidiaries[item.SubsidiaryFk];
				}
			}

			// noinspection JSUnusedLocalSymbols
			function onEntityCreated(e, newEntity) {
				let result = basicsLookupdataLookupDescriptorService.provideLookupData(newEntity, {
					collect: function (prop) { /* jshint -W074 */
						let result = true;
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
						service.gridRefresh();
					});
				}
			}

			function initialize(service) {
				let filters = [
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
			}
		}
	]);
})(angular);
/**
 * Created by zos on 12/25/2014.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	/**
     * @ngdoc service
     * @name businesspartner.main.businesspartnerMainActivityDataServiceNew
     * @function
     *
     * @description Provide activity data service
     */
	angular.module(moduleName).factory('businesspartnerMainActivityDataServiceFactory',
		['_', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', '$injector',
			'businesspartnerMainActivityValidationService', 'platformRuntimeDataService', 'businessPartnerHelper',
			'ServiceDataProcessDatesExtension', 'moment', 'globals', 'basicsCommonServiceUploadExtension', '$http', 'PlatformMessenger',
			'businesspartnerStatusRightService', 'basicsLookupdataLookupFilterService', 'platformContextService', '$q',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (_, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, $injector,
				businesspartnerMainActivityValidationService, platformRuntimeDataService, businessPartnerHelper,
				ServiceDataProcessDatesExtension, moment, globals, basicsCommonServiceUploadExtension, $http, PlatformMessenger,
				businesspartnerStatusRightService, basicsLookupdataLookupFilterService, platformContextService, $q) {

				var factoryService = {};
				factoryService.createService = function (options) {
					let service = {};

					const parentService = $injector.get(options.parentService);

					var serviceOptions = {
						flatLeafItem: {
							module: angular.module(options.moduleName),
							serviceName: options.serviceName,
							dataProcessor: [{processItem: processItem}, new ServiceDataProcessDatesExtension(['ActivityDate', 'DocumentDate', 'FromDate', 'ReminderStartDate', 'ReminderEndDate'])],
							entityRole: {
								leaf: {
									itemName: 'Activity',
									parentService: parentService
								}
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/main/activity/',
								endCreate: 'create'
							},
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/main/activity/',
								endRead: 'listByParent',
								usePostForRead: true,
								initReadData: initReadData
							},
							presenter: {
								list: {
									incorporateDataRead: incorporateDataRead,
									initCreationData: initCreationData
								}
							}
						}
					};

					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
					var validator = businesspartnerMainActivityValidationService(serviceContainer.service);
					service = serviceContainer.service;

					initialize();

					var canCreate = serviceContainer.service.canCreate;
					serviceContainer.service.canCreate = function () {
						return canCreate() && !options.isReadonlyFn();
					};

					var canDelete = serviceContainer.service.canDelete;
					serviceContainer.service.canDelete = function () {
						let companyId = platformContextService.getContext().clientId;
						let item = serviceContainer.service.getSelected();
						if (item && item.CompanyFk !== companyId) {
							return false;
						}
						return canDelete() && !options.isReadonlyFn();
					};

					var canUploadFiles = serviceContainer.service.basicCanUploadFiles;
					serviceContainer.service.canUploadFiles = function () {
						return canUploadFiles() && !options.isReadonlyFn();
					};

					var canMultipleUploadFiles = serviceContainer.service.basicCanMultipleUploadFiles;
					serviceContainer.service.canMultipleUploadFiles = function () {
						return canMultipleUploadFiles() && !options.isReadonlyFn();
					};

					var canDownloadFiles = serviceContainer.service.basicCanDownloadFiles;
					serviceContainer.service.canDownloadFiles = function () {
						return canDownloadFiles() && !options.isReadonlyFn();
					};

					var canCancelUploadFiles = serviceContainer.service.basicCanCancelUploadFiles;
					serviceContainer.service.canCancelUploadFiles = function () {
						return canCancelUploadFiles() && !options.isReadonlyFn();
					};

					return serviceContainer.service;

					function incorporateDataRead(readData, data) {
						if (options.isReadonlyFn()) {
							businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
						}

						basicsLookupdataLookupDescriptorService.attachData(readData);

						return data.handleReadSucceeded(readData.Main, data);
					}

					function initReadData(readData) {
						let header = parentService.getSelected();
						readData.PKey1 = header ? options.pKey1Fn(header) : null;
					}

					function initCreationData(creationData) {
						let header = parentService.getSelected();
						creationData.PKey1 = options.pKey1Fn(header);
					}

					function processItem(item) {
						if (item) {
							let companyId = platformContextService.getContext().clientId;
							if (item.CompanyFk && item.CompanyFk !== companyId) {
								platformRuntimeDataService.readonly(item, true);
							} else {
								service.updateReadOnly(item);
							}

							var result = validator.validateActivityTypeFk(item, item.ActivityTypeFk, 'ActivityTypeFk');
							platformRuntimeDataService.applyValidationResult(result, item, 'ActivityTypeFk');
						}
					}

					function initialize() {
						var service = serviceContainer.service;
						const serviceName = service.getServiceName();
						var uploadOptions = {
							uploadServiceKey: (serviceName ?? 'businesspartner-main') + '-activity',
							uploadConfigs: {
								SectionType: 'BusinessPartnerActivity',
								createForUploadFileRoute: 'businesspartner/main/activity/createforuploadfile',
							},
							canPreview: true
						};

						basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

						service.fillReadonlyModels = fillReadonlyModels;

						/**
                         * provide lookup data item to lookup formatter after creating new item.
                         */
						service.registerEntityCreated(onEntityCreated);
						service.registerSelectionChanged(onSelectionChanged);

						service.getBlobs = getBlobs;
						service.blobLoaded = new PlatformMessenger();

						function fillReadonlyModels(configuration) {
							var service = serviceContainer.service;
							service.unregisterSelectionChanged(onSetReadonly);
							businessPartnerHelper.fillReadonlyModels(configuration, service);
							service.registerSelectionChanged(onSetReadonly);
						}

						service.updateReadOnly = function updateReadOnly(entity) {
							platformRuntimeDataService.readonly(entity, [{
								field: 'DocumentTypeFk',
								readonly: !!entity.FileArchiveDocFk
							}]);
						};

						service.setCurrentDocItemFileInfoCustomize = function setCurrentDocItemFileInfoCustomize(currItem, data) {
							let fileName = data.fileName;
							if (angular.isString(fileName) && fileName.length > 42) {
								fileName = fileName.substr(0, 42);
							}
							currItem.DocumentName = fileName;
						};

						function onSetReadonly() {
							var service = serviceContainer.service;
							var currentItem = service.getSelected();
							if (!currentItem || !currentItem.Id) {
								return;
							}

							var fields = _.map(service.canReadonlyModels, function (model) {
								var editable = true;
								if (model === 'UpdatedAt' || model === 'InsertedAt' || model.indexOf('__rt$data.history') >= 0) {
									editable = false;
								} else if (model === 'DocumentTypeFk') {
									editable = getCellEditable(currentItem, model);
								}

								return {
									field: model,
									readonly: !editable
								};
							});
							platformRuntimeDataService.readonly(currentItem, fields);
						}

						function getCellEditable(currentItem, field) {
							switch (field) {
								case 'DocumentTypeFk':
									return currentItem.FileArchiveDocFk === null;
								default:
									return true;
							}
						}

						// noinspection JSUnusedLocalSymbols
						function onEntityCreated(e, newEntity) {
							var result = basicsLookupdataLookupDescriptorService.provideLookupData(newEntity, {
								collect: function (prop) {
									var result = true;
									// basicsLookupdataLookupDescriptorService will take string from property name except 'Fk' as lookup type name by default,
									// if it is not the right lookup type name, please use convert to return right name.
									switch (prop) {
										case 'ActivityTypeFk':
										case 'BusinessPartnerFk':
										case 'FileArchiveDocFk':
										case 'CompanyResponsibleFk':
											result = false;
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

						var filters = [
							{
								key: 'business-partner-contact-filter-for-activity',
								serverSide: true,
								serverKey: 'business-partner-contact-filter-by-simple-business-partner',
								fn: function (entity) {
									return {
										BusinessPartnerFk: entity.BusinessPartnerFk
									};
								}
							},
							{
								key: 'business-partner-activity-responsible-company-filter',
								serverSide: true,
								serverKey: 'business-partner-activity-responsible-company-filter',
								fn: function () {
									var select = service.getSelected();
									if (select && angular.isDefined(select.Id)) {
										return 'Id=' + select.CompanyFk;
									}
									return 'Id=-1';
								}
							}
						];
						basicsLookupdataLookupFilterService.registerFilter(filters);

						function getBlobStringById(blobId) {
							return $http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + blobId)
								.then(function (response) {
									if (!response || !response.data) {
										return null;
									}
									return response.data;
								});
						}

						function getBlobs() {
							let activity = service.getSelected();
							if (!activity) {
								return $q.when(null);
							}
							if (activity.BlobsFk) {
								if (!activity.TextBlob) {
									return getBlobStringById(activity.BlobsFk)
										.then(function (blob) {
											if (blob) {
												activity.TextBlob = blob;
											} else {
												activity.TextBlob = createTextObject();
												activity.TextBlob.Id = activity.BlobsFk;
											}
											return activity;
										});
								}
							} else if (!activity.TextBlob) {
								activity.TextBlob = createTextObject();
							}

							return $q.when(activity);
						}

						function createTextObject() {
							return {
								Id: 0,
								Content: '',
								Version: 0
							};
						}

						function onSelectionChanged() {
							getBlobs()
								.then(function () {
									service.blobLoaded.fire();
								});
						}
					}
				};
				return factoryService;
			}]
	);
})(angular);
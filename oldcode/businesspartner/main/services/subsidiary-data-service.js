/**
 * Created by zos on 12/19/2014.
 */
(function (angular, $) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,jQuery */

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name procurementQuoteHeaderDataService
	 * @function
	 * @requires $timeout, $http, basicsLookupdataLookupFilterService
	 *
	 * @description Provide header data service
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('businesspartnerMainSubsidiaryDataService',
		['_', '$timeout', 'platformDataServiceFactory', 'businesspartnerMainHeaderDataService', 'basicsLookupdataLookupDescriptorService',
			'businesspartnerMainSubsidiaryValidationService', 'platformRuntimeDataService', 'ServiceDataProcessDatesExtension',
			'platformDataServiceSelectionExtension', 'globals', 'platformDataValidationService', 'platformModuleStateService',
			'businesspartnerStatusRightService', 'PlatformMessenger', '$translate', '$q', '$injector',

			function (_, $timeout, platformDataServiceFactory, businesspartnerMainHeaderDataService, basicsLookupdataLookupDescriptorService,
				businesspartnerMainSubsidiaryValidationService, platformRuntimeDataService, ServiceDataProcessDatesExtension,
				platformDataServiceSelectionExtension, globals, platformDataValidationService, platformModuleStateService,
				businesspartnerStatusRightService, PlatformMessenger, $translate, $q, $injector) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainSubsidiaryDataService',
						dataProcessor: [{processItem: doValidation}, {processItem: updateParentValue},{processItem: setFieldsReadonlyByBpStatus}, new ServiceDataProcessDatesExtension(['TradeRegisterDate'])],
						entityRole: {
							node: {
								itemName: 'Subsidiary',
								parentService: businesspartnerMainHeaderDataService,
								doesRequireLoadAlways: true
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'businesspartner/main/subsidiary/',
							endCreate: 'create'
						},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/subsidiary/', endRead: 'list'},
						presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}},
						actions: {create: 'flat', delete: true, canDeleteCallBackFunc: canDeleteCallBackFunc}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				var validator = businesspartnerMainSubsidiaryValidationService(serviceContainer.service);
				var fields = {
					'SubsidiaryDescriptor.AddressDto': {dto: 'AddressDto', pattern: null},
					'SubsidiaryDescriptor.TelephoneNumber1Dto': {dto: 'TelephoneNumber1Dto', pattern: 'TelephonePattern'},
					'SubsidiaryDescriptor.TelephoneNumber2Dto': {dto: 'TelephoneNumber2Dto', pattern: 'Telephone2Pattern'},
					'SubsidiaryDescriptor.TelephoneNumberTelefaxDto': {dto: 'TelephoneNumberTelefaxDto', pattern: 'TelefaxPattern'},
					'SubsidiaryDescriptor.TelephoneNumberMobileDto': {dto: 'TelephoneNumberMobileDto', pattern: 'MobilePattern'},
					'Email': {dto: 'Email', pattern: null}
				};

				// user can edit this fields only bp status which has edit right.
				// eslint-disable-next-line no-unused-vars
				var readonlyFieldsByBpStatus = ['AddressDto', 'AddressDto.Street', 'AddressDto.City', 'AddressDto.ZipCode'];

				initialize();

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};
				serviceContainer.data.updateOnSelectionChanging = function updateOnSelectionChanging(data, entity) {

					let childServices = businesspartnerMainHeaderDataService.getChildServices();
					if (childServices) {
						let structureDataSerivce;
						for (let i = 0; i < childServices.length; i++) {
							let itemName;
							if (angular.isFunction(childServices[i].getItemName)) {
								itemName = childServices[i].getItemName();
							}
							if (itemName && itemName === 'BusinessPartner2PrcStructure') {
								structureDataSerivce = childServices[i];
								break;
							}
						}
						if (structureDataSerivce) {
							structureDataSerivce.saveCache();
						}
					}
					$injector.get('businesspartnerMainContactDataService').filterByBranch(entity);
					$injector.get('businesspartnerMainSupplierDataService').filterByBranch(entity);
					return $q.when(true);
				};
				return serviceContainer.service;

				function doValidation(item) {
					if (item) {
						var result = validator.validateAddressTypeFk(item, item.AddressTypeFk, 'AddressTypeFk', true);
						platformRuntimeDataService.applyValidationResult(result, item, 'AddressTypeFk');
					}
				}

				function updateParentValue(item) {
					if (item && item.IsMainAddress) {
						var headerItem = _.find(getParentService().getList(), {Id: item.BusinessPartnerFk});
						if (headerItem) {
							$.extend(true, headerItem.SubsidiaryDescriptor, item);
						}
					}
				}

				function beforeUpdate() {
					serviceContainer.service.gridRefresh();
				}

				function initialize() {
					serviceContainer.service.subsidiaryStatusEditRightAll=[];
					serviceContainer.service.gridRefresh = serviceContainer.data.dataModified.fire;
					serviceContainer.service.registerEntityCreated(entityCreated);
					serviceContainer.service.registerSelectionChanged(updateFieldsReadonly);
					serviceContainer.service.updateFieldsReadonly = updateFieldsReadonly;
					serviceContainer.service.getAvailableStatusCustom = getAvailableStatusCustom;
					serviceContainer.service.getParentService = getParentService;
					serviceContainer.data.onDeleteDone = onDeleteDoneInList;

					serviceContainer.service.registerUpdateBusinessPartnerEmail = new PlatformMessenger();

					businesspartnerMainHeaderDataService.registerEntityCreated(onHeaderEntityCreated);
					businesspartnerMainHeaderDataService.registerDescriptorChanged(onHeaderDescriptorChanged);
					businesspartnerMainHeaderDataService.registerBeforeDataUpdate(beforeUpdate);
					businesspartnerMainHeaderDataService.registerValidationIssuesClearUp(onClearUpValidationIssues);
					businesspartnerMainHeaderDataService.registerValidationIssuesRemove(onRemoveValidationIssues);

					var oldDeleteEntities = serviceContainer.service.deleteEntities;
					serviceContainer.service.deleteEntities = function deleteEntities(entities) {
						// filter the mainAddress entity as it should not be deleted
						var newEntities = _.filter(entities, function (entity) {
							return !entity.IsMainAddress;
						});
						if (newEntities && newEntities.length > 0) {
							return oldDeleteEntities(newEntities);
						}
					};

					// noinspection JSUnusedLocalSymbols
					function entityCreated(e, newEntity) {
						if (!getMainItem()) {
							var headerItem = businesspartnerMainHeaderDataService.getSelected();
							if (headerItem) {
								$.extend(true, newEntity, headerItem.SubsidiaryDescriptor, {IsMainAddress: true});
							}
						}

						var result = basicsLookupdataLookupDescriptorService.provideLookupData(newEntity, {
							collect: function (prop) {
								var result = true;
								// basicsLookupdataLookupDescriptorService will take string from property name except 'Fk' as lookup type name by default,
								// if it is not the right lookup type name, please use convert to return right name.
								switch (prop) {
									case 'BusinessPartnerFk':
									case 'AddressFk':
									case 'TelephoneNumberFk':
									case 'TelephoneNumber2Fk':
									case 'TelephoneNumberTelefaxFk':
									case 'TelephoneNumberMobileFk':
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
						if (newEntity.AddressDto && newEntity.AddressDto.CountryFk) {
							validator.validateAddressDto(newEntity, newEntity.AddressDto, 'AddressDto');
						}
					}

					// noinspection JSUnusedLocalSymbols
					function onHeaderEntityCreated(e, newHeaderItem) {
						var onSubsidiaryCreated = function (e, newItem) {
							serviceContainer.service.unregisterEntityCreated(onSubsidiaryCreated);
							newHeaderItem.SubsidiaryDescriptor = angular.copy(newItem);
							serviceContainer.data.listLoaded.fire();
						};
						serviceContainer.service.registerEntityCreated(onSubsidiaryCreated);
						$timeout(function () {
							serviceContainer.service.createItem();
						}, 600);
					}

					// noinspection JSUnusedLocalSymbols
					function onHeaderDescriptorChanged(e, obj) {
						if (obj && obj.validationResult && obj.validationResult.apply && obj.validationResult.valid) {
							updateSubsidiaryByHeaderItem(obj.model, obj.value, obj.validationResult);
						}
					}

					function updateSubsidiaryByHeaderItem(model, value, validationResult) {
						var currentItem = getMainItem();
						if (currentItem && fields[model]) {
							currentItem[fields[model].dto] = angular.copy(value);
							if (fields[model].pattern) {
								currentItem[fields[model].pattern] = value ? value.Pattern : null;
							}
							serviceContainer.service.setSelected(currentItem);
							if (validationResult) {
								var asyncMarker = platformDataValidationService.registerAsyncCall(currentItem, fields[model].dto, value, serviceContainer.service);
								platformDataValidationService.finishAsyncValidation(validationResult, currentItem, value, fields[model].dto, asyncMarker, validator, serviceContainer.service);
								platformRuntimeDataService.applyValidationResult(validationResult, currentItem, fields[model].dto);
							}
							// the simple type solo process
							if (model === 'Email') {
								let parentItem = serviceContainer.service.parentService().getSelected();
								parentItem.SubsidiaryDescriptor[model] = value;
							}
							serviceContainer.service.gridRefresh();
						}
					}

					function onClearUpValidationIssues() {
						if (platformDataValidationService.hasErrors(serviceContainer.service)) {
							var modState = platformModuleStateService.state(serviceContainer.service.getModule());
							modState.validation.issues = [];
						}
					}

					// noinspection JSUnusedLocalSymbols
					function onRemoveValidationIssues(e, id) {
						if (platformDataValidationService.hasErrors(serviceContainer.service)) {
							var modState = platformModuleStateService.state(serviceContainer.service.getModule());
							modState.validation.issues = _.filter(modState.validation.issues, function (err) {
								return err.entity.BusinessPartnerFk !== id;
							});
						}
					}

					registerBusinessPartnerMainHeaderEvent();
				}

				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData);
					if (readData.SubsidiaryStatusEditRight){
						serviceContainer.service.subsidiaryStatusEditRightAll=readData.SubsidiaryStatusEditRight;
					}
					angular.forEach(readData.Main, function (item) {
						updateFieldsReadonly(null, item);
					});
					var item = _.find(readData.Main, {IsMainAddress: true});
					var parentService = getParentService();
					var parentItem = null;
					var result = [];
					if (!item) {
						parentItem = data.currentParentItem;
						if (!parentItem || !parentItem.SubsidiaryDescriptor || angular.isUndefined(parentItem.SubsidiaryDescriptor.TelephoneNumberFk)) {
							return data.handleReadSucceeded(readData.Main, data);
						}
						item = angular.copy(parentItem.SubsidiaryDescriptor);
						handleValidationIssues(parentService, parentItem, item);
						return data.handleReadSucceeded([item], data);
					}

					parentItem = _.find(parentService.getList(), {Id: item.BusinessPartnerFk});
					if (!parentItem || !parentItem.SubsidiaryDescriptor) {
						return data.handleReadSucceeded(readData.Main, data);
					}
					if (item.Id === parentItem.SubsidiaryDescriptor.Id) {
						$.extend(true, item, parentItem.SubsidiaryDescriptor);
					}

					if (!platformDataValidationService.hasErrors(parentService)) {
						result = data.handleReadSucceeded(readData.Main, data);
						if (serviceContainer.service.currentSelectItem) {
							serviceContainer.service.setSelected(serviceContainer.service.currentSelectItem);
							serviceContainer.service.currentSelectItem = null;
						} else {
							_.forEach(result, function (item) {
								if (item && item.IsMainAddress) {
									serviceContainer.service.setSelected(item);
								}
							});
						}
						return result;
					}
					handleValidationIssues(parentService, parentItem, item);

					return data.handleReadSucceeded(readData.Main, data);
				}

				function onDeleteDoneInList(deleteParams, data) {
					// region delete structure
					let childServices = businesspartnerMainHeaderDataService.getChildServices();
					if (childServices) {
						let structureDataSerivce;
						for (let i = 0; i < childServices.length; i++) {
							if (angular.isFunction(childServices[i].getItemName)) {
								let itemName = childServices[i].getItemName();
								if (itemName === 'BusinessPartner2PrcStructure') {
									structureDataSerivce = childServices[i];
									break;
								}
							}
						}
						if (structureDataSerivce) {
							let structureData = structureDataSerivce.getTree();
							structureDataSerivce.deleteEntities(structureData);
						}
					}
					// endregion
					if (data.deleteFromSelections) {
						data.deleteFromSelections(deleteParams.entities, data);
					}
					data.doClearModifications(deleteParams.entities, data);
					doClearValidationIssues(deleteParams.entities);
					data.itemList = _.filter(data.itemList, function (item) {
						var found = _.find(deleteParams.entities, {Id: item.Id});
						return !found;
					});

					// change header item's subsidiary descriptor
					if (!getMainItem()) {
						businesspartnerMainHeaderDataService.getSelected().SubsidiaryDescriptor = null;
					}

					data.listLoaded.fire();
					platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);
				}

				function getMainItem() {
					var items = serviceContainer.data.itemList;
					for (var i = 0; i < items.length; i++) {
						if (items[i].IsMainAddress) {
							return items[i];
						}
					}
				}

				function doClearValidationIssues(entity) {
					if (platformDataValidationService.hasErrors(serviceContainer.service)) {
						var modState = platformModuleStateService.state(serviceContainer.service.getModule());
						modState.validation.issues = _.filter(modState.validation.issues, function (err) {
							return err.entity.Id !== entity.Id;
						});
					}
				}

				function getParentService() {
					return serviceContainer.data.parentService;
				}

				function canDeleteCallBackFunc() {
					var select = serviceContainer.service.getSelected();
					return !select || !select.IsMainAddress;
				}

				function handleValidationIssues(parentService, parentItem, item) {
					var modState = platformModuleStateService.state(parentService.getModule());
					for (var i = 0; i < modState.validation.issues.length; ++i) {
						var issue = modState.validation.issues[i];
						var model = issue.model;
						if (fields[model]) {
							if (issue.entity.Id !== parentItem.Id || !fields[model].dto) {
								continue;
							}
							var validationResult = {
								apply: issue.apply,
								valid: issue.valid,
								error$tr$: issue.error$tr$,
								error$tr$param$: issue.error$tr$param$
							};
							platformRuntimeDataService.applyValidationResult(validationResult, item, fields[model].dto);
						}
					}
				}

				/**
				 * set the fields readonly only bp status's AccessRightDescriptorFk is not null and has not edit right
				 */
				function setFieldsReadonlyByBpStatus(finalItem) {
					let parentService = getParentService();
					if (!parentService) {
						return;
					}
					let parentItem = parentService.getSelected();
					if (_.isEmpty(finalItem) || _.isEmpty(parentItem)) {
						return;
					}
					const status = businesspartnerMainHeaderDataService.getItemStatus();
					if (status.IsReadonly === true) {
						platformRuntimeDataService.readonly(finalItem, true);
						return;
					}

					let bpStatus = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus'), {Id: parentItem.BusinessPartnerStatusFk});
					let bpStatusWithEditRight = _.find(parentService.statusWithEidtRight, {Id: parentItem.BusinessPartnerStatusFk});
					// region bp status
					if (bpStatus && bpStatus.AccessRightDescriptorFk && !bpStatusWithEditRight) {
						if (finalItem.IsMainAddress) {
							platformRuntimeDataService.readonly(finalItem, true);
							return;
						} else {
							platformRuntimeDataService.readonly(finalItem, [{field: 'IsMainAddress', readonly: true}]);
						}
					}
					// endregion
					// region subsidiaryStatus
					let subsidiaryStatusData = basicsLookupdataLookupDescriptorService.getData('SubsidiaryStatus');
					if (!subsidiaryStatusData) {
						return;
					}
					let subsidiaryStatus = subsidiaryStatusData[finalItem.SubsidiaryStatusFk];
					let subsidiaryStatusEditRight = serviceContainer.service.subsidiaryStatusEditRightAll.find(e => e.Id === finalItem.SubsidiaryStatusFk);
					if (subsidiaryStatus && subsidiaryStatus.AccessRightDescriptorFk && !subsidiaryStatusEditRight && !finalItem.IsMainAddress) {
						platformRuntimeDataService.readonly(finalItem, true);
					}
					// endregion
				}

				// eslint-disable-next-line no-unused-vars
				function getReadonlyFields(fields) {
					var readonlyFields = [];
					_.forEach(fields, function (field) {
						readonlyFields.push({field: field, readonly: true});
					});
					return readonlyFields;
				}

				function updateFieldsReadonly(value, item) {
					var readonlyFields = ['VatNo', 'TaxNo', 'TradeRegister', 'TradeRegisterNo', 'TradeRegisterDate'];
					if (item) {
						for (var index = 0; index < readonlyFields.length; index++) {
							var readonly = value ? value : item.IsMainAddress === true;
							platformRuntimeDataService.readonly(item, [{field: readonlyFields[index], readonly: readonly}]);
						}
					}
				}

				function registerBusinessPartnerMainHeaderEvent() {
					var parentService = serviceContainer.service.parentService();
					parentService.registerUpdateEmail(serviceContainer.service.registerUpdateBusinessPartnerEmail);
				}

				function getAvailableStatusCustom(options, availableStatus) {

					if (options.entity.IsMainAddress !== true) {
						return availableStatus;
					}
					let statusData = basicsLookupdataLookupDescriptorService.getData('SubsidiaryStatus');
					let noActiveFkArray = [];
					let activeFkArray = [];
					for (let prop in statusData) {
						if (Object.prototype.hasOwnProperty.call(statusData, prop)) {
							if (!statusData[prop].IsActive && statusData[prop].IsLive) {
								noActiveFkArray.push(statusData[prop].Id);
							}
						}
					}
					for (let c = 0; c < noActiveFkArray.length; c++) {
						for (let d = 0; d < availableStatus.length; d++) {
							if (availableStatus[d] !== noActiveFkArray[c]) {
								activeFkArray.push(availableStatus[d]);
							}
						}
					}
					if (noActiveFkArray.length > 0) {
						options.additionalMessage = $translate.instant('businesspartner.main.subsidiaryStatusErrMsg');
					}
					return activeFkArray;
				}

				function initCreationData(creationData) {
					var selected = businesspartnerMainHeaderDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}
			}]
	);
})(angular, jQuery);
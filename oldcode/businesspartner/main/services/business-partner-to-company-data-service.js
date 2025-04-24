/**
 * Created by zos on 12/25/2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businessPartnerMainBP2CompanyDataServiceNew
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 *
	 * @description Provide bank data service
	 */
	angular.module(moduleName).factory('businessPartnerMainBP2CompanyDataService',
		['_', '$timeout', 'platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService',
			'basicsLookupdataLookupFilterService', 'platformRuntimeDataService', 'PlatformMessenger',
			'globals', 'platformSchemaService', 'platformDataServiceSelectionExtension', 'businesspartnerStatusRightService', 'basicsCommonMandatoryProcessor',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (_, $timeout, platformDataServiceFactory, platformContextService, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService,
				basicsLookupdataLookupFilterService, platformRuntimeDataService, PlatformMessenger,
				globals, platformSchemaService, platformDataServiceSelectionExtension, businesspartnerStatusRightService, basicsCommonMandatoryProcessor) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businessPartnerMainBP2CompanyDataService',
						dataProcessor: [{processItem: processItemReadonly}],
						entityRole: {leaf: {itemName: 'BusinessPartner2Company', parentService: businesspartnerMainHeaderDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner2company/', endCreate: 'create'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner2company/', endRead: 'list'},
						presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}},
						actions: {create: 'flat', delete: true, canDeleteCallBackFunc: canDeleteCallBackFunc}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.deleteRequested = new PlatformMessenger();
				var tempModifiedItems = [];
				var dataAttributeDomains = [];

				serviceContainer.data.cleanUpLocalData = function cleanUpBP2CompanyData() {
					tempModifiedItems = [];
				};

				initialize(serviceContainer.service);

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'BusinessPartner2CompanyDto',
					moduleSubModule: 'BusinessPartner.Main',
					validationService: 'businessPartnerMainBusinessPartner2CompanyValidationService',
					mustValidateFields: ['CompanyFk']
				});

				return serviceContainer.service;

				function incorporateDataRead(readData, data) {
					var status = businesspartnerMainHeaderDataService.getItemStatus();
					if (status.IsReadonly === true) {
						businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
					}

					basicsLookupdataLookupDescriptorService.attachData(readData);
					var dataRead = data.handleReadSucceeded(readData.Main, data);

					if (businesspartnerStatusRightService.isBpStatusReadOnly() === false) {
						_.forEach(readData.Main, function (item) {
							setReadonly(item);
						});
					}

					return dataRead;
				}

				function processItemReadonly(item) {
					var selected = serviceContainer.service.getSelected();
					if (platformDataServiceSelectionExtension.isSelection(selected) && item && selected.Id === item.Id) {
						serviceContainer.service.deselect();
						serviceContainer.data.listLoaded.fire();
						serviceContainer.service.setSelected(item);
					}
					if (item) {
						setReadonly(item);
					}
				}

				function onItemDeleted(entity) {
					if (!entity) {
						return;
					}
					for (var i = 0; i < tempModifiedItems.length; ++i) {
						if (tempModifiedItems[i].Id === entity.Id) {
							tempModifiedItems.splice(i, 1);
							break;
						}
					}
				}

				function propertyChanged() {
					var entity = serviceContainer.service.getSelected();
					if (entity) {
						addTempModifiedItem(entity);
					}
				}

				function setReadonly(currentItem) {
					if (!currentItem || !currentItem.Id) {
						return;
					}

					dataAttributeDomains = dataAttributeDomains.length === 0 ? platformSchemaService.getSchemaFromCache({
						typeName: 'BusinessPartner2CompanyDto',
						moduleSubModule: 'BusinessPartner.Main'
					}).properties : dataAttributeDomains;

					var fields = _.map(dataAttributeDomains, function (model, key) {
						var editable = getCellEditable(currentItem);
						if (key === 'UpdatedAt' || key === 'InsertedAt' || key === 'Inserted' || key === 'Updated') {
							editable = false;
						}
						return {
							field: key,
							readonly: !editable
						};
					});
					platformRuntimeDataService.readonly(currentItem, fields);
				}

				function onSetReadonly() {
					var service = serviceContainer.service;
					var currentItem = service.getSelected();
					setReadonly(currentItem);
				}

				function addTempModifiedItem(item) {
					var modify = _.find(tempModifiedItems, {Id: item.Id});
					if (!modify) {
						tempModifiedItems.push(item);
					}
				}

				function getCellEditable(currentItem) {
					if (!currentItem || !currentItem.Id) {
						return true;
					}
					var loginComoanyId = platformContextService.getContext().clientId;
					var modifiedItem = _.find(tempModifiedItems, {Id: currentItem.Id});
					var isNewItem = false;
					if (angular.isDefined(currentItem.Version)) {
						isNewItem = currentItem.Version === 0;
					}
					// if the companyFk equals to login company's id or the current item is a new item or the current item is a modified item, the cell is editable.
					return currentItem.CompanyFk === loginComoanyId || isNewItem || (!!modifiedItem);
				}

				function canDeleteCallBackFunc(selectItem) {
					return getCellEditable(selectItem);
				}

				function initialize(service) {
					var responsibleCompanyFilter = {
						key: 'business-partner-to-company-responsible-company-filter',
						serverSide: true,
						fn: function () {
							var select = service.getSelected();
							if (select && angular.isDefined(select.Id)) {
								return 'Id=' + select.CompanyFk;
							}
							return 'Id=-1';
						}
					};
					basicsLookupdataLookupFilterService.registerFilter(responsibleCompanyFilter);

					service.onCreateNewItem = service.createItem;
					service.propertyChanged = propertyChanged;
					registerMessenger();

					function registerMessenger() {
						serviceContainer.data.deleteRequested.register(onItemDeleted);
						service.registerSelectionChanged(onSetReadonly);
						businesspartnerMainHeaderDataService.registerEntityCreated(onHeaderEntityCreated);
					}

					function onHeaderEntityCreated() {
						$timeout(function () {
							serviceContainer.service.createItemInBackground();
						}, 600);
					}
				}

				function initCreationData(creationData) {
					var selected = businesspartnerMainHeaderDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}
			}]
	);
})(angular);
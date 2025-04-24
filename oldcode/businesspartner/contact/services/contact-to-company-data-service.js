(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name businesspartner.contact.businessPartnerContact2CompanyDataService
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 *
	 * @description Provide bank data service
	 */
	angular.module(moduleName).factory('businessPartnerContact2CompanyDataService',
		['_', '$timeout', 'platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'businesspartnerContactDataService',
			'basicsLookupdataLookupFilterService', 'platformRuntimeDataService', 'PlatformMessenger',
			'globals', 'platformSchemaService', 'platformDataServiceSelectionExtension', 'basicsCommonMandatoryProcessor',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (_, $timeout, platformDataServiceFactory, platformContextService, basicsLookupdataLookupDescriptorService, businesspartnerContactDataService,
				basicsLookupdataLookupFilterService, platformRuntimeDataService, PlatformMessenger,
				globals, platformSchemaService, platformDataServiceSelectionExtension, basicsCommonMandatoryProcessor) {

				let serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businessPartnerContact2CompanyDataService',
						dataProcessor: [{processItem: processItemReadonly}],
						entityRole: {leaf: {itemName: 'Contact2Company', parentService: businesspartnerContactDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/contact/contact2company/', endCreate: 'createnew'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/contact/contact2company/', endRead: 'list'},
						presenter: {list: {incorporateDataRead: incorporateDataRead}},
						actions: {create: 'flat', delete: true, canDeleteCallBackFunc: canDeleteCallBackFunc}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.deleteRequested = new PlatformMessenger();
				let tempModifiedItems = [];
				let dataAttributeDomains = [];

				serviceContainer.data.cleanUpLocalData = function cleanUpBP2CompanyData() {
					tempModifiedItems = [];
				};

				let gridRefreshDelayed = _.debounce(function () {
					serviceContainer.service.gridRefresh();
				}, {
					wait: 80,
					maxWait: 1000
				});

				initialize(serviceContainer.service);

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'Contact2BasCompanyDto',
					moduleSubModule: 'BusinessPartner.Contact',
					validationService: 'businessPartnerContact2CompanyValidationService',
					mustValidateFields: ['BasCompanyFk']
				});

				return serviceContainer.service;

				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData);
					let dataRead = data.handleReadSucceeded(readData.Main, data);
					return dataRead;
				}

				function processItemReadonly(item) {
					let selected = serviceContainer.service.getSelected();
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
					for (let i = 0; i < tempModifiedItems.length; ++i) {
						if (tempModifiedItems[i].Id === entity.Id) {
							tempModifiedItems.splice(i, 1);
							break;
						}
					}
				}

				function propertyChanged() {
					let entity = serviceContainer.service.getSelected();
					if (entity) {
						addTempModifiedItem(entity);
					}
				}

				function setReadonly(currentItem) {
					if (!currentItem?.Id) {
						return;
					}

					dataAttributeDomains = dataAttributeDomains.length === 0 ? platformSchemaService.getSchemaFromCache({
						typeName: 'Contact2BasCompanyDto',
						moduleSubModule: 'BusinessPartner.Contact'
					}).properties : dataAttributeDomains;

					let fields = _.map(dataAttributeDomains, function (model, key) {
						let editable = getCellEditable(currentItem);
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
					let service = serviceContainer.service;
					let currentItem = service.getSelected();
					setReadonly(currentItem);
					gridRefreshDelayed();
				}

				function addTempModifiedItem(item) {
					let modify = _.find(tempModifiedItems, {Id: item.Id});
					if (!modify) {
						tempModifiedItems.push(item);
					}
				}

				function getCellEditable(currentItem) {
					if (!currentItem?.Id) {
						return true;
					}
					let loginComoanyId = platformContextService.getContext().clientId;
					let modifiedItem = _.find(tempModifiedItems, {Id: currentItem.Id});
					let isNewItem = false;
					if (angular.isDefined(currentItem.Version)) {
						isNewItem = currentItem.Version === 0;
					}
					// if the companyFk equals to login company's id or the current item is a new item or the current item is a modified item, the cell is editable.
					return currentItem.BasCompanyFk === loginComoanyId || isNewItem || (!!modifiedItem);
				}

				function canDeleteCallBackFunc(selectItem) {
					return getCellEditable(selectItem);
				}

				function initialize(service) {
					let responsibleCompanyFilter = {
						key: 'business-partner-contact-to-company-responsible-company-filter',
						serverSide: true,
						fn: function () {
							let select = service.getSelected();
							if (select && angular.isDefined(select.Id)) {
								return 'Id=' + select.BasCompanyFk;
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
						businesspartnerContactDataService.registerEntityCreated(onHeaderEntityCreated);
					}

					function onHeaderEntityCreated() {
						$timeout(function () {
							serviceContainer.service.createItemInBackground();
						}, 600);
					}
				}
			}]
	);
})(angular);
/**
 * Created by zos on 12/25/2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainRealestateDataServiceNew
	 * @function
	 * @requireds platformDataServiceFactory
	 *
	 * @description Provide realestate data service
	 */
	angular.module(moduleName).factory('businesspartnerMainRealestateDataService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService',
			'businesspartnerMainRealestateValidationService', 'platformRuntimeDataService', 'ServiceDataProcessDatesExtension', 'globals',
			'businesspartnerStatusRightService',
			/* jshint -W072 */
			function (platformDataServiceFactory, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService,
				businesspartnerMainRealestateValidationService, platformRuntimeDataService, ServiceDataProcessDatesExtension, globals,
				businesspartnerStatusRightService) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainRealestateDataService',
						dataProcessor: [{processItem: processItem}, new ServiceDataProcessDatesExtension(['LastAction'])],
						entityRole: {leaf: {itemName: 'RealEstate', parentService: businesspartnerMainHeaderDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/realestate/', endCreate: 'create'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/realestate/', endRead: 'list'},
						presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				initialize();

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				return serviceContainer.service;

				function incorporateDataRead(readData, data) {
					var status = businesspartnerMainHeaderDataService.getItemStatus();
					if (status.IsReadonly === true) {
						businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
					}

					basicsLookupdataLookupDescriptorService.attachData(readData);

					return data.handleReadSucceeded(readData.Main, data);
				}

				function processItem(item) {
					if (item) {
						var validationService = businesspartnerMainRealestateValidationService(serviceContainer.service);
						var result = validationService.validateRealestateTypeFk(item, item.RealestateTypeFk, 'RealestateTypeFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'RealestateTypeFk');

						result = validationService.validatePotential(item, item.Potential, 'Potential');
						platformRuntimeDataService.applyValidationResult(result, item, 'Potential');
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
								case 'BusinessPartnerFk':
								case 'TelephoneNumberFk':
								case 'TelephoneNumberTelefaxFk':
								case 'AddressFk':
								case 'RealestateTypeFk':
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

				function initialize() {
					/**
					 * provide lookup data item to lookup formatter after creating new item.
					 */
					serviceContainer.service.registerEntityCreated(onEntityCreated);
				}

				function initCreationData(creationData) {
					var selected = businesspartnerMainHeaderDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}
			}]
	);
})(angular);
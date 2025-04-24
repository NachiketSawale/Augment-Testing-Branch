/**
 * Created by bh on 25.05.2020
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc factory
	 * @name boqMainBillToDataServiceFactory
	 * @description provides methods to access, create and update boq main billTo entities
	 */

	angular.module(moduleName).factory('boqMainBillToDataServiceFactory', [
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'boqMainBillToValidationServiceProvider', 'platformRuntimeDataService', 'platformDataServiceDataProcessorExtension', '$injector',
		function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			basicsCommonMandatoryProcessor, boqMainBillToValidationServiceProvider, platformRuntimeDataService, platformDataServiceDataProcessorExtension, $injector) {

			var serviceCache = [];
			var billToScheme = {typeName: 'BoqBillToDto', moduleSubModule: 'Boq.Main'};

			function getServiceName(serviceKey) {
				return 'boqMainSplitQuantityService_' + serviceKey;
			}

			function createNewComplete(parentService, serviceKey) {

				function isEditable() {
					return !serviceContainer.service.isReadOnly();
				}

				var serviceFactoryOptions = {
					flatLeafItem: {
						module: moduleName,
						serviceName: getServiceName(serviceKey),
						entityNameTranslationID: 'boq.main.billToEntity',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'boq/main/billto/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								var selected = parentService.getSelected();
								readData.PKey1 = selected.Id;
								readData.PKey3 = parentService.getSelectedProjectId();
							}
						},
						actions: {delete: true, create: 'flat', canCreateCallBackFunc: isEditable, canDeleteCallBackFunc: isEditable},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(billToScheme), {processItem: processItem}],
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selected = parentService.getSelected();
									creationData.PKey1 = selected.Id;
									creationData.PKey2 = selected.BoqHeaderFk;
								},
								incorporateDataRead: function (readData, data) {
									readData = serviceContainer.service.calculateTotalQuantity(readData);
									return data.handleReadSucceeded(readData, data);
								}
							}
						},
						entityRole: {
							leaf: {itemName: 'BillTos', parentService: parentService}
						}
					}
				};

				function processItem(item) {
					var readOnlyFields = ['Description', 'Comment', 'Remark', 'BusinesspartnerFk', 'CustomerFk', 'SubsidiaryFk', 'TotalQuantity'];

					if(!isEditable()) {
						// Add the remaining editable fields to fully achieve readonly
						readOnlyFields = readOnlyFields.concat(['PrjBillToId', 'QuantityPortion']);
					}

					var fields = _.map(readOnlyFields, function (field) {
						return {field: field, readonly: true};
					});
					platformRuntimeDataService.readonly(item, fields);
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

				serviceContainer.data.Initialised = true;
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
					mustValidateFields: true,
					validationService: boqMainBillToValidationServiceProvider.getInstance(serviceContainer.service)
				}, billToScheme));

				serviceContainer.service.getBoqService = function () {
					return parentService;
				};

				serviceContainer.service.processBillToItem = function processBillToItem(billToItem) {
					return platformDataServiceDataProcessorExtension.doProcessItem(billToItem, serviceContainer.data);
				};

				serviceContainer.service.calculateTotalQuantity = function (billToItems){

					var totalQuantity = 0;

					billToItems.forEach(billToItem => {
						totalQuantity += billToItem.QuantityPortion;
					});
					billToItems.forEach(billToItem => {
						billToItem.TotalQuantity = totalQuantity;
					});

					return billToItems;
				};

				serviceContainer.service.isReadOnly = function isReadOnly() {
					let isProjectBoq = parentService.getCallingContextType() === 'Project';
					let billToModes = $injector.get('billToModes');
					let selectedBoqItem = parentService.getSelected();
					let boqMainCommonService = $injector.get('boqMainCommonService');
					if(isProjectBoq) {
						if (parentService.getCurrentBillToMode() === billToModes.quantityOrItemBased || boqMainCommonService.isTextElementWithoutReference(selectedBoqItem)) {
							return true;
						}
					}

					return false;
				};

				return serviceContainer.service;
			}

			return {

				getService: function (parentService, serviceKey) {

					var serviceName = getServiceName(serviceKey);
					if (!serviceCache[serviceName]) {
						serviceCache[serviceName] = createNewComplete(parentService, serviceKey);
					}
					return serviceCache[serviceName];
				}
			};

		}]);

})(angular);

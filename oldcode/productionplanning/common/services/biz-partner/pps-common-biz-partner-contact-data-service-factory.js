(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonBizPartnerContactServiceFactory', ['platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService',
		'$injector','_', 'globals',
		'ppsCommonProjectBPValidationService',
		'basicsCommonMandatoryProcessor',
		'ppsCommonBizPartnerContactValidationServiceFactory',

		function (platformDataServiceFactory,
				  platformDataServiceProcessDatesBySchemeExtension,
				  platformRuntimeDataService,
				  $injector, _, globals,
				  ppsCommonProjectBPValidationService,
				  basicsCommonMandatoryProcessor,
				  ppsCommonBizPartnerContactValidationServiceFactory) {

			var serviceCache = {};

			function getServiceBy(service) {
				return _.isObject(service) ? service : $injector.get(service);
			}

			function createNewComplete(serviceOptions) {
				var parentService = getServiceBy(serviceOptions.parentService);
				var bpServiceInfo = {
					flatLeafItem: {
						module: moduleName,
						serviceName: parentService.getServiceName() + 'CommonBizPartnerContactService',
						entityNameTranslationID: 'productionplanning.common.entityBizPartnerContact',
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'CommonBizPartnerContactDto',
							moduleSubModule: 'ProductionPlanning.Common'
						})],
						httpRead: {
							route: globals.webApiBaseUrl + 'productionplanning/common/contact/',
							endRead: 'list'
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'productionplanning/common/contact/',
							endCreate: 'create'
						},
						entityRole: {
							leaf: {
								itemName: 'CommonBizPartnerContact',
								parentService: parentService
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectedItem = parentService.getSelected();
									creationData.Id = selectedItem.Id;
									creationData.PKey1 = selectedItem.BusinessPartnerFk;
									creationData.Pkey2 = selectedItem.MainEntityFk;
								}
							}
						},
						actions: {
							create: 'flat',
							canCreateCallBackFunc: function () {
								var parentItem = parentService.getSelected();
								return !_.isNil(parentItem) && parentItem.Version > 0;
							},
							delete: true
						}
					}
				};

				var container = platformDataServiceFactory.createNewComplete(bpServiceInfo);
				container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					mustValidateFields: true,
					typeName: 'CommonBizPartnerContactDto',
					moduleSubModule: 'ProductionPlanning.Common',
					validationService: ppsCommonBizPartnerContactValidationServiceFactory.getService(container.service)
				});
				container.service.takeOver = function takeOver(entity) {
					var data = container.data;
					var dataEntity = data.getItemById(entity.Id, data);

					data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
					data.markItemAsModified(dataEntity, data);
				};

				// for avoiding undefined error when calling communicationFormatter of email field, override onCreateSucceeded method to pre-setting property __rt$data.
				var orginalOnCreateSucceeded = container.data.onCreateSucceeded;
				container.data.onCreateSucceeded = function (newData, data, creationData) {
					if (!newData.__rt$data) {
						newData.__rt$data = {};
					}
					orginalOnCreateSucceeded(newData, data, creationData);
				};

				container.data.usesCache = false;

				return container.service;
			}

			function getService(serviceOptions) {
				var serviceKey = serviceOptions.serviceKey;
				if (!serviceCache[serviceKey]) {
					serviceCache[serviceKey] = createNewComplete(serviceOptions);
				}
				return serviceCache[serviceKey];
			}

			return {
				getService: getService
			};
		}]);
})(angular);

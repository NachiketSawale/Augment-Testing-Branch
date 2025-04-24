/**
 * Created by lav on 6/25/2019.
 */
(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name projectPrj2BPService
	 * @function
	 *
	 * @description
	 * ppsCommonProjectBPContactService is the data service for all generals related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('ppsCommonProjectBPContactService', ['platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService',
		'$injector',
		'ppsCommonProjectBPValidationService',
		'basicsCommonMandatoryProcessor',
		'ppsCommonProjectBPContactValidationService',

		function (platformDataServiceFactory,
				  platformDataServiceProcessDatesBySchemeExtension,
				  platformRuntimeDataService,
				  $injector,
				  ppsCommonProjectBPValidationService,
				  basicsCommonMandatoryProcessor,
				  ppsCommonProjectBPContactValidationService) {

			var serviceCache = {};

			function getServiceBy(service) {
				return _.isObject(service) ? service : $injector.get(service);
			}

			function ensureInvalid(newItem) {
				if (newItem.ContactFk === 0) {
					newItem.ContactFk = null;
				}
			}

			function createNewComplete(serviceOptions) {
				var parentService = getServiceBy(serviceOptions.parentService);
				var bpServiceInfo = {
					flatLeafItem: {
						module: moduleName,
						serviceName: parentService.getServiceName() + 'projectPrj2BPContactService',
						entityNameTranslationID: 'project.main.entityPrj2BpContact',
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'Project2BusinessPartnerContactDto',
							moduleSubModule: 'Project.Main'
						})],
						httpCreate: {route: globals.webApiBaseUrl + 'project/main/project2bpcontact/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'project/main/project2bpcontact/',
							endRead: 'listByPartner'
						},
						entityRole: {
							leaf: {
								itemName: 'BusinessPartnerContacts',
								parentService: parentService,
								parentFilter: 'parentId'
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectedItem = parentService.getSelected();
									creationData.Id = selectedItem.Id;
									creationData.PKey1 = selectedItem.BusinessPartnerFk;
									delete creationData.MainItemId;
								},
								handleCreateSucceeded: function (newItem) {
									ensureInvalid(newItem);
								}
							}
						}
					}
				};

				var container = platformDataServiceFactory.createNewComplete(bpServiceInfo);
				container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					mustValidateFields: true,
					typeName: 'Project2BusinessPartnerContactDto',
					moduleSubModule: 'Project.Main',
					validationService: ppsCommonProjectBPContactValidationService.getService(container.service)
				});
				container.service.takeOver = function takeOver(entity) {
					var data = container.data;
					var dataEntity = data.getItemById(entity.Id, data);

					data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
					data.markItemAsModified(dataEntity, data);
				};

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

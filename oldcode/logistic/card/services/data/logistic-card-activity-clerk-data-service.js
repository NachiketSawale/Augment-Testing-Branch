/**
 * Created by Shankar on 17-08-2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.card');

	/**
	 * @ngdoc service
	 * @name logisticCardActivityClerkDataService
	 * @description pprovides methods to access, create and update logistic card activity entities
	 */
	myModule.service('logisticCardActivityClerkDataService', LogisticCardActivityClerkDataService);

	LogisticCardActivityClerkDataService.$inject = ['_', '$http', 'logisticCardActivityDataService', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsCommonServiceUploadExtension', 'moment',
		'platformRuntimeDataService', 'platformDataServiceActionExtension', 'platformDataServiceProcessDatesBySchemeExtension',
		'logisticCardConstantValues', 'basicsCommonMandatoryProcessor', '$injector', 'PlatformMessenger','logisticCardDataService'];

	function LogisticCardActivityClerkDataService(_, $http, logisticCardActivityDataService, platformDataServiceFactory,
		basicsLookupdataLookupDescriptorService, basicsCommonServiceUploadExtension, moment,
		platformRuntimeDataService, platformDataServiceActionExtension, platformDataServiceProcessDatesBySchemeExtension,
		logisticCardConstantValues, basicsCommonMandatoryProcessor, $injector, PlatformMessenger, logisticCardDataService) {
		var self = this;

		var logisticCardActivityClerkDataServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticCardActivityClerkDataService',
				entityNameTranslationID: 'logistic.card.entityLogisticCardActivityClerkDataServiceDocument',
				httpCreate: {route: globals.webApiBaseUrl + 'logistic/card/clerk/activity/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/card/clerk/activity/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticCardActivityDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: { delete: true, create: 'flat'/*, canDeleteCallBackFunc: logisticCardDataService.canCreateOrDelete*/},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticCardActivityDataService.getSelected();
							var selectedGrandParent = logisticCardDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selectedGrandParent.Id;
						}
					}
				},
				entityRole: {
					leaf: { itemName: 'JobCardActClerk', parentService: logisticCardActivityDataService }
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticCardConstantValues.schemes.cardactivityclerk), {
					processItem: function () {
					}
				}],
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardActivityClerkDataServiceOption, self);

		var service = serviceContainer.service;
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			typeName: 'JobCardActClerkDto',
			validationService: 'logisticCardActivityClerkValidationService'
		}, logisticCardConstantValues.schemes.cardactivityclerk));
	
	}
})(angular);

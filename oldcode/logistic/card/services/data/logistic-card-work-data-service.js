/**
 * Created by shen on 6/15/2020
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.card');

	/**
     * @ngdoc service
     * @name logisticCardWorkDataService
     * @description pprovides methods to access, create and update logistic card work entities
     */
	myModule.service('logisticCardWorkDataService', LogisticCardWorkDataService);

	LogisticCardWorkDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension','$injector',
		'basicsCommonMandatoryProcessor', 'logisticCardConstantValues', 'logisticCardDataService','platformRuntimeDataService','ServiceDataProcessDatesExtension','SchedulingDataProcessTimesExtension'];

	function LogisticCardWorkDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,$injector,
		basicsCommonMandatoryProcessor, logisticCardConstantValues, logisticCardDataService,platformRuntimeDataService,ServiceDataProcessDatesExtension,SchedulingDataProcessTimesExtension) {
		var self = this;
		var logisticCardWorkServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticCardWorkDataService',
				entityNameTranslationID: 'logistic.common.workEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/card/jobcardwork/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticCardDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: logisticCardDataService.canCreateOrDelete, canCreateCallBackFunc: logisticCardDataService.canCreateOrDelete},


				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticCardDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.LogisticContextFk;
							creationData.PKey3 = selected.JobFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Works', parentService: logisticCardDataService}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticCardConstantValues.schemes.work), new SchedulingDataProcessTimesExtension(['WorkStart', 'WorkEnd']), {
					processItem: function (workItem) {platformRuntimeDataService.readonly(workItem, []);
						logisticCardDataService.setEntityToReadonlyIfRootEntityIs(workItem);
					}
				}],
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardWorkServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticCardWorkValidationService'
		}, logisticCardConstantValues.schemes.work));
	}
})(angular);

/**
 * Created by Shankar on 19.07.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordLoadingInfoDataService
	 * @description pprovides methods to access logistic dispatch loading data entities
	 */
	myModule.service('logisticDispatchingRecordLoadingInfoDataService', LogisticDispatchingRecordLoadingInfoDataService);

	LogisticDispatchingRecordLoadingInfoDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticDispatchingConstantValues', 'platformDataServiceEntityReadonlyProcessor', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingRecordLoadingInfoDataService(
		_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticDispatchingConstantValues, platformDataServiceEntityReadonlyProcessor, logisticDispatchingHeaderDataService) {
		let self = this;

		const logisticDispatchingRecordLoadingInfoDataServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticDispatchingRecordLoadingInfoDataService',
				entityNameTranslationID: 'logistic.dispatching.loadingInfoEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/recordloadinginfo/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticDispatchingHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: { delete: false, create: false },
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticDispatchingConstantValues.schemes.dispatchRecordLoadingInfo),
					platformDataServiceEntityReadonlyProcessor
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticDispatchingHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: { itemName: 'LoadInfoFromDispatchV', parentService: logisticDispatchingHeaderDataService }
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticDispatchingRecordLoadingInfoDataServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticDispatchingRecordLoadingInfoValidationService'
		}, logisticDispatchingConstantValues.schemes.dispatchRecordLoadingInfo));
	}
})(angular);


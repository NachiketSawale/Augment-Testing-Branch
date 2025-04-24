/**
 * Created by baf on 21.09.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingLinkageDataService
	 * @description pprovides methods to access, create and update logistic dispatching linkage entities
	 */
	myModule.service('logisticDispatchingLinkageDataService', LogisticDispatchingLinkageDataService);

	LogisticDispatchingLinkageDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingLinkageDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticDispatchingHeaderDataService) {
		var self = this;
		var logisticDispatchingLinkageServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticDispatchingLinkageDataService',
				entityNameTranslationID: 'logistic.dispatching.linkageEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/linkage/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticDispatchingHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'DispatchHeaderLinkageDto',
					moduleSubModule: 'Logistic.Dispatching'
				})],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticDispatchingHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.CompanyFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Linkages', parentService: logisticDispatchingHeaderDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticDispatchingLinkageServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'DispatchHeaderLinkageDto',
			moduleSubModule: 'Logistic.Dispatching',
			validationService: 'logisticDispatchingRecordValidationService'
		});
	}
})(angular);

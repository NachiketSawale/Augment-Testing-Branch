

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'qto.main';
	let qtoMainModule = angular.module(moduleName);

	qtoMainModule.factory('qtoDetailCommentsService',
		['_', '$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'platformDataServiceActionExtension',
			'basicsLookupdataLookupDescriptorService',  'qtoMainDetailService','PlatformMessenger',
			function (_, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, platformDataServiceActionExtension,
				basicsLookupdataLookupDescriptorService, qtoMainDetailService,PlatformMessenger) {
				let serviceContainer = {};
				let service ={};
				let serviceOptions = {
					flatLeafItem: {
						module: qtoMainModule,
						serviceName: 'qtoDetailCommentsService',
						entityNameTranslationID: 'qto.detail.QtoQtoCommentsEntity',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'qto/detail/comments/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(qtoMainDetailService.getSelected(), 'Id');
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'QtoDetailCommentsDto',
							moduleSubModule: 'Qto.Main'
						})],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								return !service.isReadonly();
							},
							canDeleteCallBackFunc: function () {
								return !service.isReadonly();
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(qtoMainDetailService.getSelected(), 'Id');
								},
								incorporateDataRead: function (readData, data) {

									let qtoHeader = $injector.get ('qtoMainHeaderDataService').getSelected ();
									let qtoStatusItem = $injector.get ('qtoHeaderReadOnlyProcessor').getItemStatus (qtoHeader);
									let btnStatus = false;
									if (qtoStatusItem) {
										btnStatus = qtoStatusItem.IsReadOnly;
									}
									_.each(readData, function (item) {
										platformRuntimeDataService.readonly(item, btnStatus || !item.IsWrite);
									});
									service.refreshBtn.fire();
									return serviceContainer.data.handleReadSucceeded(readData, data);
								}
							}
						},
						entityRole: {
							leaf: {itemName: 'QtoDetailComments', parentService: qtoMainDetailService}
						}
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = getNewEntityValidator('Qto.Main');

				function getNewEntityValidator(moduleSubModule) {
					let module2ValidationService = {
						'Qto.Main': 'qtoDetailCommentsValidationService'
					};

					return basicsCommonMandatoryProcessor.create({
						typeName: 'QtoDetailCommentsDto',
						moduleSubModule: moduleSubModule,
						validationService: module2ValidationService[moduleSubModule],
						mustValidateFields: ['BasQtoCommentsTypeFk']
					});
				}
				serviceContainer.data.usesCache = false;
				service =serviceContainer.service;

				service.refreshBtn = new PlatformMessenger();

				return service;
			}]);
})();
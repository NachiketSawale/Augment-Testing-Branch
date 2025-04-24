/**
 * Created by yew on 12/19/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).factory('procurementContractCallOffsDataService',
		['$q', '$http', '$translate', '$injector', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'platformModalService',
			'procurementContextService', 'procurementContractHeaderDataService', 'basicsLookupdataLookupDescriptorService', 'basicsCommonContractChangeDataProcessor',
			function ($q, $http, $translate, $injector, platformDataServiceFactory, ServiceDataProcessDatesExtension, platformModalService,
				moduleContext, parentService, basicsLookupdataLookupDescriptorService, basicsCommonContractChangeDataProcessor) {

				var serviceOption = {
					hierarchicalLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementContractCallOffsDataService',
						entityNameTranslationID: 'procurement.contract.callOffsContainer',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/contract/callOffs/',
							endRead: 'tree',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								// readData.filter = '?mainItemId=' + parentService.getSelected().Id;
								readData.MainItemId = parentService.getSelected().Id;
							}
						},
						presenter: {
							tree: {
								parentProp: 'ConHeaderFk',
								childProp: 'ChildItems',
								initialState: 'expanded',
								initCreationData: function initCreationData(creationData) {
									var parentHeader = parentService.getSelected();
									creationData.mainItemId = parentHeader.ConHeaderFk;
									if (creationData.mainItemId === null) {
										creationData.mainItemId = parentHeader.Id;
									}
								},
								incorporateDataRead: incorporateDataRead
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['DateOrdered', 'DateReported', 'DateCanceled', 'DateDelivery', 'DateCallofffrom', 'DateCalloffto', 'DateQuotation', 'ConfirmationDate', 'DatePenalty', 'DateEffective'])],
						entityRole: {
							leaf: {
								itemName: 'CallOffs',
								parentService: parentService,
								doesRequireLoadAlways: false
							}
						},
						translation: {
							uid: 'procurementContractCallOffsDataService',
							title: 'procurement.contract.callOffsContainer',
							columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
							dtoScheme: {
								typeName: 'ConHeaderDto',
								moduleSubModule: 'Procurement.Contract'
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				// load lookup items, and cache in front end.
				basicsLookupdataLookupDescriptorService.loadData(['packageStatus', 'prcconfiguration', 'prcconfig2strategy', 'constatus']);

				function incorporateDataRead(readData, data) {
					return basicsCommonContractChangeDataProcessor.doReadData(service, parentService, readData, data);
				}

				var canCreate = serviceContainer.service.canCreate;
				service.canCreate = function () {
					var parentHeader = parentService.getSelected();
					if (_.isUndefined(parentHeader)) {
						return false;
					} else if (parentHeader && parentHeader.ProjectChangeFk !== null) {
						return false;
					} else if (parentHeader && parentHeader.IsFramework){
						return false;
					}
					return canCreate();
				};

				var canDelete = serviceContainer.service.canDelete;
				service.canDelete = function () {
					return canDelete();
				};

				var createItem = serviceContainer.service.createItem;
				var createChildItem = serviceContainer.service.createChildItem;
				service.createItem = function () {
					var sel = service.getSelected();
					if (sel && sel.HasChildren === false) {
						return createItem();
					}
					return createChildItem();
					// return basicsCommonContractChangeDataProcessor.doCallOffCreateItem(service, parentService, 'procurement/contract/change/getchangeid?mainItemId=', createItem, createChildItem);
				};
				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
					return basicsCommonContractChangeDataProcessor.doOnCreateSucceeded(service, parentService, created, data, creationData, onCreateSucceeded, serviceContainer.data);
				};

				service.deleteEntities = function () {
					basicsCommonContractChangeDataProcessor.doDeleteItem(service, parentService, 'procurement/contract/callOffs/delete', serviceContainer.data);
				};

				return service;
			}]);
})(angular);
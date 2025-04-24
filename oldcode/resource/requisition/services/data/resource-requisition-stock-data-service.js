/**
 * Created by shen on 10/12/2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.requisition');

	/**
	 * @ngdoc service
	 * @name resourceRequisitionStockDataService
	 * @description provides methods to access, create and update resource enterprise reservation entities
	 */
	myModule.service('resourceRequisitionStockDataService', ResourceRequisitionStockDataService);

	ResourceRequisitionStockDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceRequisitionItemDataService', 'platformRuntimeDataService'];

	function ResourceRequisitionStockDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                             basicsCommonMandatoryProcessor, resourceRequisitionItemDataService, platformRuntimeDataService) {

		var self = this;

		var resourceRequisitionStockServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceRequisitionStockDataService',
				entityNameTranslationID: 'StockTotalVEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/requisition/stocktotal_v/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceRequisitionItemDataService.getSelected();
						readData.PKey1 = selected.StockFk;
						readData.PKey2 = selected.MaterialFk;

					}
				},
				actions: {delete: false, create: false, bulk: false},

				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'StockTotalVDto',
						moduleSubModule: 'Resource.Requisition'
					}
				), {processItem: setContainerToReadOnly}],

				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceRequisitionItemDataService.getSelected();
							creationData.PKey1 = selected.StockFk;
							creationData.PKey2 = selected.MaterialFk;
						}
					}
				},
				entityRole: {
					node: {
						itemName: 'StockTotal',
						parentService: resourceRequisitionItemDataService,
						doesRequireLoadAlways: true
					}
				}
			}
		};

		function setContainerToReadOnly(item) {
			platformRuntimeDataService.readonly(item, true);
		}

		var serviceContainer = platformDataServiceFactory.createService(resourceRequisitionStockServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceRequisitionStockTotalValidationService'
		}, null));
	}
})(angular);

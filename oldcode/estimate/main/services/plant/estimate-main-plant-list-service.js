/**
 * Created by xia on 4/3/2024.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let estimateMainModule = angular.module('estimate.main');

	/**
	 * @ngdoc service
	 * @name estimateMainPlantListService
	 * @function
	 *
	 * @description
	 * estimateMainPlantListService is the data service for all index header related functionality.
	 */
	estimateMainModule.factory('estimateMainPlantListService', ['$translate', '$injector', '_', 'platformDataServiceFactory', 'PlatformMessenger', 'platformDataServiceDataProcessorExtension',
		'estimateMainPlantListColumnGenerateService', 'estimateMainService',
		function ($translate, $injector, _, platformDataServiceFactory, PlatformMessenger, platformDataServiceDataProcessorExtension, estimateMainPlantListColumnGenerateService, estimateMainService) {

			let mdcCostCodes = [];
			let isCalcTotalWithWq = estimateMainService.getEstTypeIsTotalWq();

			let serviceOption = {
				flatRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainPlantListService',
					entityNameTranslationID: 'estimate.main.plantList',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'estimate/main/plantlist/',
						usePostForRead: true,
						endRead: 'generatedFromEstimate',
						initReadData: function initReadData(readData) {
							readData.ProjectFk = estimateMainService.getSelectedProjectId() || -1;
							readData.EstHeaderFk = estimateMainService.getSelectedEstHeaderId() || -1;
							readData.IsCalcTotalWithWq = isCalcTotalWithWq;
						}
					},
					translation: {
						uid: 'estimateMainPlantListService',
						title: 'estimate.main.plantList'
					},
					entityRole: {
						root: {
							itemName: 'EstPlantListToSave',
							moduleName: 'estimate.main'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (result, data) {
								estimateMainPlantListColumnGenerateService.refreshGrid(result.MdcCostCodes || [], result.PrjCostCodes || []);
								service.setMdcCostCodes(result.MdcCostCodes || []);
								serviceContainer.data.handleReadSucceeded(result.Data || [], data);
								service.onDataRead.fire();
							}
						}
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			serviceContainer.data.updateOnSelectionChanging = false;

			let service = serviceContainer.service;

			serviceContainer.data.isRealRootForOpenedModule = function isRealRootForOpenedModule() {
				return false;
			};

			service.handleUpdateDone = function (updateData, response, data, handleItem) {
				serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
			};

			service.setMdcCostCodes = function (value) {
				mdcCostCodes = value;
			};

			service.getMdcCostCodes = function () {
				return mdcCostCodes;
			};

			service.setIsCalcTotalWithWq = function(value){
				isCalcTotalWithWq = value;
			}

			service.onDataRead = new PlatformMessenger();

			return service;

		}]);
})(angular);

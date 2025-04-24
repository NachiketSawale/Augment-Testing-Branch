/**
 * Created by clv on 4/24/2018.
 */

(function(angular){

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.quote';

	angular.module(moduleName).factory('procurementQuoteRfqDocumentParentService', procurementQuoteRfqDocumentParentService);
	procurementQuoteRfqDocumentParentService.$inject = ['platformDataServiceFactory', 'procurementQuoteRequisitionDataService'];

	function procurementQuoteRfqDocumentParentService(platformDataServiceFactory, dataService){

		var serviceContainer = platformDataServiceFactory.createNewComplete({
			module : angular.module(moduleName),
			serviceName : 'procurementQuoteRfqDocumentParentService'
		});
		var service = serviceContainer.service;

		service.getSelected = function(){

			var selectedItem = dataService.getSelected();
			return selectedItem ? selectedItem.ReqHeaderEntity : null;
		};

		service.documentCreateItem = false;
		service.documentDeleteItem = false;
		service.documentUploadItem = false;
		service.containerReadonly = true;
		service.markName = 'procurementQuoteReqService';
		service.isGivenParentService = true;
		dataService.registerSelectionChanged(function(){

			var itemServices = service.itemService;
			if(itemServices && itemServices.length > 0){
				if(dataService.parentService && dataService.parentService().getSelected) {
					var mainItem = dataService.parentService().getSelected();
					if (mainItem && mainItem.IsBidderDeniedRequest && angular.isFunction(itemServices[0].setList)) {
						itemServices[0].setList([]);
						return;
					}
				}
				if(angular.isFunction(itemServices[0].load)){
					itemServices[0].load();
				}
			}
		});
		service.registerSelectionChanged = function(fn){
			dataService.registerSelectionChanged(fn);
		};
		service.itemService = [];
		service.registerChildService = function(itemService){
			service.itemService.push(itemService);
		};

		service.parentService = function(){
			return null;
		};

		service.canMultipleUploadFiles = function () {
			return false;
		};

		service.canUploadFiles = function () {
			return false;
		};

		return service;
	}

})(angular);
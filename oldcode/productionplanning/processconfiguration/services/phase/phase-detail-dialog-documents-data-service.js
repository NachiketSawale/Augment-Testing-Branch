
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('productionplanningProcessConfigurationPhaseDetailDialogDocumentsDataService', PhaseDetailDialogDocumentsDataService);

	PhaseDetailDialogDocumentsDataService.$inject = [
		'ppsProductionPlacePlanningBoardAssignmentService',
		'ppsCommonGenericDocumentDataServiceFactory',
		'platformRuntimeDataService'];

	function PhaseDetailDialogDocumentsDataService(
		ppsProductionPlacePlanningBoardAssignmentService,
		ppsCommonGenericDocumentDataServiceFactory,
		platformRuntimeDataService) {

		const serviceOptions = {
			module: 'productionplanning.product',
			entityNameTranslationID: 'productionplanning.product.documentListTitle',
			serviceName: 'ppsProductGenericDocumentDataService',
			parentServiceName: 'productionplanningProductMainService',
			url: 'productionplanning/common/product/document/',
			parentFilter: 'productFk',
			uploadServiceKey: 'pps-product',
			createBtn: true,
			deleteBtn: true,
			readonlyKeys: 'PRODUCTTEMPLATE',
			dataProcessor: [{
				processItem: (item) => {
					if (item.Version > 0) {
						platformRuntimeDataService.readonly(item, [{ field: 'From', readonly: true }]);
					}
				}
			}]
		};

		const service = ppsCommonGenericDocumentDataServiceFactory.createNewComplete(serviceOptions);

		function createTempProductFromPhase(phase) {
			const tempProd = {
				Id: phase.PpsProductFk
			};
			return tempProd;
		}
		service.getSelected = () => {
			const selectedPhase = ppsProductionPlacePlanningBoardAssignmentService.getSelected();
			const parentSelectedProduct = service.parentService().getSelected();

			const tempProd = createTempProductFromPhase(selectedPhase);

			if (parentSelectedProduct && tempProd.Id !== parentSelectedProduct.Id) {
				service.parentService().setSelected(createTempProductFromPhase(selectedPhase));
			}
			return selectedPhase;
		};

		if (service.parentService().getSelected()) {
			service.originalSelectedProduct = service.parentService().getSelected();
		}

		// pre-select product of selected phase
		service.getSelected();

		service.isSubItemService = () => false;

		return service;
	}
})(angular);

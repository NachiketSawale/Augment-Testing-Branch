(function (angular) {
	'use strict';

	const moduleName = 'logistic.plantsupplier';
	angular.module(moduleName).service('logisticPlantSupplyWizardService', LogisticPlantSupplyWizardService);

	LogisticPlantSupplyWizardService.$inject = ['logisticPlantSupplierDataService', 'logisticPlantSupplyItemDataService', 'basicsCommonChangeStatusService'];

	function LogisticPlantSupplyWizardService(logisticPlantSupplierDataService, logisticPlantSupplyItemDataService, basicsCommonChangeStatusService) {
		let setPlantSupplyItemStatus = function setPlantSupplyItemStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: logisticPlantSupplierDataService,
					dataService: logisticPlantSupplyItemDataService,
					statusField: 'PlantSupplyItemStatusFk',
					codeField: 'Code',
					descField: 'Description',
					projectField: '',
					title: 'logistic.plantsupplier.plantsupplyitemstatus',
					statusName: 'logisticplantsupplyitemstatus',
					updateUrl: 'logistic/plantsupplier/item/changestatus',
					id: 1,
					doStatusChangePostProcessing: function (item, data){
						logisticPlantSupplyItemDataService.setReadOnly(data.IsReadonly, item);
					}
				}
			);
		};
		this.setPlantSupplyItemStatus = setPlantSupplyItemStatus().fn;
	}

})(angular);

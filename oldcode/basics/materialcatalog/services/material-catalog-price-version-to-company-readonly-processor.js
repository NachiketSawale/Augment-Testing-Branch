/**
 * Created by chi on 6/2/2017.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersion2CompanyReadonlyProcessor', basicsMaterialCatalogPriceVersion2CompanyReadonlyProcessor);
	basicsMaterialCatalogPriceVersion2CompanyReadonlyProcessor.$inject = ['basicsCommonReadOnlyProcessor', 'basicsMaterialCatalogPriceVersionService'];
	function basicsMaterialCatalogPriceVersion2CompanyReadonlyProcessor(commonReadOnlyProcessor, basicsMaterialCatalogPriceVersionService) {

		var service = commonReadOnlyProcessor.createReadOnlyProcessor({
			typeName: 'PriceVersionUsedCompanyDto',
			moduleSubModule: 'Basics.MaterialCatalog',
			readOnlyFields: ['Checked']
		});

		service.handlerItemReadOnlyStatus = handlerItemReadOnlyStatus;
		service.getCellEditable = getCellEditable;

		return service;

		// /////////////////////////
		function handlerItemReadOnlyStatus(item) {
			var readOnyStatus = false, catalog = basicsMaterialCatalogPriceVersionService.parentService().getSelected();
			if (catalog) {
				readOnyStatus = catalog.MdcContextFk !== item.ContextFk;
			}
			service.setRowReadOnly(item, readOnyStatus);
			return readOnyStatus;
		}

		function getCellEditable(item, model) {
			var editable = true;
			if (angular.isDefined(item)) {
				if (model === 'Checked') {
					var catalog = basicsMaterialCatalogPriceVersionService.parentService().getSelected();
					if (catalog) {
						editable = (catalog.MdcContextFk === item.ContextFk);
					}
				}
			}
			return editable;
		}
	}
})(angular);
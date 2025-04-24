(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';


	angular.module(moduleName).factory('basicsCostcodesPriceVersionCompanyReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'basicsCostCodesPriceVersionDataService',
			function (commonReadOnlyProcessor, headerDataService) {

				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'CostCodesUsedCompanyDto',
					moduleSubModule: 'Basics.CostCodes',
					readOnlyFields: ['IsChecked']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					let readOnyStatus = false, header = headerDataService.getSelected();
					if (header) {
						readOnyStatus = header.ContextFk !== item.MdcContextFk;
					}
					service.setRowReadOnly(item, readOnyStatus);
					return readOnyStatus;
				};


				service.getCellEditable = function getCellEditable(item, model) {
					let editable = true;
					if (angular.isDefined(item)) {
						if (model === 'IsChecked') {
							let header = headerDataService.getSelected();
							if (header) {
								editable = (header.ContextFk === item.MdcContextFk);
							}
						}
					}
					return editable;
				};

				return service;

			}]);
})(angular);
/**
 * Created by lcn on 5/8/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businessPartnerMainGeneralsReadOnlyProcessor', ['basicsCommonReadOnlyProcessor', 'businesspartnerMainHeaderDataService', function (commonReadOnlyProcessor, headerDataService) {

		var service = commonReadOnlyProcessor.createReadOnlyProcessor({
			typeName: 'GeneralsDto',
			moduleSubModule: 'BusinessPartner.Main',
			readOnlyFields: ['ControllingUnitFk', 'TaxCodeFk']
		});

		var itemStatus, readOnyStatus;

		service.handlerItemReadOnlyStatus = function (item) {
			itemStatus = headerDataService.getItemStatus();
			if (itemStatus) {
				readOnyStatus = itemStatus.IsReadonly;
			} else {
				readOnyStatus = false;
			}
			service.setRowReadOnly(item, readOnyStatus);
			return readOnyStatus;
		};

		service.getCellEditable = function getCellEditable(item, model) {
			switch (model) {
				case 'ControllingUnitFk':
				case 'TaxCodeFk':
					return item.IsCost;
				default :
					return true;
			}
		};

		return service;

	}]);
})(angular);

/**
 * Created by lcn on 5/8/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businessPartnerMainUnitgroupReadOnlyProcessor', ['basicsCommonReadOnlyProcessor', function (commonReadOnlyProcessor) {

		var service = commonReadOnlyProcessor.createReadOnlyProcessor({
			typeName: 'Bp2controllinggroupDto',
			moduleSubModule: 'BusinessPartner.Main',
			readOnlyFields: ['ControllinggrpdetailFk']
		});

		service.handlerItemReadOnlyStatus = function (item) {
			service.setFieldsReadOnly(item);
		};

		service.getCellEditable = function getCellEditable(item, model) {
			switch (model) {
				case 'ControllinggrpdetailFk':
					return item.ControllinggroupFk > 0;
				default :
					return true;
			}
		};

		return service;

	}]);
})(angular);

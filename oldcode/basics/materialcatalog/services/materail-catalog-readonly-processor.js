/**
 * Created by wuj on 6/10/2015.
 */
(function (angular) {
	'use strict';
	angular.module('basics.materialcatalog').factory('basicsMaterialCatalogReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', function (commonReadOnlyProcessor) {
			var service = commonReadOnlyProcessor.createReadOnlyProcessor({
				readOnlyFields: ['SubsidiaryFk']
			});

			service.handlerItemReadOnlyStatus = function (item) {
				service.setFieldsReadOnly(item);
			};

			service.getCellEditable = function getCellEditable(item, model) {
				switch (model) {
					case 'SubsidiaryFk':
						return !!item.BusinessPartnerFk;
					default :
						return true;
				}
			};
			return service;
		}]);
})(angular);
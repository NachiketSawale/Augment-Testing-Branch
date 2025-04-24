/**
 * Created by lvy on 4/26/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainInstanceHeaderParameterReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor','basicsLookupdataLookupDescriptorService',
			function (commonReadOnlyProcessor,basicsLookupdataLookupDescriptorService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InstanceHeaderParameterDto',
					moduleSubModule: 'ConstructionSystem.Main',
					readOnlyFields: ['ParameterValueVirtual']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'ParameterValueVirtual':
							var parameterItem;
							var items = basicsLookupdataLookupDescriptorService.getData('cosglobalparam');
							if (items) {
								parameterItem = items[item.CosGlobalParamFk];
							}
							return !!(parameterItem);
						default :
							return false;
					}
				};
				return service;
			}]);

})(angular);
(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainInstanceParameterReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor','basicsLookupdataLookupDescriptorService',
			function (commonReadOnlyProcessor,basicsLookupdataLookupDescriptorService) {



				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'Instance2ObjectParamDto',
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
							var items = basicsLookupdataLookupDescriptorService.getData('CosParameter');
							if (items) {
								parameterItem = items[item.ParameterFk];
							}
							return !!(parameterItem && parameterItem.AggregateType === 0);
						default :
							return false;
					}
				};


				return service;
			}]);

})(angular);
(function (angular) {

	'use strict';
	/* jshint -W074 */
	angular.module('basics.common').factory('cashFlowProjectionReadonlyProcessor',
		['basicsCommonReadOnlyProcessor',
			function (commonReadOnlyProcessor) {
				const service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'CashProjectionDetailDto',
					moduleSubModule: 'Basics.Common',
					readOnlyFields: ['CumCost', 'CumCash', 'PeriodCost', 'PeriodCash']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				/* jshint -W074 */
				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'CumCost':
							return !(item.ActPeriodCash > 0 || item.ActPeriodCost > 0);
						case 'CumCash':
							return !(item.ActPeriodCash > 0 || item.ActPeriodCost > 0);
						case 'PeriodCost':
							return !(item.ActPeriodCash > 0 || item.ActPeriodCost > 0);
						case 'PeriodCash':
							return !(item.ActPeriodCash > 0 || item.ActPeriodCost > 0);
						default :
							return true;
					}
				};
				return service;
			}]);

})(angular);
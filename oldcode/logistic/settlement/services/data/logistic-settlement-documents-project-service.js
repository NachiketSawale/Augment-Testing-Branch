
(function (angular) {
	'use strict';

	angular.module('logistic.settlement').factory('logisticSettlementDocumentsProjectService',
		['documentsProjectDocumentDataService', 'logisticSettlementDataService',
			function (documentsProjectDocumentDataService, mainService) {

				function register() {

					var config = {
						moduleName: 'logistic.settlement',
						parentService: mainService,
						title: 'logistic.settlement.titleLogisticSettlement',
						columnConfig: [
							{documentField: 'LgmSettlementFk', dataField: 'Id', readOnly: false}
						],
						subModules: []
					};
					documentsProjectDocumentDataService.register(config);
				}

				function unRegister() {
					documentsProjectDocumentDataService.unRegister();
				}

				return {
					register: register,
					unRegister: unRegister
				};
			}]);
})(angular);
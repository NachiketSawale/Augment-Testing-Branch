
(function (angular) {
	'use strict';

	angular.module('logistic.dispatching').factory('logisticDispatchingDocumentsProjectService',
		['documentsProjectDocumentDataService', 'logisticDispatchingHeaderDataService',
			function (documentsProjectDocumentDataService, mainService) {

				function register() {

					var config = {
						moduleName: 'logistic.dispatching',
						parentService: mainService,
						title: 'logistic.dispatching.titleLogisticDispatching',
						columnConfig: [
							{documentField: 'LgmDispatchHeaderFk', dataField: 'Id', readOnly: false}
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

(function (angular) {
	'use strict';

	angular.module('logistic.job').factory('logisticJobDocumentsProjectService',
		['documentsProjectDocumentDataService', 'logisticJobDataService',
			function (documentsProjectDocumentDataService, mainService) {

				function register() {

					var config = {
						moduleName: 'logistic.job',
						parentService: mainService,
						title: 'logistic.job.titleLogisticJob',
						columnConfig: [
							{documentField: 'LgmJobFk', dataField: 'Id', readOnly: false}
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
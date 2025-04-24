/**
 * Created by alm on 9/23/2021.
 */
(function (angular) {
	'use strict';
	angular.module('hsqe.checklist').factory('hsqeCheckListDocumentReadonlyProcessor',
		['platformRuntimeDataService', 'basicsCommonReadOnlyProcessor', 'hsqeCheckListDataService',
			function (platformRuntimeDataService, commonReadOnlyProcessor, parentService) {
				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'HsqCheckListDocumentDto',
					moduleSubModule: 'Hsqe.CheckList',
					readOnlyFields: []
				});

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnlyStatus = !parentService.getHeaderEditAble();
					service.setRowReadOnly(item, readOnlyStatus);

					if (!readOnlyStatus) {
						platformRuntimeDataService.readonly(item, [{field: 'DocumentTypeFk', readonly: !!item.FileArchiveDocFk}]);
					}

					return readOnlyStatus;
				};

				return service;
			}]);

})(angular);
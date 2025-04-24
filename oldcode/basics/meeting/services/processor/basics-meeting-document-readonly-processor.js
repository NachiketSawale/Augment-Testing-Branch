/**
 * Created by chd on 03/31/2022.
 */

(function (angular) {
	'use strict';

	let moduleName='basics.meeting';

	angular.module(moduleName).factory('basicsMeetingDocumentReadonlyProcessor',
		['platformRuntimeDataService', 'basicsCommonReadOnlyProcessor', 'basicsMeetingMainService',
			function (platformRuntimeDataService, commonReadOnlyProcessor, parentService) {
				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'MtgDocumentDto',
					moduleSubModule: 'Basics.Meeting',
					readOnlyFields: []
				});

				service.handlerItemReadOnlyStatus = function (item) {
					let readOnlyStatus = !parentService.getHeaderEditAble();
					service.setRowReadOnly(item, readOnlyStatus);

					if (!readOnlyStatus) {
						platformRuntimeDataService.readonly(item, [{field: 'DocumentTypeFk', readonly: !!item.FileArchiveDocFk}]);
					}

					return readOnlyStatus;
				};

				return service;
			}]);

})(angular);
/**
 * Created by chd on 03/31/2022.
 */

(function (angular) {
	'use strict';

	let moduleName='basics.clerk';

	angular.module(moduleName).factory('clerkDocumentReadonlyProcessor',
		['platformRuntimeDataService', 'basicsCommonReadOnlyProcessor', 'basicsClerkMainService',
			function (platformRuntimeDataService, commonReadOnlyProcessor, parentService) {
				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'Clerk2documentDto',
					moduleSubModule: 'Basics.Clerk',
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
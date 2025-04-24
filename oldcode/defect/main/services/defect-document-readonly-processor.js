/**
 * Created by chd on 03/31/2022.
 */

(function (angular) {
	'use strict';

	let moduleName='defect.main';

	angular.module(moduleName).factory('defectDocumentReadonlyProcessor',
		['platformRuntimeDataService', 'basicsCommonReadOnlyProcessor', 'defectMainHeaderDataService',
			function (platformRuntimeDataService, commonReadOnlyProcessor, parentService) {
				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'DfmDocumentDto',
					moduleSubModule: 'Defect.Main',
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
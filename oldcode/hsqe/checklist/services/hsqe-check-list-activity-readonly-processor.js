/**
 * Created by alm on 9/23/2021.
 */
(function (angular) {
	'use strict';
	angular.module('hsqe.checklist').factory('hsqeCheckListActivityReadonlyProcessor',
		['platformRuntimeDataService', 'basicsCommonReadOnlyProcessor', 'hsqeCheckListDataService',
			function (platformRuntimeDataService, commonReadOnlyProcessor, parentService) {
				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'HsqCheckList2ActivityDto',
					moduleSubModule: 'Hsqe.CheckList',
					readOnlyFields: []
				});

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnlyStatus = !parentService.getHeaderEditAble();
					service.setRowReadOnly(item, readOnlyStatus);
					return readOnlyStatus;
				};

				return service;
			}]);

})(angular);
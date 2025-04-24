/**
 * Created by lja on 2016-3-8.
 */

(function (angular) {
	'use strict';

	angular.module('scheduling.main').factory('schedulingMainDocumentsProjectService',
		['documentsProjectDocumentDataService', 'schedulingMainService',
			function (documentsProjectDocumentDataService, mainService) {

				function register() {

					var config = {
						moduleName: 'scheduling.main',
						parentService: mainService,
						title: 'scheduling.main.entityActivity',
						columnConfig: [
							{documentField: 'PsdActivityFk', dataField: 'Id', readOnly: false},
							{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
							{
								documentField: 'MdcControllingUnitFk',
								dataField: 'ControllingUnitFk',
								readOnly: true
							},
							{documentField: 'PrjLocationFk', dataField: 'LocationFk', readOnly: true},
							{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
						],
						subModules: [
							{
								service: 'schedulingSchedulePresentService',
								title: 'Schedule',
								columnConfig: [
									{documentField: 'PsdScheduleFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false}
								]
							}
						]
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
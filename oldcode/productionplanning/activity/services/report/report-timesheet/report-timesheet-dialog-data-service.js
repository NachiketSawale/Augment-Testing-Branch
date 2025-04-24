/**
 * Created by anl on 4/11/2018.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).constant('activityReportTimeSheetResourceDialogListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Kind',
						field: 'KindFk',
						name: 'Resource Kind',
						formatter: 'description',
						name$tr$: ''
					},
					{
						id: 'ValidFrom',
						field: 'Validfrom',
						name: 'Valid From',
						formatter: 'dateutc',
						name$tr$: ''
					},
					{
						id: 'ValidTo',
						field: 'Validto',
						name: 'Valid To',
						formatter: 'dateutc',
						name$tr$: ''
					}
				]
			};
		}
	});

	angular.module(moduleName).factory('activityReportTimeSheetResourceDialogListService', TimeSheetResourceDialogListService);
	TimeSheetResourceDialogListService.$inject = ['treeviewListDialogListFactoryService', '$injector'];
	function TimeSheetResourceDialogListService(treeviewListDialogListFactoryService, $injector) {

		var moduleId = 'ec2e2391b6c74b0099c5c9d42473caf2';
		var serviceOptions = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'activityReportTimeSheetResourceDialogListService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/master/pool/',
					endRead: 'ListForTimeSheet'
				},
				actions: {},
				entityRole: {
					root: {
						itemName: 'Resource',
						descField: 'DescriptionInfo.Translated'
					}
				}
			}
		};

		var serviceContainer = treeviewListDialogListFactoryService.getService(moduleId, serviceOptions, undefined, true);

		serviceOptions.getUrlFilter = function getUrlFilter() {
			var activityEntity = $injector.get('productionplanningActivityActivityDataService').getSelected();
			return 'PpsEventId=' + activityEntity.PpsEventFk;
		};

		return serviceContainer.service;
	}
})(angular);
/**
 * Created by anl on 1/23/2017.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName).constant('productionplanningReportTimeSheetDialogResourceListColumns', {
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

	angular.module(moduleName).factory('productionplanningReportTimeSheetDialogResourceListService', TimeSheetDialogResourceListService);
	TimeSheetDialogResourceListService.$inject = ['treeviewListDialogListFactoryService', '$injector',
		'productionplanningReportContainerInformationService'];
	function TimeSheetDialogResourceListService(treeviewListDialogListFactoryService, $injector,
												reportContainerInformationService) {

		var moduleId = 'fe781ce6e7cb40118ca04a65bcfddbf9';
		var serviceOptions = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'productionplanningReportTimeSheetDialogResourceListService',
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
			var timeSheetContainerInfo = reportContainerInformationService.getContainerInfoByGuid('60e9be6e838748bc8e972d8e31d8e7fb');
			var timeSheetDataService = timeSheetContainerInfo.dataServiceName;
			var activityEntity = timeSheetDataService.GetActivityEntity();
			return 'PpsEventId=' + activityEntity.PpsEventFk;
		};

		return serviceContainer.service;
	}
})();
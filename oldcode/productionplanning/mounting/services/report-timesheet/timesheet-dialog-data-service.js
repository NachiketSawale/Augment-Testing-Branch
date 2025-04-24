/**
 * Created by anl on 11/3/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	angular.module(moduleName).constant('timeSheetDialogResourceListColumns', {
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

	angular.module(moduleName).factory('timeSheetDialogResourceListService', TimeSheetDialogResourceListService);
	TimeSheetDialogResourceListService.$inject = ['treeviewListDialogListFactoryService', 'productionplanningMountingContainerInformationService'];
	function TimeSheetDialogResourceListService(treeviewListDialogListFactoryService, mountingContainerInformationService) {

		var moduleId = 'fe781ce6e7cb40118ca04a65bcfddbf9';
		var serviceOptions = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'timeSheetDialogResourceListService',
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

		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		serviceOptions.getUrlFilter = function getUrlFilter() {
			var activityEntity = dynamicActivityService.getSelected();
			return 'PpsEventId=' + activityEntity.PpsEventFk;
		};

		return serviceContainer.service;
	}
})(angular);
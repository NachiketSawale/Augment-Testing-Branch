/**
 * Created by lid on 9/15/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('activityDialogResRequisitionListUIService', ActivityDialogResRequisitionListUIService);
	ActivityDialogResRequisitionListUIService.$inject = ['platformTranslateService', 'basicsLookupdataConfigGenerator'];
	function ActivityDialogResRequisitionListUIService(platformTranslateService, basicsLookupdataConfigGenerator) {
		var service = {};

		var gridColumns = [
			{
				id: 'Description',
				field: 'Description',
				name: 'Description',
				formatter: 'description',
				name$tr$: 'cloud.common.entityDescription',
				width: 150
			},
			{
				id: 'resRequisitionStatus',
				field: 'RequisitionStatusFk',
				name: 'RequisitionStatusFk',
				name$tr$: 'cloud.common.entityStatus',
				width: 100,
				sortable: true,
				formatter: 'lookup',
				formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resrequisitionstatus').grid.formatterOptions
			},
			{
				id: 'RequestedFrom',
				field: 'RequestedFrom',
				name: 'RequestedFrom',
				formatter: 'description',
				name$tr$: 'resource.requisition.entityRequestedFrom',
				width: 150
			},
			{
				id: 'RequestedTo',
				field: 'RequestedTo',
				name: 'RequestedTo',
				formatter: 'description',
				name$tr$: 'resource.requisition.entityRequestedTo',
				width: 150
			},
			{
				id: 'TrsRequisitionFk',
				field: 'TrsRequisitionFk',
				name: 'TrsRequisitionFk',
				name$tr$: 'resource.requisition.entityTrsRequisitionFk',
				width: 120,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'trsrequisition',
					displayMember: 'Code',
					version: 3
				}
			},
			{
				id: 'ProjectFk',
				field: 'ProjectFk',
				name: 'Project Name',
				name$tr$: 'cloud.common.entityProject',
				width: 100,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'project',
					displayMember: 'ProjectNo'
				}
			}
			/*,{
			 id: 'PpsEventFk',
			 field: 'PpsEventFk',
			 name: 'PpsEvent',
			 name$tr$: 'PpsEvent',
			 formatter: 'description'
			 }*/
		];

		platformTranslateService.translateGridConfig(gridColumns);

		angular.extend(service, {
			getStandardConfigForListView: getStandardConfigForListView
		});

		return service;

		function getStandardConfigForListView() {
			return {
				columns: gridColumns
			};
		}
	}


	angular.module(moduleName).factory('activityDialogResRequisitionListService', ActivityResRequisitionDialogListService);
	ActivityResRequisitionDialogListService.$inject = ['platformDataServiceFactory', 'productionplanningMountingContainerInformationService'];
	function ActivityResRequisitionDialogListService(platformDataServiceFactory, mountingContainerInformationService) {

		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		var serviceOptions = {
			flatLeafItem: {
				serviceName: 'activityDialogResRequisitionListService',
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/requisition/',
					endRead: 'lookuplist'
				},
				entityRole: {
					leaf: {
						itemName: 'ResRequisition',
						parentService: dynamicActivityService
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							//filter by project
							var parentItem = dynamicActivityService.getSelected();
							var projectId = (parentItem.ProjectFk) ? parentItem.ProjectFk : parentItem.ProjectId;
							var dtos = [];
							_.each(readData, function (item) {
								if (item.ProjectFk === projectId || item.ProjectFk === null) {
									dtos.push(item);
								}
							});
							dtos = _.orderBy(dtos, ['ProjectFk'], ['asc']);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: dtos || []
							};

							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				}
			}
		};

		// var serviceContainer = platformDataServiceFactory.getService(moduleId, serviceOptions, undefined, true);

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		return serviceContainer.service;
	}
})(angular);
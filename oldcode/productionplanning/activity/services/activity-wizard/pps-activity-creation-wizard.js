/**
 * Created by anl on 8/20/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).service('productionpalnningActivityCreationWizardService', MntActivityCreationWizardService);

	MntActivityCreationWizardService.$inject = ['$http', '$injector', '$translate',
		'platformTranslateService',
		'platformModalFormConfigService',
		'platformModalService',
		'basicsLookupdataLookupFilterService',
		'cloudCommonGridService',
		'basicsLookupdataLookupDescriptorService'];

	function MntActivityCreationWizardService($http, $injector, $translate,
											  platformTranslateService,
											  platformModalFormConfigService,
											  platformModalService,
											  basicsLookupdataLookupFilterService,
											  cloudCommonGridService,
											  basicsLookupdataLookupDescriptorService) {
		var self = this;

		var wizardTitle = 'productionplanning.activity.activityWizard.actWizardTitle';
		var project = [];

		var filters = [
			{
				key: 'mounting-requisition-project-filter',

				fn: function (item) {
					//return _.find(projects, {Id: item.ProjectFk});
					return item.ProjectFk === project;
				}
			},
			{
				key: 'mounting-activity-event-type-filter',

				fn: function (item) {
					if (item) {
						return item.PpsEntityFk === 1;
					}
					return false;
				}
			}
		];

		function setProject(psdActivityService) {
			// $http.get(globals.webApiBaseUrl + 'project/main/list').then(function (response) {
			// 	projects = response.data;
			// });
			project = _.first(_.map(psdActivityService.getSelectedEntities(), 'ProjectFk'));
		}


		basicsLookupdataLookupFilterService.registerFilter(filters);

		self.showGenerateMntActivityWizardDialog = function showGenerateMntActivityWizardDialog() {
			var psdActivityService = $injector.get('schedulingMainService');
			setProject(psdActivityService);
			var originList = [];
			var pinnedProject = psdActivityService.getPinningContext();

			var modalCreateMntActivityConfig = {
				title: $translate.instant(wizardTitle),
				//resizeable: true,
				dataItem: {mntRequisitionId: '', eventTypeId: '', createAll: ''},
				formConfiguration: {
					fid: wizardTitle,
					version: '0.2.4',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['info']
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'mntRequisitionId',
							label: 'Mounting Requisition',
							label$tr$: 'productionplanning.mounting.entityRequisition',
							model: 'mntRequisitionId',
							sortOrder: 1,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'productionplanning-mounting-requisition-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'mounting-requisition-project-filter'
								}
							}
						},
						{
							gid: 'baseGroup',
							rid: 'eventTypeId',
							label: 'Activity Type',
							label$tr$: 'productionplanning.activity.activity.eventTypeFk',
							model: 'eventTypeId',
							sortOrder: 2,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									filterKey: 'mounting-activity-event-type-filter'
								},
								lookupDirective: 'productionplanning-common-event-type-lookup',
								descriptionMember: 'DescriptionInfo.Description'
							}
						}, {
							gid: 'baseGroup',
							rid: 'createAll',
							label: 'Create-All',
							label$tr$: 'productionplanning.activity.activityWizard.createAll',
							model: 'createAll',
							sortOrder: 3,
							type: 'boolean'
						}
					]
				},
				handleOK: function handleOK(result) {
					if (result.data.mntRequisitionId === '') {
						self.showInfoDialog('noRequisitionSelectedError');
					}
					else if (result.data.eventTypeId === '') {
						self.showInfoDialog('noEventSelectedType');
					}
					else if (result.data.createAll !== '') {
						if (pinnedProject) {
							originList = psdActivityService.getList();
							self.createMntActivity(result.data.mntRequisitionId, result.data.eventTypeId, originList);
						}
						else {
							originList = psdActivityService.getSelectedEntities();
							self.createMntActivity(result.data.mntRequisitionId, result.data.eventTypeId, originList);
						}
					}
					else {
						originList = psdActivityService.getSelectedEntities();
						self.createMntActivity(result.data.mntRequisitionId, result.data.eventTypeId, originList);
					}
				}
			};


			basicsLookupdataLookupDescriptorService.removeData('EventType');
			basicsLookupdataLookupDescriptorService.loadData('EventType').then(function (response) {
				var result = _.find(response, function (eventType) {
					// PpsEntity=1 means mntActivity
					return eventType.IsDefault && eventType.PpsEntityFk === 1;
				});
				if (result) {
					modalCreateMntActivityConfig.dataItem.eventTypeId = result.Id;
				}

				platformTranslateService.translateFormConfig(modalCreateMntActivityConfig.formConfiguration);
				platformModalFormConfigService.showDialog(modalCreateMntActivityConfig);
			});
		};

		self.sortPsdActivities = function (list) {
			var flattenPsdActivities = cloudCommonGridService.flatten(list, [], 'Activities');
			var psdActivities = _.filter(flattenPsdActivities, function (psdActivity) {
				return psdActivity.ActivityTypeFk === 1;
			});
			psdActivities = _.uniq(psdActivities);
			return psdActivities;
		};

		self.setCreateData = function (mntRequisitionId, eventTypeId, originPsdActivities) {
			var psdActivities = [];
			_.forEach(originPsdActivities, function (originPsdActivity) {
				var psdActivity = {
					Id: originPsdActivity.Id,
					Code: originPsdActivity.Code,
					DescriptionInfo: {Description: originPsdActivity.Description},
					PlannedStart: originPsdActivity.PlannedStart,
					PlannedFinish: originPsdActivity.PlannedFinish,
					EarliestStart: originPsdActivity.EarliestStart,
					LatestStart: originPsdActivity.LatestStart,
					EarliestFinish: originPsdActivity.EarliestFinish,
					LatestFinish: originPsdActivity.LatestFinish,
					CalCalendarFk: originPsdActivity.CalendarFk,
					PrjLocationFk: originPsdActivity.LocationFk,
					MdcControllingunitFk: originPsdActivity.ControllingUnitFk
				};
				psdActivities.push(psdActivity);
			});

			return {
				PsdActivities: psdActivities,
				MntRequisitionId: mntRequisitionId,
				EventTypeId: eventTypeId
			};
		};

		self.createMntActivity = function (mntRequisitionId, eventTypeId, originPsdActivities) {
			if (originPsdActivities.length > 0) {
				var sortedPsdActivities = self.sortPsdActivities(originPsdActivities);
				var mntActivityCreateData = self.setCreateData(mntRequisitionId, eventTypeId, sortedPsdActivities);
				$http.post(globals.webApiBaseUrl + 'productionplanning/activity/activity/createmntactivities', mntActivityCreateData).then(
					//success
					function (response) {
						if(response.data){
							var stateDict = response.data;
							var keys = _.keys(response.data);
							var result = '';
							_.forEach(keys,function(key){
								var tr = $translate.instant('productionplanning.activity.activityWizard.' + stateDict[key]);
								result += 'Code:' + key + ' -- ' + tr + '<br>';
							});
							platformModalService.showDialog({
								headerTextKey: wizardTitle,
								bodyTextKey: result,
								iconClass: 'ico-info'
							});
						}
						//self.showInfoDialog('createSuccess');
					},
					//failure
					function () {
						self.showInfoDialog('createFail');
					}
				);
			}
		};

		self.showInfoDialog = function (type) {
			switch (type) {
				case 'createSuccess':
					platformModalService.showDialog({
						headerTextKey: wizardTitle,
						bodyTextKey: 'productionplanning.activity.activityWizard.createSuccess',
						iconClass: 'ico-info'
					});
					break;
				case 'createFail':
					platformModalService.showDialog({
						headerTextKey: wizardTitle,
						bodyTextKey: 'productionplanning.activity.activityWizard.createFail',
						iconClass: 'ico-error'
					});
					break;
				case 'noSelectedError':
					platformModalService.showDialog({
						headerTextKey: wizardTitle,
						bodyTextKey: 'productionplanning.activity.activityWizard.noSelectedError',
						iconClass: 'ico-error'
					});
					break;
				case 'noEventSelectedType':
					platformModalService.showDialog({
						headerTextKey: wizardTitle,
						bodyTextKey: 'productionplanning.activity.activityWizard.noEventSelectedType',
						iconClass: 'ico-error'
					});
					break;
				case 'noRequisitionSelectedError':
					platformModalService.showDialog({
						headerTextKey: wizardTitle,
						bodyTextKey: 'productionplanning.activity.activityWizard.noRequisitionSelectedError',
						iconClass: 'ico-error'
					});
					break;
			}
		};
	}

})(angular);
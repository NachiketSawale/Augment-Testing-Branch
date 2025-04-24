/**
 * Created by mik on 04/10/2021.
 */
/* global globals _ */

(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('productionPlanningCommonWizardService', ProductionPlanningCommonWizardService);

	ProductionPlanningCommonWizardService.$inject = [
		'$injector',
		'moment',
		'platformSidebarWizardConfigService',
		'platformWizardDialogService',
		'productionPlanningCommonLoadSequenceWizardConfigService',
		'productionplanningCommonLoadSequenceDataService',
		'$http',
		'basicsCommonLoadingService',
		'platformModalService',
		'basicsLookupdataLookupDataService',
		'platformDateshiftCalendarService', '$q'];

	function ProductionPlanningCommonWizardService(
		$injector,
		moment,
		platformSidebarWizardConfigService,
		platformWizardDialogService,
		productionPlanningCommonLoadSequenceWizardConfigService,
		productionplanningCommonLoadSequenceDataService,
		$http,
		basicsCommonLoadingService,
		platformModalService,
		basicsLookupdataLookupDataService,
		platformDateshiftCalendarService, $q) {

		let service = {};
		let wizardID = 'productionplanningCommonSidebarWizards';

		// region [FSP]

		service.createLoadSequencePlan = (wizardParams, userParams) => {

			let dataService = $injector.get(userParams.dataServiceName);
			let selected = _.clone(dataService.getSelected());

			if (selected) {
				// let drawingId = 1000410;
				let entityId = selected[userParams.FilterEntityId];
				let entityName = userParams.FilterEntityName;
				let activityTypeId = wizardParams.ActivityEventtype ? parseInt(wizardParams.ActivityEventtype) : 1000161;
				let propertyMapping = JSON.parse(wizardParams.PropertyMapping);
				if (entityId) {
					const filterParams = {
						FilterEntityName: entityName,
						FilterEntityId: entityId,
						ActivityTypeId: activityTypeId
					};
					getSequencePlanData(filterParams, wizardParams).then(function (response) {
						const fieldSequencePlan = response.FieldSequencePlan;
						const calendarData = response.CalendarData;
						let dailyStartTime = wizardParams.DailyStartTime ? moment.utc(wizardParams.DailyStartTime, 'H:mm') : moment.utc().hours(7).minutes(0).seconds(0);
						let projectStretchRate = wizardParams.StretchRate ? parseInt(wizardParams.StretchRate) : 5;
						let stretchRateFactor = wizardParams.StretchRateFactor ? parseInt(wizardParams.StretchRateFactor) : 25;
						let maxWeight = wizardParams.MaxLoadWeight ? wizardParams.MaxLoadWeight : 15000;

						productionplanningCommonLoadSequenceDataService.setPropertyMapping(propertyMapping);
						productionplanningCommonLoadSequenceDataService.setActivityType(activityTypeId);
						if (fieldSequencePlan[_.get(propertyMapping, 'Plan.Settings')]){
							productionplanningCommonLoadSequenceDataService.setOptions(propertyMapping[_.get(propertyMapping, 'Plan.Settings')]);
						} else {
							productionplanningCommonLoadSequenceDataService.setOptions({
								'startDate': fieldSequencePlan.PlanInfo.PlannedDeliveryDate ? moment.utc(fieldSequencePlan.PlanInfo.PlannedDeliveryDate) : moment(),
								'dailyStartTime': dailyStartTime,
								'projectStretchRate': projectStretchRate,
								'stretchRateFactor': stretchRateFactor,
								'stretchRate': projectStretchRate + (projectStretchRate * (stretchRateFactor / 100)),
								'maxWeight': maxWeight,
								'halfStretchRateFriday': false,
								'maximizeLastLoad': true, // temporarily set to true
								'plannedStretchRate': 0
							});
						}
						productionplanningCommonLoadSequenceDataService.resetLoadSequence();
						productionplanningCommonLoadSequenceDataService.setCalendarData(calendarData);
						productionplanningCommonLoadSequenceDataService.setLoadSequenceFromData(fieldSequencePlan);
						productionplanningCommonLoadSequenceDataService.onLoadSequenceFromDataCreated.fire(false);
						productionplanningCommonLoadSequenceDataService.onLoadSequenceChanged.fire(productionplanningCommonLoadSequenceDataService.getLoadSequence());
					});

					let wizardData = {};

					// show dialog with created load sequence
					const tempWizardConfig = productionPlanningCommonLoadSequenceWizardConfigService.wzConfig;
					tempWizardConfig.steps[0].canFinish = true;
					platformWizardDialogService.showDialog(tempWizardConfig, wizardData).then((result) => {
						if (result.success && productionplanningCommonLoadSequenceDataService.getLoadSequence().length > 0) {
							let fieldSequencePlan = productionplanningCommonLoadSequenceDataService.getLoadSequenceForServer();
							console.log(fieldSequencePlan);
							$http.post(globals.webApiBaseUrl + 'productionplanning/activity/fieldsequence/update', fieldSequencePlan)
								.then(function (response) {
									console.log('Field Sequence Plan successfully updated/saved! - ', response);
								});
							productionplanningCommonLoadSequenceDataService.resetLoadSequence();
						} else {
							productionplanningCommonLoadSequenceDataService.resetLoadSequence();
						}
					});
				} else {
					platformModalService.showErrorBox(`The selected ${entityName} has no valid ${userParams.FilterEntityId}!`,
						'productionplanning.common.wizard.loadSequence.editLoads'); // todo make possible for different entities - make wizard generic
				}
			} else {
				platformModalService.showErrorBox('productionplanning.item.wizard.noSelectedWarn',
					'productionplanning.common.wizard.loadSequence.editLoads'); // todo make possible for different entities - make wizard generic
			}
		};

		function getSequencePlanData(requestParameter, wizardParams) {
			const sequencePlanRequest = $http.post(globals.webApiBaseUrl + 'productionplanning/activity/fieldsequence/getPlan', requestParameter);
			return sequencePlanRequest.then((sequenceData) => {
				const fieldSequenceData = sequenceData.data;
				return getCalendarByFielData(fieldSequenceData.PlanInfo, wizardParams.ResourceType).then((calendarData) => {
					return {
						FieldSequencePlan: fieldSequenceData,
						CalendarData: calendarData
					};
				});
			});
		}

		function getCalendarByFielData(planInfo, resourceType) {
			// Option A: No calendar defined
			let fallbackRequest = _.wrap(null, $q.when);
			// Option B: Project calendar
			if (planInfo.ProjectId) {
				const prjCalendarRequest = {
					Project: planInfo.ProjectId,
					StartDate: planInfo.PlannedDeliveryDate
				};
				fallbackRequest = _.wrap(prjCalendarRequest, platformDateshiftCalendarService.getCalendarByFilter);
			}
			const parsedResourceType = parseInt(resourceType);
			const parsedSite = parseInt(planInfo.SiteId);
			if (_.isNaN(parsedResourceType) || _.isNaN(parsedSite)) {
				return fallbackRequest();
			}
			// Option C: Site/Resource calendar
			const resourceLookupRequest = getResourceByLookup(parsedSite, parsedResourceType);
			return resourceLookupRequest.then((lookupResult) => {
				if (lookupResult.items.length !== 1) {
					return fallbackRequest();
				}
				const calendarFilter = {
					Calendar: lookupResult.items[0].CalendarFk,
					StartDate: planInfo.PlannedDeliveryDate
				};
				return platformDateshiftCalendarService.getCalendarByFilter(calendarFilter);
			});
		}

		function getResourceByLookup(siteFk, typeFk) {
			const filterRequest = {
				FilterKey: 'resource-master-filter',
				AdditionalParameters: {
					siteFk: siteFk,
					typeFk: typeFk
				}
			};
			return basicsLookupdataLookupDataService.getSearchList('resourcemasterresource', filterRequest);
		}

		// endregion

		let wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'productionplanning.common.wizard.wizardGroupname1',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true
				// subitems: []
			}]
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		return service;
	}

})(angular);


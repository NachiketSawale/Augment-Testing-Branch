/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('scheduling.main').factory('schedulingMainActivityIconProcessor', ['$http', 'schedulingMainConstantValues','schedulingSchedulePresentService', function ($http, schedulingMainConstantValues,schedulingSchedulePresentService) {

		let service = {};
		let constraintTypeList = [];
		let icons = [];
		let calId = null;
		function getScheduleCalendar(scheduleFk){
			let selectedSchedule = schedulingSchedulePresentService.getItemById(scheduleFk);
			if (selectedSchedule) {
				return selectedSchedule.CalendarFk;
			}
		}

		// Load icons from the API
		function loadIcons() {
			$http.get(globals.webApiBaseUrl + 'scheduling/main/icons/geticons')
				.then(function (response) {
					icons = response.data;
				});
		}

		// Load constraint types
		$http.post(globals.webApiBaseUrl + 'basics/customize/constrainttype/list')
			.then(function (response) {
				constraintTypeList = response.data || [];
			});


		service.processItem = function processItem(activity) {
			// Process item logic here if needed
		};

		service.select = function (activity) {
			loadIcons();
			if (!activity) return '';
			calId = getScheduleCalendar(activity.ScheduleFk);
			let iconList = [];
			let addedIcons = new Set();

			for (let i = 0; i < icons.length; i++) {
				const prop = icons[i];

				if (addedIcons.has(prop.Description)) {
					continue; // Skip if icon is already added
				}
				if ((prop.Description === 'Hard Constraint') && (activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.MustFinishOn ||
					activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.MustStartOn) && activity.ConstraintTypeFk !== schedulingMainConstantValues.constraintTypes.NoConstraint) {
					iconList.push(prop);
					addedIcons.add('Hard Constraint');
				} else if ((prop.Description === 'Soft Constraint') && (activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.FinishNoEarlierThan ||
					activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.FinishNoLaterThan ||
					activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.StartNoEarlierThan ||
					activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.StartNoLaterThan) && activity.ConstraintTypeFk !== schedulingMainConstantValues.constraintTypes.NoConstraint) {
					iconList.push(prop);
					addedIcons.add('Soft Constraint');
				} else if (prop.Description === 'Note' && activity.Note !== null && activity.Note !=='') {
					iconList.push(prop);
					addedIcons.add('Note');
				} else if (prop.Description === 'Estimate' && activity.IsAssignedToEstimate) {
					iconList.push(prop);
					addedIcons.add('Estimate');
				} else if (prop.Description === 'Package' && activity.PackageId > 0) {
					iconList.push(prop);
					addedIcons.add('Package');
				} else if (prop.Description === 'Resource' && activity.IsAssignedToRequisition) {
					iconList.push(prop);
					addedIcons.add('Resource');
				} else if (prop.Description === 'Calendar' && activity.CalendarFk !== calId && calId!==null) {
					iconList.push(prop);
					addedIcons.add('Calendar');
				}
			}

			return iconList;
		};


		service.isCss = function () {
			return true;
		};

		service.selectTooltip = function (activity) {
			if (!activity) return '';
			calId = getScheduleCalendar(activity.ScheduleFk);
			let tooltips = [];

			for (let i = 0; i < icons.length; i++) {
				const prop = icons[i];
				let tooltip = '';

				if ((prop.Description === 'Hard Constraint' || prop.Description === 'Soft Constraint') &&
					activity.ConstraintTypeFk !== schedulingMainConstantValues.constraintTypes.NoConstraint) {
					if (activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.MustFinishOn ||
						activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.MustStartOn) {
						tooltip = getConstraintDescription(activity);
					} else if (activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.FinishNoEarlierThan ||
						activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.FinishNoLaterThan ||
						activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.StartNoEarlierThan ||
						activity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.StartNoLaterThan) {
						tooltip = getConstraintDescription(activity);
					}
				} else if (prop.Description === 'Note' && activity.Note !== null && activity.Note !=='') {
					tooltip = activity.Note;
				} else if (prop.Description === 'Estimate' && activity.IsAssignedToEstimate) {
					tooltip = activity.EstimateCodes;
				} else if (prop.Description === 'Package' && activity.PackageId > 0) {
					tooltip = activity.PackageCode + ', ' + activity.PackageDesc;
				} else if (prop.Description === 'Resource' && activity.IsAssignedToRequisition) {
					tooltip = activity.RequisitionCodes;
				} else if (prop.Description === 'Calendar' && activity.CalendarFk !== calId && calId!==null) {
					tooltip = activity.CalendarCode + ', ' + activity.CalendarDescription;
				}

				if (tooltip) {
					tooltips.push({ icon: prop.Description, tooltip });
				}
			}

			return tooltips;
		};

		function getConstraintDescription(activity) {
			let concatString = '';
			const constraint = constraintTypeList.find(item => item.Id === activity.ConstraintTypeFk);
			concatString = concatString + constraint ? constraint.DescriptionInfo.Description : '';
			if(activity.ConstraintDate!==null){
				concatString = concatString + ' ' + moment(activity.ConstraintDate).format('YYYY-MM-DD');
			}
			return concatString;
		}


		return service;
	}]);
})(angular);

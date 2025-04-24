/**
 * Created by baf on 26.01.2015.
 */

(function (angular) {
	'use strict';
	/* global moment Platform globals */
	/**
	 * @ngdoc service
	 * @name schedulingMainEventValidationService
	 * @description provides validation methods for event instances
	 */
	angular.module('scheduling.main').service('schedulingMainDueDateService', SchedulingMainDueDateService);

	SchedulingMainDueDateService.$inject = ['platformModalService', '$translate'];

	function SchedulingMainDueDateService(platformModalService, $translate) {
		let data = {
			changedEvent: new Platform.Messenger(),
			dueDate: moment()
		};

		let conf = {
			id: 'showSettings',
			caption: '',
			type: 'item',
			iconClass: 'tlb-icons ico-date',
			fn: showSettings
		};

		function buildToolTip() {
			let dueDate = $translate.instant('scheduling.main.showDueDateToolTip');

			if (data.dueDate) {
				dueDate += data.dueDate.format('L');
			} else {
				dueDate += '-';
			}

			return dueDate;
		}

		function buildStatusBar() {
			let dueDate = $translate.instant('scheduling.main.showDueDateStatusBar');

			if (data.dueDate) {
				dueDate += data.dueDate.format('L');
			} else {
				dueDate += '-';
			}

			return dueDate;
		}

		this.getDueDateIconConfig = function getDueDateIconConfig() {
			conf.caption = buildToolTip();

			return conf;
		};

		// show settings for performance measurement
		function showSettings() {
			platformModalService.showDialog({
				headerTextKey: 'boq.main.gaebExport',
				templateUrl: globals.appBaseUrl + 'scheduling.main/templates/performancesettingsdialog.html',
				controller: 'schedulingMainPerformanceSettingsDialogController'
			});
		}

		this.buildToolTip = buildToolTip;

		this.buildStatusBar = buildStatusBar;

		this.showDueDateError = function showDueDateError() {
			let modalOptions = {
				headerTextKey: 'scheduling.main.dueDate',
				bodyTextKey: 'scheduling.main.errors.dueDateMustBeSet',
				iconClass: 'ico-info'
			};

			platformModalService.showDialog(modalOptions);
		};

		this.hasDueDate = function hasDueDate() {
			return !!data.dueDate;
		};

		this.getPerformanceDueDate = function getPerformanceDueDate() {
			return data.dueDate;
		};

		this.getPerformanceDueDateAsString = function getPerformanceDueDateAsString() {
			return data.dueDate ? data.dueDate.toISOString() : '';
		};

		this.getPerformanceDescription = function getPerformanceDescription() {
			return data.description;
		};

		this.setPerformanceDueDate = function setPerformanceDueDate(dueDate) {
			data.dueDate = dueDate;
			conf.caption = buildToolTip();
			data.changedEvent.fire();
		};

		this.setDueDate = function setDueDate(dueDate) {
			data.dueDate = dueDate;
		};

		this.setPerformanceDescription = function setPerformanceDescription(desc) {
			data.description = desc;
		};

		this.registerDueDateChanged = function registerDueDateChanged(callBackFn) {
			data.changedEvent.register(callBackFn);
		};

		this.unregisterDueDateChanged = function unregisterDueDateChanged(callBackFn) {
			data.changedEvent.unregister(callBackFn);
		};
	}
})(angular);

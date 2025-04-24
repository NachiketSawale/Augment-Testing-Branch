/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerReportingPeriodService
	 * @function
	 *
	 * @description Manages the reporting period used in the completion degree filter.
	 */
	angular.module('model.viewer').factory('modelViewerReportingPeriodService',
		modelViewerReportingPeriodService);

	modelViewerReportingPeriodService.$inject = ['PlatformMessenger', 'moment', '_'];

	function modelViewerReportingPeriodService(PlatformMessenger, moment, _) {
		const today = moment().startOf('day');

		const privateState = {
			reportingPeriod: {
				start: today.clone().subtract(1, 'months'),
				end: today
			},
			onReportingPeriodChanged: new PlatformMessenger()
		};

		return {
			setReportingPeriod(start, end) {
				const newPeriod = {
					start: moment(start),
					end: moment(end)
				};

				if (newPeriod.end.isBefore(newPeriod.start)) {
					throw new Error('The end must not be before the start.');
				}

				if (!privateState.reportingPeriod.start.isSame(newPeriod.start, 'seconds') ||
					!privateState.reportingPeriod.end.isSame(newPeriod.end)) {
					privateState.reportingPeriod = newPeriod;
					privateState.onReportingPeriodChanged.fire(_.cloneDeep(newPeriod));
				}
			},
			getReportingPeriod() {
				return _.cloneDeep(privateState.reportingPeriod);
			},
			registerReportingPeriodUpdated(handler) {
				privateState.onReportingPeriodChanged.register(handler);
			},
			unregisterReportingPeriodUpdated(handler) {
				privateState.onReportingPeriodChanged.unregister(handler);
			}
		};
	}
})(angular);
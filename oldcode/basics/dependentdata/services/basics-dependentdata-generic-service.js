/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc service
	 * @name basicsDependentDataGenericService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsDependentDataGenericService', basicsDependentDataGenericService);
	basicsDependentDataGenericService.$inject = ['_', 'globals', '$q', '$http', 'cloudDesktopPinningContextService', 'platformContextService',
		'basicsDependentDataGridColumnsService', 'ServiceDataProcessDatesExtension', 'SchedulingDataProcessTimesExtension', 'platformGridDomainService'];

	function basicsDependentDataGenericService(_, globals, $q, $http, pinningService, platformContextService,
		basicsDependentDataGridColumnsService, ServiceDataProcessDatesExtension, SchedulingDataProcessTimesExtension, platformGridDomainService) {

		let service = {};

		service.loadData = function (dependentDataId, contextId) {
			const canceller = $q.defer();
			const cancel = function (reason) {
				canceller.resolve(reason);
			};
			const params = {
				DependentDataId: dependentDataId,
				ContextId: contextId,
				CompanyFk: platformContextService.signedInClientId,
				UserFk: null,
				ProjectFk: pinningService.getPinnedId('project.main'),
				EstimateFk: pinningService.getPinnedId('estimate.main'),
				ModelFk: pinningService.getPinnedId('model.main')
			};

			const promise =
				// $http.get(globals.webApiBaseUrl + 'basics/dependentdata/sourcedatalist?dependentDataId=' + dependentDataId + '&contextId=' + contextId, { timeout: canceller.promise })
				$http.post(globals.webApiBaseUrl + 'basics/dependentdata/sourcedatalist', params, {timeout: canceller.promise})
					.then(function (response) {
						const timeCols = [];
						const dateCols = [];

						_.forEach(basicsDependentDataGridColumnsService.getGridColumns(), function (col) {
							if (col.formatter === 'time' || col.formatter === 'timeutc') {
								timeCols.push(col.field);
							}
							if (col.formatter === 'date' || col.formatter === 'dateutc' || col.formatter === 'datetime' || col.formatter === 'datetimeutc') {
								dateCols.push(col.field);
							}
						});

						const timeProc = new SchedulingDataProcessTimesExtension(timeCols);
						const dateProc = new ServiceDataProcessDatesExtension(dateCols);

						if (response.data) {
							_.forEach(response.data, function (row) {
								timeProc.processItem(row);
								dateProc.processItem(row);
								row['QTN_TOTAL_VALUE_MAX'] = platformGridDomainService.formatter('money')(0, 0, row['QTN_TOTAL_VALUE_MAX'], {});
								row['QTN_TOTAL_VALUE_MIN'] = platformGridDomainService.formatter('money')(0, 0, row['QTN_TOTAL_VALUE_MIN'], {});
							});
						}
						return response.data;
					});

			return {
				promise: promise,
				cancel: cancel
			};

		};

		return service;
	}
})(angular);


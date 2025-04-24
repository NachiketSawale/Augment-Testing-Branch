/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const module = angular.module('basics.common');

	/**
	 * @ngdoc service
	 * @name basicsCommonTemporaryIdStorageService
	 * @function
	 *
	 * @description
	 * Sends sets of IDs to the server.
	 */
	module.factory('basicsCommonTemporaryIdStorageService', basicsCommonTemporaryIdStorageService);

	basicsCommonTemporaryIdStorageService.$inject = ['$http', '_', '$injector'];

	function basicsCommonTemporaryIdStorageService($http, _, $injector) {
		let $rootScope = null;

		function findRequestIdParam(report, paramName) {
			if (_.isNil(paramName)) {
				paramName = 'mainItemIdsRequestId';
			}

			return (report.hiddenParameters || []).concat(report.parameters || []).find(prm => prm.parameterName === paramName);
		}

		function attachReportPromise(reportInfo, newPromise) {
			reportInfo.promise = newPromise;
		}

		return {
			storeIds: function (ids) {
				return $http.post(globals.webApiBaseUrl + 'basics/common/ids/store', {
					Ids: Array.isArray(ids) ? ids.map(id => {
						if (_.isInteger(id)) {
							return {
								Id: id
							};
						} else if (_.isObject(id)) {
							return {
								PKey3: id.PKey3 || id.Key3 || id.pKey3 || id.pkey3 || id.key3,
								PKey2: id.PKey2 || id.Key2 || id.pKey2 || id.pkey2 || id.key2,
								PKey1: id.PKey1 || id.Key1 || id.pKey1 || id.pkey1 || id.key1,
								Id: id.Id || id.id
							};
						} else {
							return null;
						}
					}).filter(id => !_.isNil(id)) : null
				});
			},
			deleteIds: function (key) {
				return $http.post(globals.webApiBaseUrl + 'basics/common/ids/delete', {
					RequestId: key
				}).then(() => undefined);
			},
			saveEntityIdsForReporting: function (dataService, extractId) {
				if (!$rootScope) {
					$rootScope = $injector.get('$rootScope');
				}

				const that = this;

				const unregisterReportPrepare = $rootScope.$on('reporting:prePreparePrint', function (eventInfo, reportInfo) {
					const reqIdParam = findRequestIdParam(reportInfo.report);
					if (reqIdParam) {
						const ids = dataService.getSelectedEntities().map(extractId);

						const idsPromise = that.storeIds(ids).then(function (response) {
							reqIdParam.value = response.data;
						});

						attachReportPromise(reportInfo, idsPromise);
					}
				});

				const unregisterReportFinalize = $rootScope.$on('reporting:postPreparePrint', function (eventInfo, reportInfo) {
					const reqIdParam = findRequestIdParam(reportInfo.report.report);
					if (reqIdParam) {
						const delIdsPromise = that.deleteIds(reqIdParam.value);

						attachReportPromise(reportInfo, delIdsPromise);
					}
				});

				return (function finalizeEntityIdsForReportingConnector () {
					unregisterReportPrepare();
					unregisterReportFinalize();
				});
			}
		};
	}
})(angular);

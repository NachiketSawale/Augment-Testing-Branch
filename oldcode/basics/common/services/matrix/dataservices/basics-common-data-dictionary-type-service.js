/*
 * $Id: basics-common-data-dictionary-type-service.js 590180 2020-06-09 12:27:04Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDataDictionaryTypeService
	 * @function
	 * @requires $q, $http, _, $log
	 *
	 * @description Retrieves and stores data type definitions that are compatible with data dictionary-based
	 *              bulk expressions.
	 */
	angular.module('basics.common').factory('basicsCommonDataDictionaryTypeService', ['$q', '$http', '_', '$log', 'globals',
		function ($q, $http, _, $log, globals) {
			const service = {};

			const state = {
				dataTypes: null,
				dataTypesByUiTypeId: {},
				dataTypesByDisplayDomainFk: {}
			};

			service.prepareTypes = function () {
				if (!state.dataTypes) {
					return $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/alldatatypes').then(function processDataTypeData(response) {
						if (_.isEmpty(response.data) || !_.isArray(response.data)) {
							return $q.reject();
						}

						state.dataTypes = response.data;
						state.dataTypes.forEach(function (dt) {
							state.dataTypesByDisplayDomainFk[dt.DisplayDomainFk] = dt;
							if (_.isArray(dt.UiTypes)) {
								dt.UiTypes.forEach(function (uiTypeId) {
									state.dataTypesByUiTypeId[uiTypeId] = dt;
								});
							} else {
								dt.UiTypes = [];
							}
						});
					});
				}
				return $q.resolve();
			};

			function checkServiceReady() {
				if (!state.dataTypes) {
					throw new Error('The data types have not yet been loaded.');
				}
			}

			service.uiTypeIdToDisplayDomainFk = function (uiTypeId) {
				checkServiceReady();

				const dt = state.dataTypesByUiTypeId[uiTypeId];
				if (dt) {
					return dt.DisplayDomainFk;
				} else {
					return null;
				}
			};

			service.displayDomainFkToUiTypeId = function (displayDomainFk) {
				checkServiceReady();

				const dt = state.dataTypesByDisplayDomainFk[displayDomainFk];
				if (dt) {
					if (dt.UiTypes.length > 0) {
						return dt.UiTypes[0];
					}
				}
				return null;
			};

			service.areUiTypesCompatible = function (type1, type2) {
				checkServiceReady();

				const dt1 = state.dataTypesByUiTypeId[type1];
				const dt2 = state.dataTypesByUiTypeId[type2];
				if (dt1 === dt2) {
					return true;
				}

				if (dt1 && dt2) {
					if (dt1.CompatibleTypes.some(function (ct) {
						const cdt = state.dataTypesByUiTypeId[ct];
						return cdt === dt2;
					})) {
						return true;
					}
				}

				return false;
			};

			service.getCompatibleDataTypes = function (type) {
				checkServiceReady();

				// currently only allow a very specific set of available dataType
				const allowedTypes = ['date'];
				const datatype = state.dataTypesByUiTypeId[type];

				return _.filter(state.dataTypes, function (otherDataType) {
					return _.includes(allowedTypes, otherDataType.FilterType) &&
						_.includes(datatype.CompatibleTypes, otherDataType.FilterType) &&
						datatype.FilterType !== otherDataType.FilterType;
				});
			};

			service.getDataPathForUiType = function (uiTypeId) {
				const dt = state.dataTypesByUiTypeId[uiTypeId];
				if (dt) {
					if (_.isString(dt.DataPath) && !_.isEmpty(dt.DataPath)) {
						return dt.DataPath;
					}
				}
				$log.warn('Data path requested for unsupported UI type: ' + uiTypeId);
				return 'Unsupported';
			};

			service.getFilterTypeByDataPath = function (object) {
				const directKey = _.first(_.keys(object));
				const dataType = _.find(state.dataTypes, {DataPath: directKey});
				if (dataType) {
					return dataType;
				}
				$log.warn('Data type requested for unsupported DataPath: ' + directKey);
				return null;
			};

			return service;
		}]);
})();
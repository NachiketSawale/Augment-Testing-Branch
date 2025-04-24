/*
 * $Id $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDataDictionaryEnvExprService
	 * @function
	 * @requires $q, $http, _, basicsCommonDataDictionaryTypeService
	 *
	 * @description Retrieves and stores environment expression definitions that are compatible with data
	 *              dictionary-based bulk expressions.
	 */
	angular.module('basics.common').factory('basicsCommonDataDictionaryEnvExprService', ['$q', '$http', '_', 'basicsCommonDataDictionaryTypeService', 'globals',
		function ($q, $http, _, basicsCommonDataDictionaryTypeService, globals) {
			const service = {};

			const state = {
				envExprs: null,
				envExprsById: {}
			};

			function getEnvExprId(kind, id) {
				return '[' + kind + ']' + id;
			}

			service.prepareExpressions = function () {
				if (!state.envExprs) {
					return $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/allenvexprs').then(function processEnvExprData(response) {
						if (_.isEmpty(response.data) || !_.isArray(response.data)) {
							return $q.reject();
						}

						state.envExprs = response.data;
						state.envExprs.forEach(function (ee) {
							state.envExprsById[getEnvExprId(ee.Kind, ee.Id)] = ee;
						});
					});
				}
				return $q.resolve();
			};

			function checkServiceReady() {
				if (!state.envExprs) {
					throw new Error('The environment expressions have not yet been loaded.');
				}
			}

			service.getExpressionsForType = function (uiTypeId, targetKind, targetId, allowRanges) {
				checkServiceReady();

				return _.filter(state.envExprs, function (ee) {
					if (ee.IsRange && !allowRanges) {
						return false;
					}

					if (!basicsCommonDataDictionaryTypeService.areUiTypesCompatible(ee.UiTypeId, uiTypeId)) {
						return false;
					}

					if (_.isNumber(targetId)) {
						if (targetId !== ee.TargetId) {
							return false;
						}

						if (!((_.isEmpty(targetKind) && _.isEmpty(ee.TargetKind)) || (targetKind === ee.TargetKind))) {
							return false;
						}
					} else {
						if (_.isNumber(ee.TargetId)) {
							return false;
						}
					}

					return true;
				});
			};

			service.getExpressionName = function (kind, id) {
				checkServiceReady();

				const combinedId = getEnvExprId(kind, id);
				const expr = state.envExprsById[combinedId];
				if (expr) {
					return expr.Name;
				}
				throw new Error('Unknown environment expression: ' + combinedId);
			};

			service.isExpressionRange = function (kind, id) {
				checkServiceReady();

				const combinedId = getEnvExprId(kind, id);
				const expr = state.envExprsById[combinedId];
				if (expr) {
					return expr.IsRange || false;
				}
				throw new Error('Unknown environment expression: ' + combinedId);
			};

			return service;
		}]);
})();
/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.evaluation.modelEvaluationRulesetResultCacheService
	 * @function
	 *
	 * @description Evaluates model evaluation rule sets and caches results.
	 */
	angular.module('model.evaluation').factory('modelEvaluationRulesetResultCacheService', ['_', '$http', '$q', '$log',
		'moment',
		function (_, $http, $q, $log, moment) {
			var service = {};

			var privateState = {
				cachedResults: {},
				maxCacheSize: 20,
				currentCacheSize: 0,
				cleanUpCache: function () {
					var that = this;
					if (that.currentCacheSize > that.maxCacheSize) {
						var orderedCache = _.orderBy(_.map(Object.keys(that.cachedResults), function (key) {
							return that.cachedResults[key];
						}), 'time');
						var itemsToDelete = _.takeRight(orderedCache, that.currentCacheSize - that.maxCacheSize);
						itemsToDelete.forEach(function (delItem) {
							delete that.cachedResults[delItem.key];
						});
						that.currentCacheSize -= itemsToDelete.length;
					}
				},
				removeRulesetFromCache: function (rulesetId) {
					var keyRegex = _.isNumber(rulesetId) ? new RegExp('^[0-9]+\\:' + rulesetId + '\\:[0-9]*$', 'i') : new RegExp('^.*$');

					var that = this;
					var itemsToDelete = _.map(_.filter(Object.keys(that.cachedResults), function (key) {
						return keyRegex.test(key);
					}), function (key) {
						return that.cachedResults[key];
					});

					if (itemsToDelete.length > 0) {
						itemsToDelete.forEach(function (delItem) {
							delete that.cachedResults[delItem.key];
						});
						that.currentCacheSize -= itemsToDelete.length;
					}
				}
			};

			function getCacheKey(modelId, rulesetId, hlSchemeId) {
				return (_.isNumber(modelId) ? modelId : 0) + ':' +
					(_.isNumber(rulesetId) ? rulesetId : 0) + ':' +
					(_.isNumber(hlSchemeId) ? hlSchemeId : '');
			}

			service.getResults = function (modelId, rulesetId, hlSchemeId) {
				var cacheKey = getCacheKey(modelId, rulesetId, hlSchemeId);
				var currentTime = moment().valueOf();
				return $q.when(privateState.cachedResults[cacheKey]).then(function (cachedResults) {
					if (!cachedResults) {
						cachedResults = {
							key: cacheKey,
							time: currentTime
						};
						cachedResults.promise = $http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/evaluate', {
							params: {
								modelId: modelId,
								rulesetId: rulesetId,
								hlSchemeId: hlSchemeId
							}
						}).then(function (response) {
							cachedResults.promise = null;
							cachedResults.results = response.data;
							privateState.cachedResults[cacheKey] = cachedResults;
							privateState.currentCacheSize++;
							privateState.cleanUpCache();
							return cachedResults;
						}, function (reason) {
							$log.warn('Evaluation of rule set %d with highlighting scheme %d failed: %s', rulesetId, hlSchemeId, reason);
							return $q.reject(reason);
						});
						return cachedResults.promise;
					} else {
						cachedResults.time = Math.max(cachedResults.time, currentTime);
						if (cachedResults.promise) {
							return cachedResults.promise;
						} else {
							return cachedResults;
						}
					}
				}, function (reason) {
					return $q.reject(reason);
				}).then(function (cachedResults) {
					if (cachedResults) {
						return cachedResults.results;
					} else {
						return $q.reject();
					}
				}, function (reason) {
					return $q.reject(reason);
				});
			};

			service.prepareResults = function (modelId, ids) {
				var actualIds = _.cloneDeep(ids);
				if (actualIds.length > privateState.maxCacheSize) {
					actualIds = _.take(actualIds, privateState.maxCacheSize);
				}

				var unresolvedPromises = [];

				var currentTime = moment().valueOf();
				var idsToRequest = [];
				actualIds.forEach(function (idInfo) {
					var cacheKey = getCacheKey(modelId, idInfo.rulesetId, idInfo.hlSchemeId);
					idInfo.cacheKey = cacheKey;
					var cachedResults = privateState.cachedResults[cacheKey];
					if (!cachedResults) {
						idsToRequest.push(idInfo);
						privateState.cachedResults[cacheKey] = {
							key: cacheKey,
							time: currentTime
						};
					} else {
						cachedResults.time = Math.max(cachedResults.time, currentTime);
						if (cachedResults.promise) {
							unresolvedPromises.push(cachedResults.promise);
						}
					}
				});

				if (idsToRequest.length > 0) {
					var missingIds = {};
					idsToRequest.forEach(function (idInfo) {
						var cacheKey = getCacheKey(modelId, idInfo.rulesetId, idInfo.hlSchemeId);
						missingIds[cacheKey] = true;
					});

					var callPromise = $http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/multievaluate', {
						params: {
							modelId: modelId,
							ids: _.map(idsToRequest, function (idInfo) {
								return idInfo.rulesetId + (_.isNumber(idInfo.hlSchemeId) ? ':' + idInfo.hlSchemeId : '');
							}).join(';')
						}
					}).then(function (response) {
						response.data.forEach(function (rInfo) {
							var cacheKey = getCacheKey(modelId, rInfo.RulesetId, rInfo.HighlightingSchemeId);
							delete missingIds[cacheKey];
							if (rInfo.failed) {
								delete privateState.cachedResults[cacheKey];
							} else {
								var cachedResults = privateState.cachedResults[cacheKey];
								cachedResults.promise = null;
								cachedResults.results = rInfo.Ids;
							}
						});

						Object.keys(missingIds).forEach(function (cacheKey) {
							delete privateState.cachedResults[cacheKey];
						});
					}, function (reason) {
						$log.warn('Preparing evaluation results failed: ' + reason);
						idsToRequest.forEach(function (idInfo) {
							var cacheKey = getCacheKey(modelId, idInfo.rulesetId, idInfo.hlSchemeId);
							delete privateState.cachedResults[cacheKey];
						});
						return $q.resolve(_.map(idsToRequest, function (idInfo) {
							return {
								RulesetId: idInfo.rulesetId,
								HighlightingSchemeId: idInfo.hlSchemeId,
								failed: true
							};
						}));
					});

					idsToRequest.forEach(function (idInfo) {
						var cachedResults = privateState.cachedResults[idInfo.cacheKey];
						cachedResults.promise = callPromise.then(function () {
							if (privateState.cachedResults[idInfo.cacheKey]) {
								return cachedResults;
							} else {
								$q.reject();
							}
						}, function (reason) {
							return $q.reject(reason);
						});
					});
					unresolvedPromises.push(callPromise);
				}

				if (unresolvedPromises.length > 0) {
					return $q.all(unresolvedPromises).then(function () {
						privateState.cleanUpCache();
					});
				} else {
					return $q.resolve();
				}
			};

			service.prepareResultsForGroup = function (modelId, groupId) {
				return $http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/idsfromgroup', {
					params: {
						groupId: groupId
					}
				}).then(function (response) {
					return service.prepareResults(modelId, _.map(response.data, function (idInfo) {
						return {
							rulesetId: idInfo.RulesetId,
							hlSchemeId: idInfo.HighlightingSchemeId
						};
					}));
				});
			};

			service.clearResults = function (rulesetId) {
				privateState.removeRulesetFromCache(rulesetId);
			};

			return service;
		}]);
})(angular);

/*
 * $Id: basics-common-bulk-expression-profile-service.js 634323 2021-04-27 22:05:46Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('basics.common').factory('bascisCommonBulkExpressionProfileService', BascisCommonBulkExpressionProfileService);

	BascisCommonBulkExpressionProfileService.$inject = ['$http', '_', '$q'];

	function BascisCommonBulkExpressionProfileService($http, _) {
		const service = {
			loadBulkExpressionProfiles: loadBulkExpressionProfiles,
			saveBulkExpressionProfile: saveBulkExpressionProfile,
			deleteBulkExpressionProfile: deleteBulkExpressionProfile
		};

		const baseEndpoint = globals.webApiBaseUrl + 'basics/common/bulkExpr/profile/';

		function loadBulkExpressionProfiles(moduleName, prefix, legacyPrefix, applicationGuid) {
			return $http({
				url: baseEndpoint + 'list',
				method: 'GET',
				params: {
					moduleName: moduleName,
					prefix: prefix,
					legacyPrefix: legacyPrefix,
					applicationGuid: applicationGuid
				}
			}).then(function (result) {
				return !_.isNil(result) ? result.data : null;
			});
		}

		function saveBulkExpressionProfile(moduleName, accessLevel, conditionDto, additionalProperties, groupPrefix, applicationGuid, id) {
			return $http({
				url: baseEndpoint + 'save',
				method: 'POST',
				data: {
					id: id,
					moduleName: moduleName,
					accessLevel: accessLevel,
					profileDef: conditionDto,
					additionalProperties: additionalProperties,
					groupPrefix: groupPrefix,
					applicationGuid: applicationGuid
				}
			}).then(function (result) {
				return !_.isNil(result) ? result.data : null;
			});
		}

		function deleteBulkExpressionProfile(moduleName, accessLevel, groupPrefix, applicationGuid, id) {
			return $http({
				url: baseEndpoint + 'delete',
				method: 'POST',
				data: {
					id: id,
					moduleName: moduleName,
					accessLevel: accessLevel,
					groupPrefix: groupPrefix,
					applicationGuid: applicationGuid
				}
			}).then(function (result) {
				return _.isNil(result) ? result.data : null;
			});
		}

		return service;
	}
})(angular);

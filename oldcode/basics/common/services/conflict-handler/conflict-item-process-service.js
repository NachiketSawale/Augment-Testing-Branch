/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	angular.module('basics.common').factory('basicsCommonConflictItemProcessor', [
		'_',
		'$injector',
		'$translate',
		'conflictVersionType',
		function (_, $injector, $translate, conflictVersionType) {

			const service = {};

			/*
			 * if conflictVersionType of item is not ApplyEntity, then set it readonly
			 */
			function setItemReadOnly(item) {
				if (item.conflictVersionType !== conflictVersionType.ApplyEntity) {
					let allFieldsReadOnly = [];
					_.forOwn(item, function (value, key) {
						let field = {field: key, readonly: true};
						if (field.field !== 'isChecked') {
							allFieldsReadOnly.push(field);
						}
					});
					$injector.get('platformRuntimeDataService').readonly(item, allFieldsReadOnly);
				}
			}

			service.process = function (items) {
				_.forEach(items, function (item) {
					setItemReadOnly(item);
				});
			};

			service.isCss = function () {
				return true;
			};

			service.selectTooltip = function (item) {
				if (item) {
					if (item.conflictVersionType === conflictVersionType.MyLocalEntity) {
						return $translate.instant('basics.common.conflict.remoteData');
					} else if (item.conflictVersionType === conflictVersionType.OthersEntity) {
						return $translate.instant('basics.common.conflict.localData');
					} else {
						return $translate.instant('basics.common.conflict.mergeData');
					}
				}
			};

			return service;
		}]);
})(angular);

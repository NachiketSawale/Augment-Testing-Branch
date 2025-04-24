/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.project';
	/**
	 * @ngdoc service
	 * @name estimateProjectProcessor
	 * @function
	 * @requires estimateProjectProcessor
	 * @description
	 * estimateProjectProcessor is the service to set EStimate Header readonly.
	 */
	angular.module(moduleName).factory('estimateProjectProcessor', ['platformRuntimeDataService',
		function (platformRuntimeDataService) {
			let service = {
				processItem : processItem
			};
			function processItem(item) {
				let fields = [];
				let readOnlyFlag = !!item.IsHeaderStatusReadOnly;

				if (item) {
					if (item.EstHeader.EstHeaderVersionFk) {
						_.forOwn(item.EstHeader, function (value, key) {
							if (key === 'VersionDescription' || key === 'VersionComment') {
								let field = {field: 'EstHeader.' + key, readonly: false};
								fields.push(field);
							} else {
								let field = {field: 'EstHeader.' + key, readonly: true};
								fields.push(field);
							}
						});
					} else {
						fields.push({field: 'EstHeader.Code', readonly: readOnlyFlag});
						fields.push({field: 'EstHeader.DescriptionInfo', readonly: readOnlyFlag});
						fields.push({field: 'EstHeader.EstimateType', readonly: readOnlyFlag});
						fields.push({field: 'EstHeader.IsActive', readonly: readOnlyFlag});
						fields.push({field: 'EstHeader.RubricCategoryFk', readonly: readOnlyFlag});
						fields.push({field: 'EstHeader.EstTypeFk', readonly: readOnlyFlag});
						fields.push({field: 'EstHeader.LgmJobFk', readonly: readOnlyFlag});
						fields.push({field: 'EstHeader.InsertedAt', readonly: true});
						fields.push({field: 'EstHeader.InsertedBy', readonly: true});
						fields.push({field: 'EstHeader.UpdatedAt', readonly: true});
						fields.push({field: 'stHeader.UpdatedBy', readonly: true});
						fields.push({field: 'EstHeader.Hint', readonly: true});
					}

					platformRuntimeDataService.readonly(item, fields);
				}
			}
			return service;
		}]);
})(angular);

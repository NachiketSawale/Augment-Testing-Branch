/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleAssignmentParamsUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('estimateMainRuleAssignmentParamsUIConfigurationService', ['platformTranslateService', 'estimateParamColumnConfigService',
		function (platformTranslateService, estimateParamColumnConfigService) {

			let service = {};

			service.getGridColumns = function() {
				let gridColumns = estimateParamColumnConfigService.getAllColumns();

				// Remove parametervalue column here
				gridColumns = _.filter(gridColumns, function(gridColumn){ return gridColumn.id !== 'parametervalue'; });

				platformTranslateService.translateGridConfig(gridColumns);

				return gridColumns;
			};

			service.getStandardConfigForListView = function(){

				return{
					addValidationAutomatically: true,
					columns : service.getGridColumns()
				};
			};

			return service;
		}]);
})(angular);

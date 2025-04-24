/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemQuantityController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of LineItem Quantity entities.
	 **/
	angular.module(moduleName).controller('estimateMainLineItemQuantityController',
		['$scope','platformGridControllerService', 'estimateDefaultGridConfig', 'estimateMainLineItemQuantityValidationService', 'estimateMainLineItemQuantityConfigurationService', 'estimateMainLineItemQuantityService',
			function ($scope,platformGridControllerService, estimateDefaultGridConfig, estimateMainLineItemQuantityValidationService, estimateMainLineItemQuantityConfigurationService, estimateMainLineItemQuantityService) {

				let gridConfig = estimateDefaultGridConfig;

				platformGridControllerService.initListController($scope, estimateMainLineItemQuantityConfigurationService, estimateMainLineItemQuantityService, estimateMainLineItemQuantityValidationService, gridConfig);

				let bulkEditorItem = _.find($scope.tools.items, {'id' : 't14'});
				if(bulkEditorItem){
					$scope.tools.items = _.filter($scope.tools.items, function(item){
						return item.id !== 't14';
					});
				}				
			}
		]);
})();

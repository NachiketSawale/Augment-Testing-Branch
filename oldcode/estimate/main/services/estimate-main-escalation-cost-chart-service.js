/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let estimateMainModule = angular.module('estimate.main');
	/**
	 * @ngdoc service
	 * @name estimateMainEscalationCostChartService
	 * @function
	 *
	 */
	estimateMainModule.factory('estimateMainEscalationCostChartService', ['$translate', '$injector', 'platformDataServiceFactory', 'estimateMainService',
		function ($translate, $injector, platformDataServiceFactory, estimateMainService) {
			let estimateMainEscalationCostChartServiceOption = {
				flatLeafItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainEscalationCostChartService',
					entityNameTranslationID: 'estimate.main.escalationCostChartContainer',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/escalationcostchart/',
						endRead: 'list',
						initReadData: function initReadData(readData) {
							let selectedItem = estimateMainService.getSelected();
							readData.EstHeaderFk = selectedItem.EstHeaderFk;
						},
						usePostForRead: true
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {
							codeField: 'EstHeaderFk',
							parentService: estimateMainService,
							itemName: 'EstEscalation',
							// moduleName: 'cloud.desktop.main'
						}
					},
					sidebarSearch:
						{
							options:
								{
									moduleName: 'estimate.main',
									enhancedSearchEnabled: false,
									pattern: '',
									pageSize: 100,
									useCurrentClient: null,
									includeNonActiveItems: false,
									showOptions: true,
									showProjectContext: false,
									withExecutionHints: true
								}
						}
				}
			};
			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainEscalationCostChartServiceOption);
			let service = serviceContainer.service;
			// serviceContainer.service.load();

			return service;
		}]);
})(angular);

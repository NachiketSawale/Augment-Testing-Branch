/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainRuleParamCommonService
	 * @description provides common functionality of rule and parameter lookups
	 */
	angular.module(moduleName).factory('estimateMainRuleParamCommonService', ['$injector',
		function ($injector) {

			function refreshRootService(itemService){
				let rootServices = ['estimateMainRootService', 'estimateMainBoqService', 'estimateMainActivityService'];
				if(!itemService || rootServices.indexOf(itemService) === -1){
					return;
				}
				angular.forEach(rootServices, function(serv){
					if(serv && serv !== itemService){
						let rootService = $injector.get(serv);
						let rootItem = _.find(rootService.getList(), {IsRoot : true});
						if(rootItem){
							rootService.fireItemModified(rootItem);
						}else{
							rootService.gridRefresh();
						}
					}
				});
			}

			return {
				refreshRootService: refreshRootService
			};
		}
	]);

})(angular);


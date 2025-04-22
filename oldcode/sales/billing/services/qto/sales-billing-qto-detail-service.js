/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	var moduleName = 'sales.billing';
	var prcMainModule = angular.module(moduleName);

	prcMainModule.factory('salesBillingQtoDetailService', ['globals', '$http', 'salesBillingBoqStructureService', 'qtoMainDetailServiceFactory', 'salesBillingQtoDetailReadOnlyProcessor', 'basicsLookupdataLookupFilterService', 'qtoBoqType',
		function (globals, $http, parentService, qtoMainDetailServiceFactory, salesBillingQtoDetailReadOnlyProcessor, basicsLookupdataLookupFilterService, qtoBoqType) {
			var service = {};
			service.basrubriccategoryfk = -1;
			var filters = [
				{
					key: 'qto-detail-formula-filter-billing',
					serverSide: true,
					fn: function () {
						let qtoHeader = service.getQtoHeader();
						if(qtoHeader && qtoHeader.BasRubricCategoryFk > 0){
							service.basrubriccategoryfk = qtoHeader.BasRubricCategoryFk;
							return ' BasRubricCategoryFk=' + qtoHeader.BasRubricCategoryFk + ' && IsLive=true';
						}else {
							return ' BasRubricCategoryFk=' + service.basrubriccategoryfk + ' && IsLive=true';
						}
					}
				},
				{
					key: 'qto-main-comment-filter-billing',
					serverSide: true,
					fn: function () {
						let qtoHeader = service.getQtoHeader();
						if(qtoHeader && qtoHeader.BasRubricCategoryFk > 0){
							service.basrubriccategoryfk = qtoHeader.BasRubricCategoryFk;
							return ' BasRubricCategoryFk=' + qtoHeader.BasRubricCategoryFk + ' && IsLive=true';
						}else {
							return ' BasRubricCategoryFk=' + service.basrubriccategoryfk + ' && IsLive=true';
						}
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			var serviceContainer = qtoMainDetailServiceFactory.createNewQtoMainDetailService(parentService, salesBillingQtoDetailReadOnlyProcessor, moduleName, 'salesWipQtoDetailService', qtoBoqType.BillingBoq);
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);

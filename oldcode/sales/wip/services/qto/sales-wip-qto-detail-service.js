/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';
	var prcMainModule = angular.module(moduleName);

	prcMainModule.factory('salesWipQtoDetailService', ['globals', '$http', 'salesWipBoqStructureService', 'qtoMainDetailServiceFactory', 'salesWipQtoDetailReadOnlyProcessor', 'basicsLookupdataLookupFilterService', 'qtoBoqType',
		function (globals, $http, parentService, qtoMainDetailServiceFactory, salesWipQtoDetailReadOnlyProcessor, basicsLookupdataLookupFilterService, qtoBoqType) {
			var service = {};
			service.basrubriccategoryfk = -1;
			var filters = [
				{
					key: 'qto-detail-formula-filter-wip',
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
					key: 'qto-main-comment-filter-wip',
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

			var serviceContainer = qtoMainDetailServiceFactory.createNewQtoMainDetailService(parentService, salesWipQtoDetailReadOnlyProcessor, moduleName, 'salesWipQtoDetailService', qtoBoqType.WipBoq);
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);


(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	var prcMainModule = angular.module(moduleName);
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */ // many parameters because of dependency injection
	prcMainModule.factory('procurementPesQtoDetailService', ['$http', 'prcBoqMainService', 'qtoMainDetailServiceFactory', 'procurementContextService', 'procurementPesQtoDetailReadOnlyProcessor',
		'basicsLookupdataLookupFilterService','qtoBoqType',
		function ($http, prcBoqMainService, qtoMainDetailServiceFactory, moduleContext, procurementPesQtoDetailReadOnlyProcessor, basicsLookupdataLookupFilterService,qtoBoqType) {
			var service = {};
			service.basrubriccategoryfk = -1;

			var parentService = prcBoqMainService.getService(moduleContext.getMainService());

			var filters = [
				{
					key: 'qto-detail-formula-filter-pes',
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
					key: 'qto-main-comment-filter-pes',
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

			var serviceContainer = qtoMainDetailServiceFactory.createNewQtoMainDetailService(parentService, procurementPesQtoDetailReadOnlyProcessor, moduleName, 'procurementPackageQtoDetailService', qtoBoqType.PesBoq);
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);
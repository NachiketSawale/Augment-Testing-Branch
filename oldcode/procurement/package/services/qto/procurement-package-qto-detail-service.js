/**
 * Created by lnt on 21.05.2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	var prcMainModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	prcMainModule.factory('procurementPackageQtoDetailService', ['$http', 'prcBoqMainService', 'qtoMainDetailServiceFactory', 'procurementContextService', 'procurementPackageQtoDetailReadOnlyProcessor',
		'basicsLookupdataLookupFilterService','qtoBoqType',
		function ($http, prcBoqMainService, qtoMainDetailServiceFactory, moduleContext, procurementPackageQtoDetailReadOnlyProcessor, basicsLookupdataLookupFilterService,qtoBoqType) {
			var service = {};
			service.basrubriccategoryfk = -1;

			var parentService = prcBoqMainService.getService(moduleContext.getMainService());

			var filters = [
				{
					key: 'qto-detail-formula-filter-prc',
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
					key: 'qto-main-comment-filter-prc',
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

			var serviceContainer = qtoMainDetailServiceFactory.createNewQtoMainDetailService(parentService, procurementPackageQtoDetailReadOnlyProcessor, moduleName, 'procurementPackageQtoDetailService', qtoBoqType.PrcBoq);
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);
/**
 * Created by lnt on 21.05.2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	boqMainModule.factory('boqMainQtoDetailService', ['$http', 'boqMainService', 'qtoMainDetailServiceFactory', 'boqMainQtoDetailReadOnlyProcessor', 'basicsLookupdataLookupFilterService', 'qtoBoqType',
		function ($http, parentService, qtoMainDetailServiceFactory, boqMainQtoDetailReadOnlyProcessor, basicsLookupdataLookupFilterService, qtoBoqType) {
			var service = {};
			service.basrubriccategoryfk = -1;

			var filters = [
				{
					key: 'qto-detail-formula-filter-prj',
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
					key: 'qto-main-comment-filter-prj',
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

			var serviceContainer = qtoMainDetailServiceFactory.createNewQtoMainDetailService(parentService, boqMainQtoDetailReadOnlyProcessor, moduleName, 'boqMainQtoDetailService', qtoBoqType.PrjBoq);
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);
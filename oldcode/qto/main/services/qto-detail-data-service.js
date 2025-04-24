(function (angular) {
	'use strict';
	var moduleName = 'qto.main';
	var qtoMainModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection

	qtoMainModule.factory('qtoMainDetailService', ['qtoMainHeaderDataService', 'qtoMainDetailServiceFactory', 'qtoQtoReadOnlyProcessor', 'basicsLookupdataLookupFilterService','qtoBoqType','platformContextService',
		function ( parentService, qtoMainDetailServiceFactory, qtoQtoReadOnlyProcessor, basicsLookupdataLookupFilterService,qtoBoqType,platformContextService) {
			var service = {};

			var filters = [
				{
					key: 'qto-detail-formula-filter',
					serverSide: true,
					fn: function () {
						return ' BasRubricCategoryFk=' + parentService.getSelected().BasRubricCategoryFk + ' && IsLive=true';
					}
				},
				{
					key: 'qto-main-comment-filter',
					serverSide: true,
					fn: function () {
						return ' BasRubricCategoryFk=' + parentService.getSelected().BasRubricCategoryFk;
					}
				},
				{
					key: 'qto-main-controlling-unit-filter',
					serverSide: true,
					serverKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
					fn: function () {
						let entity = service.getSelected();
						let parentEntity = parentService.getSelected();
						if(entity){
							entity.ProjectFk = parentEntity ? parentEntity.ProjectFk : null;
						}
						return {
							ByStructure: true,
							ExtraFilter: false,
							PrjProjectFk: entity ? entity.ProjectFk : null,
							CompanyFk: platformContextService.getContext().clientId,
							FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
							IsProjectReadonly: function () {
								return parentEntity ? parentEntity.ProjectFk : false;
							},
							IsCompanyReadonly: function (){
								return true;
							}
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			var serviceContainer = qtoMainDetailServiceFactory.createNewQtoMainDetailService(parentService, qtoQtoReadOnlyProcessor, moduleName, 'qtoMainDetailService',qtoBoqType.QtoBoq);
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);
/**
 * Created by zwz on 1/9/2019.
 */
(function (angular) {
	'use strict';
	/* globals angular*/
	var moduleName = 'productionplanning.engineering';
	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringMainServiceEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningEngineeringMainServiceEntityPropertychangedExtension provides entity property-changed functionality for main service(engtask data service)
	 *
	 */
	angular.module(moduleName).factory('productionplanningEngineeringMainServiceEntityPropertychangedExtension', service);

	service.$inject = ['$http','$injector', 'basicsLookupdataLookupDescriptorService'];

	function service($http, $injector, basicsLookupdataLookupDescriptorService) {
		var service = {};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				service[prop](entity, field, dataService);
			}
		};

		service.onEventTypeFkChanged = function (entity, field, dataService) {
			var validationService = $injector.get('productionplanningEngineeringTaskValidationService');
			var rubricConstant = $injector.get('productionplanningCommonRubricConstant');
			var extension = $injector.get('productionplanningCommonDerivedEventEntityPropertychangedExtension');
			extension.onEventTypeFkChanged(entity, field, dataService, validationService, rubricConstant.Engineering);
		};

		service.onEngDrawingFkChanged = function (entity, field, dataService) {
			if (entity.EngDrawingFk === null) {
				entity.SiteFk = null;
				entity.EngDrawingTypeFk = null;
				dataService.gridRefresh();
			}
			else {
				basicsLookupdataLookupDescriptorService.loadItemByKey('EngDrawing', entity.EngDrawingFk).then(function (drawing) {
					if (drawing && drawing.PpsItemFk) {
						basicsLookupdataLookupDescriptorService.loadItemByKey({
							options: {
								lookupType: 'PPSItem',
								version: 3
							},
							ngModel: drawing.PpsItemFk
						}, drawing.PpsItemFk).then(function (item) {
							if (item) {
								entity.SiteFk = item.SiteFk;
								dataService.gridRefresh();
							}
						});
					}
					//set EngDrawingTypeFk
					if(drawing){
						entity.EngDrawingTypeFk = drawing.EngDrawingTypeFk;
						dataService.gridRefresh();
					}
				});
			}
		};

		service.onPrjLocationFkChanged = function (entity) {
			var locationCodeService = $injector.get('productionplanningCommonLocationInfoService');
			var location = basicsLookupdataLookupDescriptorService.getLookupItem('LocationInfo', entity.PrjLocationFk);

			if (!location && entity.PrjLocationFk !== null) {
				locationCodeService.handleNewLocation(entity, service);
			}
		};

		//todo...
		// service.onLgmJobFkChanged = function (entity, field, dataService) {
		// 	if (entity.LgmJobFk !== 0&& !_.isNull(entity.LgmJobFk))
		// 	{
		// 		_.each(dataService.getChildServices(), function (childService) {
		// 			//change job of resRequisition according to engtask's job
		// 			if (childService.getServiceName() === 'ProductionplanningEngineeringResRequisitionDataService') {
		// 				_.each(childService.getList(),function (item) {
		// 					if(_.isNull(item.JobFk) || item.JobFk === 0){
		// 						item.JobFk = entity.LgmJobFk;
		// 						var validationServ = $injector.get('productionplanningResourceRequisitionValidationServiceBase').getRequisitionValidationService(childService);
		// 						validationServ.validateJobFk(item,item.JobFk,'JobFk');
		// 						//childService.markItemAsModified(item);
		// 						childService.gridRefresh();
		// 					}
		// 				});
		// 			}
		// 		});
		// 	}
		// };

		return service;
	}
})(angular);
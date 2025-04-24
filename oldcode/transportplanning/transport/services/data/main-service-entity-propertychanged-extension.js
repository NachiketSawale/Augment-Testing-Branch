/**
 * Created by zwz on 4/16/2020.
 */
(function (angular) {
	'use strict';
	/* global globals, moment, _ */
	var moduleName = 'transportplanning.transport';
	 /**
	 * @ngdoc service
	 * @name transportplanningTransportMainServiceEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportMainServiceEntityPropertychangedExtension provides entity property-changed functionality for transport data service
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportMainServiceEntityPropertychangedExtension', service);

	service.$inject = ['$http', '$injector', 'platformRuntimeDataService', 'transportplanningTransportWaypointPlannedtimeDateshiftService'];

	function service($http, $injector, platformRuntimeDataService, waypointPlannedtimeDateshiftService) {
		var service = {};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				service[prop](entity, field, dataService);
			}
		};

		service.onEventTypeFkChanged = function (entity, field, dataService) {
			var validationService = $injector.get('transportplanningTransportValidationService');
			var rubricConstant = $injector.get('productionplanningCommonRubricConstant');
			var extension = $injector.get('productionplanningCommonDerivedEventEntityPropertychangedExtension');
			extension.onEventTypeFkChanged(entity, field, dataService, validationService, rubricConstant.TransportPlanning);
		};
		/* jshint -W098*/
		service.onProjectFkChanged = function (entity, field, dataService) {
			/* if (!_.isNull(entity.ProjectFk) && entity.Version === 0) {
			 	var validationService = $injector.get('transportplanningTransportValidationService');
			 	updateLgmJobFkForNewItem(entity, validationService, dataService);
			 } */
		};

		function updateLgmJobFkForNewItem(item, validationService, dataService) {
			if (item.Version === 0) {
				//If LgmJobFk value is null and a project is set, the default job of the project is set as default.
				if (item.ProjectFk !== null && item.ProjectFk !== 0) {
					$http.get(globals.webApiBaseUrl + 'transportplanning/transport/route/getlgmjob?projectId=' + item.ProjectFk).then(function (respond) {
						if (!_.isNull(respond.data)) {
							var trsConfig = respond.data;
							item.LgmJobFk = trsConfig.JobFk === 0 ? null : trsConfig.JobFk;
							item.SiteFk = trsConfig.SiteFk === 0 ? null : trsConfig.SiteFk;
							validationService.validateLgmJobFk(item, item.LgmJobFk, 'LgmJobFk');
							platformRuntimeDataService.applyValidationResult(true, item, 'LgmJobFk');
							dataService.markItemAsModified(item);
						}
					});
				}
			}
		}

		service.onProjectDefFkChanged = function (item, field, dataService) {
			if (_.isNull(item[field]) || item[field] === 0) {
				item.JobDefFk = null;
				dataService.markItemAsModified(item);
			}
			else {
				$http.get(globals.webApiBaseUrl + 'productionplanning/common/lgmjob/getlgmjobid?projectId=' + item[field]).then(function (respond) {
					item.JobDefFk = respond.data;//the jobId that searched by projectId maybe null or a non-null value.It's logical.
					dataService.markItemAsModified(item);
				});
			}
		};

		service.onJobDefFkChanged = function (entity, field, dataService) {
			updateJobRelatedProperties(entity, entity.selectedJobDef, dataService);
		};

		function updateJobRelatedProperties(entity, selected, dataService) {
			if (entity) {
				selected = selected || {};
				var relatedProperties = ['BusinessPartnerFk', 'DeliveryAddressContactFk', 'SubsidiaryFk', 'CustomerFk'];
				relatedProperties.forEach(function (item) {
					entity[item] = selected[item];
				});
				//update ProjectDefFk by selected job's ProjectFk, if ProjectDefFk has no value
				if (selected.ProjectFk && (_.isNil(entity.ProjectDefFk) || entity.ProjectDefFk === 0)) {
					entity.ProjectDefFk = selected.ProjectFk;
				}
				dataService.markItemAsModified(entity);
				dataService.mergeItemAfterSuccessfullUpdate(entity, entity, true);
			}
		}

		service.onLgmJobFkChanged= function (entity, field, dataService) {
			if(entity){
				var selected = entity.selectedJob || {};
				if(selected.ProjectFk && (_.isNil(entity.ProjectFk) || entity.ProjectFk === 0)) {
					entity.ProjectFk = selected.ProjectFk;
					var validationService = $injector.get('transportplanningTransportValidationService');
					validationService.validateProjectFk(entity, entity.ProjectFk, 'ProjectFk');
					platformRuntimeDataService.applyValidationResult(true, entity, 'ProjectFk');
					dataService.markItemAsModified(entity);
				}
			}
		};

		service.onPlannedDeliveryChanged = service.onActualDeliveryChanged = function (entity, field, dataService) {
			if(field === 'PlannedDelivery' && _.isNil(entity[field])){
				return;
			}
			entity.PDChanged = true;
			var waypointServ = $injector.get('transportplanningTransportWaypointDataService');
			var wpList = waypointServ.getList();
			if(_.isNil(wpList) || wpList.length === 0){
				wpList = entity.waypointsBackup;
			}
			if(wpList && wpList.length > 0 &&  entity.Id === wpList[0].TrsRouteFk){
				service.shiftTimeforWaypoints(entity, field, dataService,wpList, waypointServ);
			}
		};

		service.shiftTimeforWaypoints = function shiftTimeforWaypoints(entity, field, dataService,wpList, waypointServ){
			var wp = _.find(wpList, { IsDefaultDst: true });
			if (wp) {
				// sync corresponding waypoint's PlannedTime/ActualTime
				var prop = {
					'PlannedDelivery': 'PlannedTime',
					'ActualDelivery': 'ActualTime'
				}[field];
				var originalTime = _.cloneDeep(wp[prop]);
				wp[prop] = _.cloneDeep(entity[field]);
				waypointServ.markItemAsModified(wp);
				if (field === 'PlannedDelivery') {
					waypointPlannedtimeDateshiftService.shiftTime(wpList, wp, originalTime, waypointServ);
					waypointServ.calculateDistance(field);
					var selectedRoute = dataService.getSelected();
					$injector.get('transportplanningTransportValidationService').validatePlannedDelivery(selectedRoute, selectedRoute.PlannedDelivery, 'PlannedDelivery');
				}
				waypointServ.gridRefresh();
			}
		};

		return service;
	}
})(angular);
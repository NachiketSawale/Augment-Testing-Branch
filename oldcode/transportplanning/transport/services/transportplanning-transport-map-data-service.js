/**
 * Created by las on 7/18/2018.
 */

(function () {

	'use strict';
	/*global angular, globals */
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('transportplanningTransportMapDataService', transportplanningTransportMapDataService);

	transportplanningTransportMapDataService.$inject = ['_', 'transportplanningTransportMainService',
		'basicsCommonMapAddressRegisterService', '$q', '$http',
		'transportplanningTransportWaypointDataService',
		'transportplanningTransportUtilService'];
	function transportplanningTransportMapDataService(_, transportMainService,
		mapAddressRegisterService, $q, $http,
		transportWaypointDataService,
		transportUtilService) {

		var service = {};
		var calculatedWPs = [];
		var unitDirection = {};
		var unitMap = {};

		function fillConversionFactors(originUnitInfo, calculatedWPs) {
			var defer = $q.defer();
			getOriginUnitId(originUnitInfo).then(function (response) {
				var unitId = response;
				if (unitId >= 1) {
					// fill the unit id for calculatedWPs
					_.each(calculatedWPs, function (wp) {
						if (wp.UomFk === undefined || wp.UomFk === null) {
							wp.UomFk = unitId;
						}
					});
					//filter the
					var unitFactors = unitDirection[unitId];
					var ids = _.uniq(_.map(calculatedWPs, 'UomFk'));  //
					var unfindIds = _.filter(ids, function (id) {
						return unitFactors[id] === undefined;
					});
					if (unfindIds.length > 0) {
						var strIds = _.toString(unfindIds);
						$http.get(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/conversionfactor?originUnitId=' + unitId + '&&unitIds=' + strIds).then(function (response) {
							var factorMaps = response.data.factorInfo;
							_.each(factorMaps, function (factorMap) {
								unitFactors[factorMap.unitId] = factorMap.converFactor;
							});
							defer.resolve(unitId);
						});
					}
					else {
						defer.resolve(unitId);
					}
				}
				else {
					defer.resolve(unitId);
				}
			});
			return defer.promise;
		}

		function getOriginUnitId(originUnitInfo) {
			var defer = $q.defer();
			var unitId = unitMap[originUnitInfo];
			if (unitId === undefined || unitId === null) {
				$http.get(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/getunitid?originUnitInfo=' + originUnitInfo).then(function (response) {
					unitId = unitMap[originUnitInfo] = response.data;
					unitDirection[unitId] = {};
					defer.resolve(unitId);
				});
			}
			else {
				defer.resolve(unitId);
			}
			return defer.promise;
		}

		function getConversionFactor(originUnitId, unitId) {
			var factor = -1;
			var unitfactors = unitDirection[originUnitId];
			if (unitfactors !== undefined && unitfactors !== null) {
				factor = unitfactors[unitId];
			}
			return factor;
		}

		function getAddressEntities(waypoints) {
			var addressEntities = [];
			_.each(waypoints, function (waypoint) {
				if (waypoint.Address !== null && waypoint.Address !== undefined) {
					var address = {};
					_.forEach(waypoint.Address, function (propValue, propName) {
						var camelCaseProp = propName.toLowerCase();
						address[camelCaseProp] = propValue;
					});
					//set id of waypoint
					address.waypointEntityId = waypoint.Id;
					// if(basicsCommonUtilities.isLatLongValid(address)){
					addressEntities.push(address);
					calculatedWPs.push(waypoint);
					//}
				}
			});
			return addressEntities;
		}

		function setShowRoutes(waypoints) {
			var addressEntities = getAddressEntities(waypoints);
			mapAddressRegisterService.setShowRoutes(addressEntities, moduleName);
			if (waypoints.length > 0 && !transportUtilService.hasShowContainer('transportplanning.transport.waypoint.list')) {
				transportWaypointDataService.setSelected(waypoints[0]);
			}
		}

		function setCalculateDist(waypoints) {
			calculatedWPs = [];
			var addressEntities = getAddressEntities(waypoints);
			if (addressEntities.length > 1) {
				mapAddressRegisterService.setCalculateDist(addressEntities, moduleName);
			}
		}

		function setDistance(originUnitInfo, distances) {
			var i = 0;
			fillConversionFactors(originUnitInfo, calculatedWPs).then(function (response) {
				var originUnitId = response;
				if (originUnitId >= 1) {
					_.each(calculatedWPs, function (waypoint) {
						var factor = getConversionFactor(originUnitId, waypoint.UomFk);
						waypoint.Distance = distances[i] * factor;
						i++;
					});
					transportWaypointDataService.markEntitiesAsModified(calculatedWPs);
					transportMainService.setRouteDistanceUom();
					transportMainService.updateSumInfo('Distance');
				}
			});
		}

		service.setShowRoutes = setShowRoutes;
		service.setDistance = setDistance;
		service.setCalculateDist = setCalculateDist;

		return service;
	}
})();
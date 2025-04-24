/**
 * Created by las on 7/18/2018.
 */

(function () {

	'use strict';
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).controller('transportplanningTransportMapController', TransportMapController);

	TransportMapController.$inject = ['$scope', 'basicsCommonMapAddressControllerService',
		'transportplanningTransportMapDataService',
		'transportplanningTransportWaypointDataService',
		'basicsCommonBingMapV8',
		'$q',
		'transportplanningTransportUtilService',
		'transportplanningTransportMainService',
		'_',
		'basicsCommonMapSnapshotService'];

	function TransportMapController($scope, addressControllerService,
		transportMapDataService,
		waypointDataService,
		bingMapV8Service,
		$q,
		utilService,
		routeService,
		_,
		basicsCommonMapSnapshotService) {

		const paramNamesForSnapshot = {
			Code: 'Code',
			LgmJobId: 'LgmJobFk'
		};

		addressControllerService.initController($scope);


		$scope.$on('hadShowRoutes', function () {
			$scope.bShowRoutes = false;
		});

		$scope.$on('hadCalculate', function () {
			$scope.bCalculateDist = false;
		});

		$scope.$on('finishCal', function (data) {
			var distance = data.targetScope.distanceData.distances;
			var originUnitInfo = data.targetScope.distanceData.unitInfo;
			distance.unshift(0);
			transportMapDataService.setDistance(originUnitInfo, distance);
		});


		basicsCommonMapSnapshotService.setMapSnapshotTools($scope.$parent, true);


		function onWaypointSelectionChanged(event, selectedWaypoint) {
			if (selectedWaypoint) {
				var filterObject = {
					waypointEntityId: selectedWaypoint.Id
				};
				basicsCommonMapSnapshotService.updateSnapshotItemList(routeService.getSelected().Waypoints, paramNamesForSnapshot, $scope.$parent);
				$scope.$broadcast('selectPin', filterObject, selectedWaypoint);
			}
		}
		waypointDataService.registerSelectionChanged(onWaypointSelectionChanged);

		/**
		 * Click waypoint on map then set waypoint selected in container
		 * @param index
		 */
		function waypointClicked(metaData) {
			var list = [];
			var defer = $q.defer();
			var selected = {};
			if (utilService.hasShowContainer('transportplanning.transport.waypoint.list')) {
				list = waypointDataService.getList();
				selected = _.find(list, {Id: metaData.entity.waypointEntityId});
				waypointDataService.setSelected(selected);
			}
			else{
				list = routeService.getSelected().Waypoints;
				selected = _.find(list, {Id: metaData.entity.waypointEntityId});
			}

			defer.resolve(selected);
			return defer.promise;
		}

		bingMapV8Service.onWaypointClick.register(waypointClicked);

		//init route if entering the module with an active selection
		if (routeService.hasSelection()) {
			var waypointList;
			if (utilService.hasShowContainer('transportplanning.transport.waypoint.list')) {
				waypointList = waypointDataService.getList();
			} else {
				waypointList = routeService.getSelected().Waypoints;
			}
			basicsCommonMapSnapshotService.updateSnapshotItemList(waypointList, paramNamesForSnapshot, $scope.$parent);
			transportMapDataService.setShowRoutes(waypointList);
		}

		function updateSnapshotWaypointList() {
			basicsCommonMapSnapshotService.updateSnapshotItemList(waypointDataService.getList(), paramNamesForSnapshot, $scope.$parent);
		}

		if (utilService.hasShowContainer('transportplanning.transport.waypoint.list')) {
			waypointDataService.registerListLoaded(updateSnapshotWaypointList);
		}
		$scope.$on('$destroy', function () {
			bingMapV8Service.onWaypointClick.unregister(waypointClicked);
			waypointDataService.unregisterSelectionChanged(onWaypointSelectionChanged);
			waypointDataService.unregisterListLoaded(updateSnapshotWaypointList);
		});
	}
})();
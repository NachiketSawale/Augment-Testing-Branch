/**
 * Created by anl on 8/11/2021.
 */

/* global angular, globals, _, moment */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateRouteInfoViewService', CreateRouteDispatchHeaderService);

	CreateRouteDispatchHeaderService.$inject = [
		'$injector', '$translate', '$timeout',
		'platformGridAPI',
		'platformDataValidationService',
		'transportplanningTransportCreateRouteTabService',
		'$http',
		'transportplanningTransportCreateRouteDialogUIStandardService',
		'$q',
		'platformRuntimeDataService',
		'basicsCompanyNumberGenerationInfoService',
		'ppsCommonCodGeneratorConstantValue'];

	function CreateRouteDispatchHeaderService(
		$injector, $translate, $timeout,
		platformGridAPI,
		platformDataValidationService,
		tabService,
		$http,
		UIStandardService,
		$q,
		platformRuntimeDataService,
		basicsCompanyNumberGenerationInfoService,
		ppsCommonCodGeneratorConstantValue) {

		var service = {};
		var scope = {};

		var Cache = {
			Route: {},
			Waypoints: {},
			Packages: {}
		};

		service.initialize = function initialize($scope) {
			scope = $scope;
			var getScopeEntity = function () {
				return scope.context.NewRoute;
			};
			scope.formOptions = UIStandardService.getCreateRouteFromOptions(getScopeEntity);
			tabService.initialize(scope);
			service.active();
		};

		service.isValid = function () {
			return true;
		};

		service.unActive = function () {

		};

		service.active = function () {
			initData();
		};

		service.getResult = function () {
			return {
				NewRoute: scope.context.NewRoute,
				Waypoints: scope.context.Waypoints,
				Packages: scope.context.Packages
			};
		};

		function initData() {
			scope.isBusy = true;
			var postData = {
				DispatchHeaders: scope.context.DispatchHeaders,
				PlannedDelivery: scope.context.PlannedDelivery.format('YYYY-MM-DDTHH:mm:ss')
			};
			$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createForDispatchHeader', postData)
				.then(function (response) {

					_.forEach( response.data.waypoints, function (wp) {
						wp.PlannedTime = wp.PlannedTime !== null ? moment.utc(wp.PlannedTime) : null;
					});

					scope.context.NewRoute = response.data.route;
					scope.context.Waypoints = response.data.waypoints;
					scope.context.Packages = response.data.packages;
					scope.context.NewRoute.PlannedDelivery = scope.context.PlannedDelivery;
					scope.formOptions.entity = scope.context.NewRoute;

					ppsCommonCodGeneratorConstantValue.synLoadEventType().then(function (respond){
						var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(response.data.route.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportRoute);
						if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').hasToGenerateForRubricCategory(categoryId) ) {
							scope.context.NewRoute.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').provideNumberDefaultText(categoryId);
							platformRuntimeDataService.readonly(scope.context.NewRoute, [{field: 'Code', readonly: true}]);
						}
					});

					//init waypoint
					$timeout(function () {
						var grid = platformGridAPI.grids.element('id', 'a6c5fff882aa4ac59cc954cca95334a7');
						setWaypointIcons(scope.context.Waypoints);
						grid.dataView.setItems(scope.context.Waypoints);
						platformGridAPI.grids.refresh('a6c5fff882aa4ac59cc954cca95334a7', true);
						scope.isBusy = false;
					}, 300);
				});
		}

		function setWaypointIcons(waypoints){
			var iconService = $injector.get('transportplanningTransportWaypointDefaultSrcDstService');

			_.forEach(waypoints, function(w){
				iconService.updateSrcDst(w);
			});
		}

		return service;
	}
})(angular);

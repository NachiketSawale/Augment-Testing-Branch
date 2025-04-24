/**
 * Created by anl on 12/29/2020.
 */

(function (angular) {
	'use strict';
	/*global angular, globals, _*/
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionPlantRequisitionController', PlantRequisitionController);

	PlantRequisitionController.$inject = [
		'$scope',
		'$options',
		'$injector',
		'$translate',
		'$http',
		'transportplanningRequisitionMainService',
		'platformModuleStateService',
		'transportplanningTransportStepsService',
		'platformNavBarService'];

	function PlantRequisitionController(
		$scope,
		$options,
		$injector,
		$translate,
		$http,
		requisitionMainService,
		platformModuleStateService,
		transportplanningTransportStepsService,
		platformNavBarService) {

		$scope.isBusy = false;
		$scope.steps = [
			{
				url: 'transportplanning.requisition/partials/transport-requisition-select-plant.html',
				service: 'transportplanningRequisitionSelectPlantService',
				title: $translate.instant('transportplanning.requisition.wizard.selectPlant'),
				isInitialized: true
			},
			{
				url: 'transportplanning.requisition/partials/transport-requisition-create-plant-requisition.html',
				service: 'transportplanningRequisitionCreatePlantRequisitionService',
				title: $translate.instant('transportplanning.requisition.wizard.createRequisition')
			}
		];
		$scope.context = {
			plants: [],
			preSelectedRequisition: $options.entity
		};

		$scope.finish = finish;
		transportplanningTransportStepsService.initialize($scope);

		_.extend($scope.modalOptions, {
			headerText: $translate.instant('transportplanning.requisition.wizard.returnRequisitionCreation'),
			cancel: close
		});

		function close() {
			return $scope.$close(false);
		}

		$scope.$on('$destroy', function () {
			var modState = platformModuleStateService.state(requisitionMainService.getModule());
			if (modState.validation && modState.validation.issues) {
				modState.validation.issues.length = 0;//delete all the issues
			}
		});


		function finish() {
			$scope.isBusy = true;

			var step2Result = transportplanningTransportStepsService.getService($scope.steps[1].service).getResult();
			var step1Result = transportplanningTransportStepsService.getService($scope.steps[0].service).getResult();

			var plantGoods = [];
			_.forEach(step1Result.selectedPlants, function (plant) {
				plantGoods.push({
					Id: plant.OriginalId,
					EtmPlantFk: plant.OriginalId,
					Quantity: plant.TransportQuantity,
					UomFk: plant.PlantUom,
					TrsGoodsTypeFk: 4
				});
			});

			var postData = {
				NewRequisition: step2Result,
				TransportGoods: plantGoods
			};

			var url = 'transportplanning/requisition/wizard/saveReturnRequisition';
			$http.post(globals.webApiBaseUrl + url, postData).then(function (result) {
				platformNavBarService.getActionByKey('refresh').fn().then(function () {
					if (_.find(requisitionMainService.getList(), {Id: result.data.Id})) {
						requisitionMainService.setSelected(result.data);
					}
					$scope.$close(true);
				});
			}, function () {
				$scope.isBusy = false;
			});
		}
	}
})(angular);
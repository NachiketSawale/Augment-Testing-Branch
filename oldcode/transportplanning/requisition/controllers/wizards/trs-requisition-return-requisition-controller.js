(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionReturnRequisitionController', ReturnRequisitionCreationController);

	ReturnRequisitionCreationController.$inject = [
		'_',
		'$scope',
		'$options',
		'$injector',
		'$translate',
		'$http',
		'transportplanningRequisitionMainService',
		'platformModuleStateService',
		'transportplanningTransportStepsService',
		'platformNavBarService'];

	function ReturnRequisitionCreationController(
		_,
		$scope,
		$options,
		$injector,
		$translate,
		$http,
		requisitionMainService,
		platformModuleStateService,
		transportplanningTransportStepsService,
		platformNavBarService) {


		initializeScope();

		function initializeScope() {
			$scope.isBusy = false;
			$scope.forUnplanned = true;
			$scope.steps = [
				{
					url: 'transportplanning.requisition/partials/transport-requisition-select-resource.html',
					service: 'transportplanningRequisitionSelectResourceService',
					title: $translate.instant('transportplanning.requisition.wizard.selectResource'),
					isInitialized: true
				},
				{
					url: 'transportplanning.requisition/partials/transport-requisition-create-requisition.html',
					service: 'transportplanningRequisitionCreateRequisitionService',
					title: $translate.instant('transportplanning.requisition.wizard.createRequisition')
				}
			];
			$scope.context = {
				resources: [],
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
		}

		function finish() {
			$scope.isBusy = true;

			var step2Result = transportplanningTransportStepsService.getService($scope.steps[1].service).getResult();
			var step1Result = transportplanningTransportStepsService.getService($scope.steps[0].service).getResult();

			var resourceGoods = [];
			_.forEach(step1Result.selectedResources, function (resource) {
				resourceGoods.push({
					Id: resource.OriginalId,
					ResResourceFk: resource.OriginalId,
					Quantity: resource.TransportQuantity,
					UomFk: resource.ResourceUom,
					TrsGoodsTypeFk: 5
				});
			});


			var postData = {
				NewRequisition: step2Result,
				TransportGoods: resourceGoods
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
(function (angular) {
	'use strict';
	var module = 'productionplanning.common';

	angular.module(module).factory('productionPlanningJobAddressBlobControllerFactory', ProductionPlanningJobAddressBlobControllerFactory);
	ProductionPlanningJobAddressBlobControllerFactory.$inject = ['$http', 'logisticJobAddressBlobService'];

	function ProductionPlanningJobAddressBlobControllerFactory($http, blobService) {
		var service = {};

		service.initController = function ($scope, dataService, field) {
			$scope.file = { src:null };
			$scope.viewContentLoading = false;
			getFile();

			function getFile() {
				var selectedItem = dataService.getSelected();
				var hasFile = false;
				if (selectedItem && selectedItem[field]) {
					$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + selectedItem[field])
						.then(function (response) {
							if (response.data) {
								var item = response.data;
								$scope.file.src = null;
								blobService.cancelRequest();
								if (item && item.DeliveryAddressBlobFk) {
									$scope.viewContentLoading = true;
									blobService.getFile(item.DeliveryAddressBlobFk).then(function (base64String) {
										reset();
										$scope.file.src = base64String;
										hasFile = true;
									});
								}
							}
						});
				}

				if (!hasFile) {
					reset();
				}
			}

			function fieldChanged(entity, changedField) {
				if (changedField === field) {
					getFile();
				}
			}

			function reset() {
				$scope.file.src = null;
				$scope.info2 = null;
				$scope.viewContentLoading = false;
			}

			dataService.registerSelectionChanged(getFile);

			if (dataService.fieldChanged) {
				dataService.fieldChanged.register(fieldChanged);
			}

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(getFile);
				if (dataService.fieldChanged) {
					dataService.fieldChanged.unregister(fieldChanged);
				}
			});
		};

		return service;
	}
})(angular);

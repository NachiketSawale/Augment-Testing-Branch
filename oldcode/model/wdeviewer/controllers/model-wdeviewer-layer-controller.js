/**
 * Created by wui on 4/27/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewLayerController', ['$scope', 'wdeCtrl', 'statusBarLink',
		function ($scope, wdeCtrl, statusBarLink) {
			$scope.layers = wdeCtrl.getLayers();

			function hasLayerFiler() {
				return $scope.layers.some(function (layer) {
					return !layer.checked;
				});
			}

			function updateLayerStatus() {
				statusBarLink.updateFields([{
					id: 'layer',
					cssClass: hasLayerFiler() ? 'control-icons ico-filter-on' : 'control-icons ico-filter-off'
				}]);
			}

			$scope.turnOff = function () {
				$scope.layers.forEach(function (layer) {
					layer.checked = true;
					wdeCtrl.setLayerVisibility(layer.id, true);
				});

				updateLayerStatus();
			};

			$scope.toggleAll = function () {
				$scope.layers.forEach(function (layer) {
					layer.checked = !layer.checked;
					wdeCtrl.setLayerVisibility(layer.id, layer.checked);
				});

				updateLayerStatus();
			};

			$scope.toggleItem = function (layer) {
				// layer.checked = !layer.checked;
				wdeCtrl.setLayerVisibility(layer.id, layer.checked);

				updateLayerStatus();
			};
		}
	]);

})(angular);
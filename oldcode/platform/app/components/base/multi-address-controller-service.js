(function () {
	'use strict';

	angular.module('platform').service('platformMultiAddressControllerService', PlatformMultiAddressController);

	PlatformMultiAddressController.$inject = ['platformMultiAddressService'];

	function PlatformMultiAddressController(platformMultiAddressService) {
		var self = this;

		self.initController = function initController($scope) {
			$scope.entities = [];

			platformMultiAddressService.registerOnEntitiesAdded(setEntities);

			function setEntities(entities) {
				$scope.entities = entities;
			}

			$scope.$on('$destroy', function () {
				platformMultiAddressService.unregisterOnEntitiesAdded(setEntities);
			});
		};

	}
})();

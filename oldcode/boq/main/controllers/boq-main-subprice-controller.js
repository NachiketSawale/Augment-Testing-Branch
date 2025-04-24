(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name boqMainSubpriceController
	 * @function
	 * @description
	 */

	angular.module('boq.main').controller('boqMainSubpriceController', ['$scope', 'boqMainSubpriceControllerService','boqMainService',
		function ($scope, boqMainSubpriceControllerService, boqMainService) {
			boqMainSubpriceControllerService.getInstance($scope, boqMainService);
		}
	]);
})();
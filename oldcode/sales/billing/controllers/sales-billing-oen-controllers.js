(function () {
	'use strict';


	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingOenBoqItemFormController
	 * @function
	 * @description
	 */

	angular.module(moduleName).controller('salesBillingOenBoqItemFormController', ['$scope', 'boqMainOenBoqItemFormControllerService', 'salesBillingBoqStructureService',
		function($scope, boqMainOenBoqItemFormControllerService, salesBillingBoqStructureService) {
			boqMainOenBoqItemFormControllerService.createDetailController($scope, salesBillingBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesBillingOenLvHeaderController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenLvHeaderController', ['$scope', 'boqMainOenLvHeaderControllerService', 'salesBillingBoqStructureService',
		function($scope, boqMainOenLvHeaderControllerService, salesBillingBoqStructureService) {
			boqMainOenLvHeaderControllerService.getInstance($scope, salesBillingBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesBillingOenAkzController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenAkzController', ['$scope', 'boqMainOenAkzControllerService','salesBillingBoqStructureService',
		function ($scope, boqMainOenAkzControllerService, salesBillingBoqStructureService) {
			boqMainOenAkzControllerService.getInstance($scope, salesBillingBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesBillingOenZzController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenZzController', ['$scope', 'boqMainOenZzControllerService','salesBillingBoqStructureService',
		function ($scope, boqMainOenZzControllerService, salesBillingBoqStructureService) {
			boqMainOenZzControllerService.getInstance($scope, salesBillingBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesBillingOenZzVariantController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenZzVariantController', ['$scope', 'boqMainOenZzVariantControllerService','salesBillingBoqStructureService',
		function ($scope, boqMainOenZzVariantControllerService, salesBillingBoqStructureService) {
			boqMainOenZzVariantControllerService.getInstance($scope, salesBillingBoqStructureService);
		}
	]);
	/**
	 * @ngdoc controller
	 * @name salesBillingOenLbMetadataController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenLbMetadataController', ['$scope', 'boqMainOenLbMetadataControllerService', 'salesBillingBoqStructureService',
		function($scope, boqMainOenLbMetadataControllerService, salesBillingBoqStructureService) {
			boqMainOenLbMetadataControllerService.getInstance($scope, salesBillingBoqStructureService);
		}
	]);
	/**
	 * @ngdoc controller
	 * @name salesBillingOenContactController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenContactController', ['$scope', 'boqMainOenContactControllerService', 'salesBillingBoqStructureService',
		function($scope, boqMainOenContactControllerService, salesBillingBoqStructureService) {
			boqMainOenContactControllerService.getInstance($scope, salesBillingBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesBillingOenPictureController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenPictureController', ['$scope', 'boqMainOenPictureService', 'salesBillingBoqStructureService', 'basicsCommonPhotoControllerBase',
		function($scope, boqMainOenPictureService, salesBillingBoqStructureService, basicsCommonPhotoControllerBase) {
			var boqPictureService = boqMainOenPictureService.init($scope, salesBillingBoqStructureService);
			basicsCommonPhotoControllerBase($scope, boqPictureService, { hideChangeItem:true, createItem:boqPictureService.createItemExtended, deleteItem : boqPictureService.deleteItemExtended });
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesBillingOenServicePartController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesBillingOenServicePartController', ['$scope', 'boqMainOenServicePartControllerService','salesBillingBoqStructureService',
		function ($scope, boqMainOenServicePartControllerService, salesBillingBoqStructureService) {
			boqMainOenServicePartControllerService.getInstance($scope, salesBillingBoqStructureService);
		}
	]);

})();
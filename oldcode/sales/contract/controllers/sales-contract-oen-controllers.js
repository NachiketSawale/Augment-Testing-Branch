(function () {
	'use strict';


	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractOenBoqItemFormController
	 * @function
	 * @description
	 */

	angular.module(moduleName).controller('salesContractOenBoqItemFormController', ['$scope', 'boqMainOenBoqItemFormControllerService', 'salesContractBoqStructureService',
		function($scope, boqMainOenBoqItemFormControllerService, salesContractBoqStructureService) {
			boqMainOenBoqItemFormControllerService.createDetailController($scope, salesContractBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesContractOenLbMetadataController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesContractOenLbMetadataController', ['$scope', 'boqMainOenLbMetadataControllerService', 'salesContractBoqStructureService',
		function($scope, boqMainOenLbMetadataControllerService, salesContractBoqStructureService) {
			boqMainOenLbMetadataControllerService.getInstance($scope, salesContractBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesContractOenContactController
	 * @function
	 * @description
	 */

	angular.module(moduleName).controller('salesContractOenContactController', ['$scope', 'boqMainOenContactControllerService', 'salesContractBoqStructureService',
		function($scope, boqMainOenContactControllerService, salesContractBoqStructureService) {
			boqMainOenContactControllerService.getInstance($scope, salesContractBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesContractOenPictureController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesContractOenPictureController', ['$scope', 'boqMainOenPictureService', 'salesContractBoqStructureService', 'basicsCommonPhotoControllerBase',
		function($scope, boqMainOenPictureService, salesContractBoqStructureService, basicsCommonPhotoControllerBase) {
			var boqPictureService = boqMainOenPictureService.init($scope, salesContractBoqStructureService);
			basicsCommonPhotoControllerBase($scope, boqPictureService, { hideChangeItem:true, createItem:boqPictureService.createItemExtended, deleteItem : boqPictureService.deleteItemExtended });
		}
	]);


	/**
	 * @ngdoc controller
	 * @name salesContractOenLvHeaderController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesContractOenLvHeaderController', ['$scope', 'boqMainOenLvHeaderControllerService', 'salesContractBoqStructureService',
		function($scope, boqMainOenLvHeaderControllerService, salesContractBoqStructureService) {
			boqMainOenLvHeaderControllerService.getInstance($scope, salesContractBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesContractOenAkzController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesContractOenAkzController', ['$scope', 'boqMainOenAkzControllerService','salesContractBoqStructureService',
		function ($scope, boqMainOenAkzControllerService, salesContractBoqStructureService) {
			boqMainOenAkzControllerService.getInstance($scope, salesContractBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesContractOenZzController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesContractOenZzController', ['$scope', 'boqMainOenZzControllerService','salesContractBoqStructureService',
		function ($scope, boqMainOenZzControllerService, salesContractBoqStructureService) {
			boqMainOenZzControllerService.getInstance($scope, salesContractBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesContractOenZzVariantController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesContractOenZzVariantController', ['$scope', 'boqMainOenZzVariantControllerService','salesContractBoqStructureService',
		function ($scope, boqMainOenZzVariantControllerService, salesContractBoqStructureService) {
			boqMainOenZzVariantControllerService.getInstance($scope, salesContractBoqStructureService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name salesContractOenServicePartController
	 * @function
	 * @description
	 */
	angular.module(moduleName).controller('salesContractOenServicePartController', ['$scope', 'boqMainOenServicePartControllerService','salesContractBoqStructureService',
		function ($scope, boqMainOenServicePartControllerService, salesContractBoqStructureService) {
			boqMainOenServicePartControllerService.getInstance($scope, salesContractBoqStructureService);
		}
	]);

})();
(function () {
	'use strict';

	var wipModule = angular.module('sales.wip');

	wipModule.controller('salesWipOenBoqItemFormController', ['$scope', 'boqMainOenBoqItemFormControllerService', 'salesWipBoqStructureService',
		function($scope, boqMainOenBoqItemFormControllerService, salesWipBoqStructureService) {
			boqMainOenBoqItemFormControllerService.createDetailController($scope, salesWipBoqStructureService);
		}
	]);
	wipModule.controller('salesWipOenLVHeaderController', ['$scope', 'boqMainOenLvHeaderControllerService','salesWipBoqStructureService',
		function($scope, boqMainOenLvHeaderControllerService,salesWipBoqStructureService) {
			boqMainOenLvHeaderControllerService.getInstance($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipOenAkzController', ['$scope', 'boqMainOenAkzControllerService','salesWipBoqStructureService',
		function ($scope, boqMainOenAkzControllerService, salesWipBoqStructureService) {
			boqMainOenAkzControllerService.getInstance($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipOenZzController', ['$scope', 'boqMainOenZzControllerService','salesWipBoqStructureService',
		function ($scope, boqMainOenZzControllerService, salesWipBoqStructureService) {
			boqMainOenZzControllerService.getInstance($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipOenZzVariantController', ['$scope', 'boqMainOenZzVariantControllerService','salesWipBoqStructureService',
		function ($scope, boqMainOenZzVariantControllerService, salesWipBoqStructureService) {
			boqMainOenZzVariantControllerService.getInstance($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipOenLbMetadataController', ['$scope', 'boqMainOenLbMetadataControllerService', 'salesWipBoqStructureService',
		function($scope, boqMainOenLbMetadataControllerService, salesWipBoqStructureService) {
			boqMainOenLbMetadataControllerService.getInstance($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipOenContactController', ['$scope', 'boqMainOenContactControllerService', 'salesWipBoqStructureService',
		function($scope, boqMainOenContactControllerService, salesWipBoqStructureService) {
			boqMainOenContactControllerService.getInstance($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipOenPictureController', ['$scope', 'boqMainOenPictureService', 'salesWipBoqStructureService', 'basicsCommonPhotoControllerBase',
		function($scope, boqMainOenPictureService, salesWipBoqStructureService, basicsCommonPhotoControllerBase) {
			var boqPictureService = boqMainOenPictureService.init($scope, salesWipBoqStructureService);
			basicsCommonPhotoControllerBase($scope, boqPictureService, { hideChangeItem:true, createItem:boqPictureService.createItemExtended, deleteItem : boqPictureService.deleteItemExtended });
		}
	]);

	wipModule.controller('salesWipOenServicePartController', ['$scope', 'boqMainOenServicePartControllerService','salesWipBoqStructureService',
		function ($scope, boqMainOenServicePartControllerService, salesWipBoqStructureService) {
			boqMainOenServicePartControllerService.getInstance($scope, salesWipBoqStructureService);
		}
	]);

})();

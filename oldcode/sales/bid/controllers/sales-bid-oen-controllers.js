(function () {
	'use strict';

	var bidModule = angular.module('sales.bid');

	bidModule.controller('salesBidOenBoqItemFormController', ['$scope', 'boqMainOenBoqItemFormControllerService', 'salesBidBoqStructureService',
		function($scope, boqMainOenBoqItemFormControllerService, salesBidBoqStructureService) {
			boqMainOenBoqItemFormControllerService.createDetailController($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidOenLbMetadataController', ['$scope', 'boqMainOenLbMetadataControllerService', 'salesBidBoqStructureService',
		function($scope, boqMainOenLbMetadataControllerService, salesBidBoqStructureService) {
			boqMainOenLbMetadataControllerService.getInstance($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidOenContactController', ['$scope', 'boqMainOenContactControllerService', 'salesBidBoqStructureService',
		function($scope, boqMainOenContactControllerService, salesBidBoqStructureService) {
			boqMainOenContactControllerService.getInstance($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidOenPictureController', ['$scope', 'boqMainOenPictureService', 'salesBidBoqStructureService', 'basicsCommonPhotoControllerBase',
		function($scope, boqMainOenPictureService, salesBidBoqStructureService, basicsCommonPhotoControllerBase) {
			var boqPictureService = boqMainOenPictureService.init($scope, salesBidBoqStructureService);
			basicsCommonPhotoControllerBase($scope, boqPictureService, { hideChangeItem:true, createItem:boqPictureService.createItemExtended, deleteItem : boqPictureService.deleteItemExtended });
		}
	]);

	bidModule.controller('salesBidOenLVHeaderController', ['$scope', 'boqMainOenLvHeaderControllerService','salesBidBoqStructureService',
		function($scope, boqMainOenLvHeaderControllerService,salesBidBoqStructureService) {
			boqMainOenLvHeaderControllerService.getInstance($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidOenZzController', ['$scope', 'boqMainOenZzControllerService','salesBidBoqStructureService',
		function ($scope, boqMainOenZzControllerService, salesBidBoqStructureService) {
			boqMainOenZzControllerService.getInstance($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidOenAkzController', ['$scope', 'boqMainOenAkzControllerService','salesBidBoqStructureService',
		function ($scope, boqMainOenAkzControllerService, salesBidBoqStructureService) {
			boqMainOenAkzControllerService.getInstance($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidOenZzVariantController', ['$scope', 'boqMainOenZzVariantControllerService','salesBidBoqStructureService',
		function ($scope, boqMainOenZzVariantControllerService, salesBidBoqStructureService) {
			boqMainOenZzVariantControllerService.getInstance($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidOenServicePartController', ['$scope', 'boqMainOenServicePartControllerService','salesBidBoqStructureService',
		function ($scope, boqMainOenServicePartControllerService, salesBidBoqStructureService) {
			boqMainOenServicePartControllerService.getInstance($scope, salesBidBoqStructureService);
		}
	]);


})();

(function() {
	'use strict';

	var procModule = angular.module('procurement.common');


	procModule.controller('prcCommonOenBoqItemFormController', ['$scope', 'boqMainOenBoqItemFormControllerService','procurementContextService' ,'prcBoqMainService',
		function($scope, boqMainOenBoqItemFormControllerService, moduleContext ,prcBoqMainService) {
			boqMainOenBoqItemFormControllerService.createDetailController($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);

	procModule.controller('prcCommonOenLbMetadataController', ['$scope', 'boqMainOenLbMetadataControllerService', 'procurementContextService' ,'prcBoqMainService',
		function($scope, boqMainOenLbMetadataControllerService, moduleContext ,prcBoqMainService) {
			boqMainOenLbMetadataControllerService.getInstance($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);

	procModule.controller('prcCommonOenContactController', ['$scope', 'boqMainOenContactControllerService', 'procurementContextService' ,'prcBoqMainService',
		function($scope, boqMainOenContactControllerService, moduleContext ,prcBoqMainService) {
			boqMainOenContactControllerService.getInstance($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);

	procModule.controller('prcCommonOenPictureController', ['$scope', 'boqMainOenPictureService','basicsCommonPhotoControllerBase','procurementContextService' ,'prcBoqMainService',
		function($scope, boqMainOenPictureService, basicsCommonPhotoControllerBase, moduleContext ,prcBoqMainService) {
			var boqPictureService = boqMainOenPictureService.init($scope, prcBoqMainService.getService(moduleContext.getMainService()));
			basicsCommonPhotoControllerBase($scope, boqPictureService, { hideChangeItem:true, createItem:boqPictureService.createItemExtended, deleteItem : boqPictureService.deleteItemExtended });
		}
	]);

	procModule.controller('prcCommonOenLVHeaderController', ['$scope', 'boqMainOenLvHeaderControllerService','procurementContextService' ,'prcBoqMainService',
		function($scope, boqMainOenLvHeaderControllerService,moduleContext ,prcBoqMainService) {
			boqMainOenLvHeaderControllerService.getInstance($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);

	procModule.controller('prcCommonOenAkzController', ['$scope', 'boqMainOenAkzControllerService','procurementContextService' ,'prcBoqMainService',
		function ($scope, boqMainOenAkzControllerService, moduleContext ,prcBoqMainService) {
			boqMainOenAkzControllerService.getInstance($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);
	procModule.controller('prcCommonOenZzController', ['$scope', 'boqMainOenZzControllerService','procurementContextService' ,'prcBoqMainService',
		function ($scope, boqMainOenZzControllerService, moduleContext ,prcBoqMainService) {
			boqMainOenZzControllerService.getInstance($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);
	procModule.controller('prcCommonOenZzVariantController', ['$scope', 'boqMainOenZzVariantControllerService','procurementContextService' ,'prcBoqMainService',
		function ($scope, boqMainOenZzVariantControllerService, moduleContext ,prcBoqMainService) {
			boqMainOenZzVariantControllerService.getInstance($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);

	procModule.controller('prcCommonOenServicePartController', ['$scope', 'boqMainOenServicePartControllerService','procurementContextService' ,'prcBoqMainService',
		function ($scope, boqMainOenServicePartControllerService, moduleContext ,prcBoqMainService) {
			boqMainOenServicePartControllerService.getInstance($scope, prcBoqMainService.getService(moduleContext.getMainService()));
		}
	]);



})();

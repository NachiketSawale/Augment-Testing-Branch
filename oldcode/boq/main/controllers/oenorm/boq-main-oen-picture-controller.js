(function() {
	/* global */
	'use strict';
	const angularModule = angular.module('boq.main');

	angularModule.controller('boqMainOenPictureController', ['$scope', 'boqMainService', 'boqMainOenPictureService', 'basicsCommonPhotoControllerBase',
		function($scope, boqMainService, boqMainOenPictureService, basicsCommonPhotoControllerBase) {
			var boqPictureService = boqMainOenPictureService.init($scope, boqMainService);
			basicsCommonPhotoControllerBase($scope, boqPictureService, { hideChangeItem:true, createItem:boqPictureService.createItemExtended, deleteItem : boqPictureService.deleteItemExtended });
		}
	]);
})();
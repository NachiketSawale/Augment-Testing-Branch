/**
 * Created by chi on 8/13/2015. Implemented by lvi.
 */
/**
 * @description: Business partner photo controller base.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').factory('singleImageControllerBase',
		['$translate', 'basicsCommonSingleImageService',
			function ($translate, basicsCommonSingleImageService) {
				return function ($scope, options) {
					const service = {};
					const isMap = !!options.isMap;
					const imageService = basicsCommonSingleImageService.CreateService(options);
					$scope.blob = null;

					const onBlobChange = function (action, item) {
						switch (action) {
							case 'delete':
								$scope.blob = null;
								$scope.modalOptions.bodyText = null;
								break;
							case 'loadImageAndText':
								$scope.blob = item.Blob;
								$scope.modalOptions.bodyText = item.PresentationFormula;
								break;
							default :
								$scope.blob = item;
						}
					};

					imageService.registerBlobChanged(onBlobChange);

					$scope.change = function () {
						imageService.changeImage();
					};

					$scope.delete = function () {
						imageService.deleteImage();
					};

					$scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 't1',
								caption: 'basics.common.toolbarChangePicture',
								type: 'item',
								iconClass: 'tlb-icons ico-new',
								fn: $scope.change,
								disabled: isMap
							},
							{
								id: 't2',
								caption: 'basics.common.toolbarDeletePicture',
								type: 'item',
								cssClass: 'tlb-icons ico-delete',
								fn: $scope.delete,
								disabled: isMap
							}
						]
					};

					$scope.imageOptions = {
						contentProperty: 'Content'
					};

					$scope.modalOptions = {
						bodyText: ''
					};

					const init = function () {
						imageService.loadImage();
						$scope.setTools($scope.tools);
					};

					init();

					$scope.$on('$destroy', function () {
						imageService.unRegisterBlobChanged(onBlobChange);
					});

					return service;
				};
			}]);

})(angular);
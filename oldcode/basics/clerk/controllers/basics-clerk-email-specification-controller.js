(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name cloudCommonSpecificationController
	 * @function
	 * @description
	 * Controller for the Specification view.
	 * Includes the wysiwyg html editor.
	 */

	angular.module('basics.clerk').controller('basicsClerkEmailSpecificationController',
		['$scope', 'basicsClerkEmailSpecificationService', 'basicsClerkMainService',
			function ($scope, basicsClerkEmailSpecificationService, basicsClerkMainService) {

				var transferSpecification = function transferSpecification() {
					basicsClerkEmailSpecificationService.setSpecificationAsModified($scope.specification);
				};

				// React on changes of the specification only in case of a change
				$scope.onChange = function () {
					transferSpecification();
				};

				//get Current Specification
				$scope.specification = basicsClerkEmailSpecificationService.getCurrentSpecification();

				//Current
				function updateSpecification(currentSpecification) {
					if (currentSpecification) {
						$scope.specification = currentSpecification;
					} else {
						$scope.specification = null;
					}
				}

				$scope.textareaEditable = () => Boolean(basicsClerkMainService.getSelected());

				// register clerkSpecification specification service messenger
				basicsClerkEmailSpecificationService.currentEmailChanged.register(updateSpecification);

				// register Clerk main service messenger
				basicsClerkMainService.registerSelectionChanged(basicsClerkEmailSpecificationService.loadSpecificationById);// load current ID
				basicsClerkEmailSpecificationService.registerGetModificationCallback(function () {
					return $scope.specification;
				});//need for create & save

				basicsClerkMainService.SetFooterSpecificationTransferCallback(transferSpecification);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					basicsClerkMainService.SetEMailSpecificationTransferCallback(null);
					basicsClerkEmailSpecificationService.currentEmailChanged.unregister(updateSpecification);
					basicsClerkEmailSpecificationService.unregisterGetModificationCallback();
				});

				// define the possible text functions
				$scope.richTextToolbar = [
					['imageFile', 'fontName', 'fontSize', 'quote', 'bold', 'italics', 'underline',
						'redo', 'undo', 'clear', 'justifyLeft',
						'justifyCenter', 'justifyRight',
						'insertImage', 'insertLink']
				];
			}
		]);
})(angular);

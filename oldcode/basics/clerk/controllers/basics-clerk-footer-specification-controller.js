/*global angular */
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

	angular.module('basics.clerk').controller('basicsClerkFooterSpecificationController',
		['$scope', 'basicsClerkFooterSpecificationService', 'basicsClerkMainService',
			function ($scope, basicsClerkFooterSpecificationService, basicsClerkMainService) {

				var transferSpecification = function transferSpecification() {
					basicsClerkFooterSpecificationService.setSpecificationAsModified($scope.specificationFooter);
				};

				// React on changes of the specification only in case of a change
				$scope.onChange = function () {
					transferSpecification();
				};

				//get Current specificationFooter
				$scope.specificationFooter = basicsClerkFooterSpecificationService.getCurrentSpecification();

				//Current
				function updateSpecification(currentSpecification) {
					if (currentSpecification) {
						$scope.specificationFooter = currentSpecification;
					} else {
						$scope.specificationFooter = null;
					}
				}

				$scope.textareaEditable = () => Boolean(basicsClerkMainService.getSelected());

				// register clerkSpecification specification service messenger
				basicsClerkFooterSpecificationService.currentFooterChanged.register(updateSpecification);

				// register Clerk main service messenger
				basicsClerkMainService.registerSelectionChanged(basicsClerkFooterSpecificationService.loadSpecificationById);// load current ID
				basicsClerkFooterSpecificationService.registerGetModificationCallback(function () {
					return $scope.specificationFooter;
				});//need for create & save
				basicsClerkMainService.SetFooterSpecificationTransferCallback(transferSpecification);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					basicsClerkMainService.SetFooterSpecificationTransferCallback(null);
					basicsClerkFooterSpecificationService.currentFooterChanged.unregister(updateSpecification);
					basicsClerkFooterSpecificationService.unregisterGetModificationCallback();
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
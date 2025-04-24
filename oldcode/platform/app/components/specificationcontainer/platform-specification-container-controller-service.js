/**
 * Created by nitsche on 2025-02-20.
 */
(function (angular) {
	'use strict';
	var moduleName = 'platform';

	angular.module(moduleName).service('platformSpecificationContainerControllerService', PlatformSpecificationContainerControllerService);

	PlatformSpecificationContainerControllerService.$inject = ['_'];

	function PlatformSpecificationContainerControllerService(_) {
		var self = this;

		this.initSpecificationController = function initSpecificationController($scope, dataService) {
			let parentDataService = dataService.getParentDataService();
			let transferSpecification = function transferSpecification() {
				dataService.setSpecificationAsModified($scope.specification);
			};

			// React on changes of the specification only in case of a change
			$scope.onChange = function () {
				transferSpecification();
			};

			//get Current specification
			$scope.specification = dataService.getCurrentSpecification().Content;

			//Current
			function updateSpecification(currentSpecification) {
				if (currentSpecification && !_.isNil(currentSpecification.Content)) {
					$scope.specification = currentSpecification.Content;
				} else {
					$scope.specification = null;
				}
			}

			$scope.textareaEditable = () => Boolean(parentDataService.getSelected());

			// register clerkSpecification specification service messenger
			dataService.currentSpecificationChanged.register(updateSpecification);

			// register Clerk main service messenger
			//parentDataService.registerSelectionChanged(dataService.loadSpecificationById);// load current ID
			dataService.registerGetModificationCallback(function () {
				return $scope.specification;
			});

			// unregister Clerk service messenger
			$scope.$on('$destroy', function () {
				dataService.currentSpecificationChanged.unregister(updateSpecification);
				dataService.unregisterGetModificationCallback();
			});

			// define the possible text functions
			$scope.richTextToolbar = [
				['imageFile', 'fontName', 'fontSize', 'quote', 'bold', 'italics', 'underline',
					'redo', 'undo', 'clear', 'justifyLeft',
					'justifyCenter', 'justifyRight',
					'insertImage', 'insertLink']
			];
		};
	}
})(angular);
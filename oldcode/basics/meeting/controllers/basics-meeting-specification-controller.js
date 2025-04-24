/**
 * Created by chd on 12/23/2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name basicsMeetingSpecificationController
	 * @require $scope
	 * @description controller for basics meeting minutes
	 */
	angular.module('basics.meeting').controller('basicsMeetingSpecificationController',
		['_', '$scope', 'basicsMeetingSpecificationService', 'basicsMeetingMainService',
			function (_, $scope, meetingSpecificationService, basicsMeetingMainService) {

				let transferSpecification = function transferSpecification() {
					meetingSpecificationService.setSpecificationAsModified($scope.specification);
				};

				// React on changes of the specification only in case of a change
				$scope.onChange = function () {
					transferSpecification();
				};

				// Get current specification
				$scope.specification = meetingSpecificationService.getCurrentSpecification();

				// Current
				function updateSpecification(currentSpecification) {
					if (currentSpecification) {
						$scope.specification = currentSpecification;
					} else {
						$scope.specification = {Content: null};
					}
				}

				// Register meeting specification service messenger
				meetingSpecificationService.currentMinutesChanged.register(updateSpecification);

				// register meeting main service messenger
				basicsMeetingMainService.registerSelectionChanged(meetingSpecificationService.loadSpecificationById); // load current ID

				basicsMeetingMainService.registerItemModified(function (args, data) {
					if (data && data.Id && basicsMeetingMainService.getIfSelectedIdElse(-1) === data.Id){
						$scope.textareaEditable = isItemEditAble();  // If the 'IsReadonlyStatus' attribute of selected item is changed, update '$scope.textareaEditable'.
					}
				});

				meetingSpecificationService.registerSelectionChanged(function () {
					$scope.textareaEditable = isItemEditAble();
				});

				meetingSpecificationService.registerGetModificationCallback(function () {
					return $scope.specification;
				});// need for create & save

				let isItemEditAble = function() {
					return basicsMeetingMainService.getHeaderEditAble();
				};

				$scope.textareaEditable = isItemEditAble();

				// unregister meeting service messenger
				$scope.$on('$destroy', function () {
					meetingSpecificationService.currentMinutesChanged.unregister(updateSpecification);
					meetingSpecificationService.unregisterGetModificationCallback();
				});

				// define the possible text functions
				$scope.richTextToolbar= [
					['imageFile','fontName','fontSize','quote','bold', 'italics', 'underline',
						'redo', 'undo', 'clear','justifyLeft',
						'justifyCenter','justifyRight',
						'insertImage', 'insertLink']
				];
			}
		]);
})(angular);
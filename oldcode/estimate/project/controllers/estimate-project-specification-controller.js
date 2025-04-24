/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function (angular) {
	'use strict';

	/**
    @ngdoc controller
    * @name estimateProjectSpecificationController
    * @function
    * @description
    * Controller for the Specification view.
    * Includes the wysiwyg html editor.
     */

	angular.module('estimate.project').controller('estimateProjectSpecificationController',
		['$scope', 'estimateProjectSpecificationService', 'estimateProjectService', 'projectMainService',
			function  ($scope, estPrjSpecService, estimateProjectService, projectMainService) {

				$scope.imageDataUrl ='from control';
				$scope.specification = estPrjSpecService.getCurrentSpecification();
				$scope.disabled = false;
				$scope.textareaEditable = false;

				// define the possible text functions
				$scope.richTextToolbar= [
					['imageFile','fontName','fontSize','quote','bold', 'italics', 'underline',
						'redo', 'undo', 'clear','justifyLeft',
						'justifyCenter','justifyRight',
						'insertImage', 'insertLink']
				];

				let oldSpecText = {
					Content: null,
					Id : 0,
					Version : 0
				};

				// Save the old values in order to be able to check if there's a real change of the specification and not just a change of the selected parent item
				let setOldSpecification = function setOldSpecification (oldSpec){
					if(oldSpec){
						oldSpecText = angular.copy(oldSpec);
					}
				};

				// React on changes of the specification only in case of a change
				$scope.onChange = function() {
					let compositeItem = estimateProjectService.getSelected();
					let selectedHeaderId = compositeItem && compositeItem.Id ? compositeItem.EstHeader ? compositeItem.EstHeader.Id : null : null;
					if(selectedHeaderId){
						estPrjSpecService.setSpecificationAsModified($scope.specification);
					}
				};

				/**
				 * @ngdoc function
				 * @name updateSpecification
				 * @function
				 * @description This handler updates the saved old values of the specification object that serve as means to detect a change of the specification.
				 * This is especially important to react on changes of the current specification.
				 * @param {Object} currentSpecification whose contents are to be saved for comparison
				 */
				function updateSpecification (currentSpecification) {
					if(currentSpecification) {
						setOldSpecification(currentSpecification);
						$scope.specification = currentSpecification;
					}
				}



				// check the real midification of text and set text as modified
				function provideSpecUpdate () {
					if($scope.specification && oldSpecText.Id === $scope.specification.Id && oldSpecText.Content !== $scope.specification.Content && oldSpecText.Version === $scope.specification.Version){
						estPrjSpecService.setSpecificationAsModified($scope.specification);
					}
				}

				// handle after update done
				function handleUpdateDone (updateData, response) {
					estPrjSpecService.resetModifiedSpecification();

					if(response.EstimateCompleteTosave && response.EstimateCompleteTosave.length){

						let item = _.find(response.EstimateCompleteTosave, {Id : $scope.specification.CompositeItemId});
						if(item){
							estPrjSpecService.setCurrentSpecification(item.EstHeaderTextToSave);
						}
					}
				}
				let compositeItem = estimateProjectService.getSelctionItem();
				if(compositeItem){
					estPrjSpecService.loadSpecification(compositeItem,compositeItem.Id);
				}

				function clearSpecification () {
					estPrjSpecService.resetModifiedSpecification();
					estPrjSpecService.clearSpecification();
					$scope.specification = estPrjSpecService.getCurrentSpecification();
				}

				function setTextEditor(value){
					$scope.textareaEditable = value;
				}

				// register header text specification service messenger
				estPrjSpecService.currentSpecificationChanged.register(updateSpecification);

				// register header text main service messenger
				estimateProjectService.provideSpecUpdate.register(provideSpecUpdate);

				estimateProjectService.updateTextEditor.register(setTextEditor);

				projectMainService.registerUpdateDone(handleUpdateDone);

				projectMainService.registerRefreshRequested(clearSpecification);

				// unregister header text service messenger
				$scope.$on('$destroy', function () {
					clearSpecification();
					estPrjSpecService.currentSpecificationChanged.unregister(updateSpecification);
					estimateProjectService.provideSpecUpdate.unregister(provideSpecUpdate);
					estimateProjectService.updateTextEditor.unregister(setTextEditor);
					projectMainService.unregisterUpdateDone(handleUpdateDone);
					projectMainService.unregisterRefreshRequested(clearSpecification);
				});
			}
		]);
})(angular);

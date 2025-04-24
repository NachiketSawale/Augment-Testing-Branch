/**
 * Created by ltn on 5/3/2017.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc controller
     * @name basicsMaterialCatalogTermsConditionsController
     * @require $scope
     * @description controller for basics material catalog
     */
	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogTermsConditionsController',
		['_', '$scope', '$modal', 'basicsMaterialCatalogService',
			function (_, $scope, $modal, parentService) {
				$scope.onPropertyChanged = function () {
					parentService.markCurrentItemAsModified();
				};


				$scope.termsAndConditions = parentService.getCurrentTermsAndConditions();

				var isItemSelected = function() {
					var entity = parentService.getSelected();
					return !_.isEmpty(entity);
				};

				// React on changes of the specification
				$scope.onTextChanged = function () {
					if(isItemSelected()){
						parentService.setTermsAndConditionsAsModified($scope.termsAndConditions);
					}
				};
				$scope.textareaEditable = !isItemSelected();

				parentService.registerSelectionChanged(onSelectionChange);

				function onSelectionChange(){
					var entity = parentService.getSelected();
					$scope.textareaEditable = _.isEmpty(entity);

					if(entity){
						if(entity.TermsConditions){
							$scope.termsAndConditions = entity.TermsConditions;
						}else{
							$scope.termsAndConditions = '';
						}
					}
				}
			}]);
})(angular);
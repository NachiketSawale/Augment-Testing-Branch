
(function (angular) {
	'use strict';

	const moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businesspartnerMainActivitySpecificationController',['$scope','businesspartnerMainActivityDataService','platformRuntimeDataService',

		function ($scope, businesspartnerMainActivityDataService,platformRuntimeDataService) {

			let hasSelectionChanged = false;
			$scope.onChange = function () {
				if (hasSelectionChanged) {
					hasSelectionChanged = false;
				} else {
					businesspartnerMainActivityDataService.markItemAsModified($scope.selectedActivity);
				}
			};
			$scope.textareaEditable =function ()
			{
				let item = businesspartnerMainActivityDataService.getSelected();
				return item && !platformRuntimeDataService.isReadonly(item);
			};


			businesspartnerMainActivityDataService.blobLoaded.register(selectionChanged);

			selectionChanged();

			$scope.$on('$destroy', function () {
				businesspartnerMainActivityDataService.blobLoaded.unregister(selectionChanged);
			});



			function selectionChanged() {
				hasSelectionChanged = true;

				$scope.selectedActivity = businesspartnerMainActivityDataService.getSelected();

			}
		}]);
})(angular);

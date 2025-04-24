(function (angular) {
	'use strict';

	// used for popup-template in sidebar searchform
	angular.module('cloud.desktop').controller('searchFormSelectContainer', searchFormSelectContainer);

	searchFormSelectContainer.$inject = ['$scope', 'cloudDesktopSidebarSearchFormService', '_'];

	function searchFormSelectContainer($scope, cloudDesktopSidebarSearchFormService, _) {

		$scope.handleFilter = function (event) {
			// get value from input-field
			var filterValue = $scope.searchFormOptions.listDeclaration.searchField.toLowerCase();

			// get all the items for searchform items
			var list = angular.copy($scope.searchFormOptions.selectboxItems);

			// filter items by searched value from input fieled
			_.remove(list, function (item) {
				return !_.includes(item.caption.toLowerCase(), filterValue);
			});

			// update content from selectbox
			$scope.searchFormOptions.listDeclaration.items = cloudDesktopSidebarSearchFormService.createItemsForSelectBox(list);
		};

		$scope.handleClick = function (event) {
			// so that popup window dont close
			event.preventDefault();
			event.stopPropagation();
		};
	}
})(angular);
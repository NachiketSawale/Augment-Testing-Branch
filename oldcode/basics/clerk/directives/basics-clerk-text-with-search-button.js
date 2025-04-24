(function (angular) {
	'use strict';

	angular.module('basics.clerk')
		.directive('basicsClerkTextWithSearchButton', ['$http',
			function ($http) {
				return {
					restrict: 'EA',

					templateUrl: globals.appBaseUrl + 'basics.clerk/templates/basics-clerk-text-with-search-button.html',
					link: function (scope, element, attrs) {
						scope.searchQuery = '';

						scope.triggerSearch = function (item) {
							let searchText = scope.entity.wizardData.listModel.__filterText;
							if (searchText !== null) {
								let listfiltered = {
									ExecutionHints: false,
									IncludeNonActiveItems: false,
									Pattern: searchText,
									PinningContext: [],
									UseCurrentClient: false,
									UseCurrentProfitCenter: null,
									filter: ''
								};
								$http.post(globals.webApiBaseUrl + 'basics/clerk/listusersfiltered', listfiltered)
									.then(function (response) {
										if (response?.data?.dtos) {
											let findBySearch = response.data.dtos;
											scope.entity.wizardData.listModel.items = findBySearch;
											scope.entity.wizardData.listModel.__unfilteredItems = findBySearch;
											scope.entity.wizardData.__unfilteredItems = findBySearch;
										} else {
											scope.entity.wizardData.listModel.items = [];
											scope.entity.wizardData.listModel.__unfilteredItems = [];
											scope.entity.wizardData.__unfilteredItems = [];
										}
									});
							}
						};
					}
				};
			}
		]);
})(angular);
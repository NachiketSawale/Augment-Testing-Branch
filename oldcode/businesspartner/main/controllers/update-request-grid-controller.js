(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name businesspartner.main.controller: businesspartnerMainUpdateRequestListController
	 * @requires $scope, platformGridControllerService
	 * @description
	 * #
	 * Controller for bank list container.
	 */
	angular.module('businesspartner.main').controller('businesspartnerMainUpdateRequestListController',
		['$scope', 'platformGridControllerService', 'businesspartnerMainUpdateRequestDataService', 'businessPartnerMainUpdateRequestUIStandardService','_',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformGridControllerService, businesspartnerMainUpdateRequestDataService, businessPartnerMainUpdateRequestUIStandardService,_) {

				let myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, businessPartnerMainUpdateRequestUIStandardService, businesspartnerMainUpdateRequestDataService, null, myGridConfig);

				let tools = [
					{
						id: 't5',
						sort: 5,
						caption: 'businesspartner.main.updateRequestTitle',
						type: 'item',
						disabled: function () {
							return !businesspartnerMainUpdateRequestDataService.canUpdateRequest();
						},
						iconClass: 'tlb-icons ico-copy-paste-deep',
						fn: function updateRequest() {
							businesspartnerMainUpdateRequestDataService.UpdateRequests();
						}
					}
				];
				platformGridControllerService.addTools(tools);

				let removeItemsIds = ['create', 'delete', 't14'];
				removeTool(removeItemsIds);

				function removeTool(Ids) {
					angular.forEach(Ids, function (id) {
						$scope.tools.items = _.without($scope.tools.items, _.find($scope.tools.items, {'id': id}));
					});
					$scope.tools.update();
				}
			}
		]);
})(angular);
(function () {

	/* global globals, angular */
	'use strict';
	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 * Controller to administrate the columns grid
	 **/
	angular.module(moduleName).controller('basicsDependentDataColumnListController',
		['$scope', '$translate','basicsDependentDataColumnService', 'basicsDependentDataColumnUIService', 'platformGridControllerService',
			function ($scope,$translate, basicsDependentDataColumnService, basicsDependentDataColumnUIService, platformGridControllerService) {

				var myGridConfig = { initCalled: false, columns: [] };

				platformGridControllerService.initListController($scope, basicsDependentDataColumnUIService, basicsDependentDataColumnService, null, myGridConfig);

				var toolbarItems = [
					{
						id: 't6',
						caption: $translate.instant('basics.dependentdata.generate'),
						type: 'item',
						iconClass: 'tlb-icons ico-generate-fields',
						fn: function() {

							generateColumns();

						}
					}
				];

				platformGridControllerService.addTools(toolbarItems);

				function generateColumns() {

					basicsDependentDataColumnService.parseView().then(
						function (data) {
							basicsDependentDataColumnService.setList(data);
						}
					);
				}

			}
		]);
})();

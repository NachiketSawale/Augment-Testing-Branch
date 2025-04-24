/**
 * Created by chin-han.lai on 18/08/2023
 */

(function (angular) {

	'use strict';

	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCompanyController
	 * @function
	 *
	 * @description
	 * Controller for the view of published Company.
	 **/

	angular.module(moduleName).controller('projectMainCompanyController',
		['_','$scope', 'platformGridAPI', 'projectMainCompanyService', 'platformGridControllerService', 'projectMainCompanyUIConfigurationService',
			function (_,$scope, platformGridAPI, dataService, platformGridControllerService, projectMainCompanyUIConfigurationService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'CompanyFk',
					childProp: 'Companies',
					addValidationAutomatically: false,
					cellChangeCallBack: function cellChangeCallBack(arg) {
						dataService.fieldChangeCallBack(arg);
					}
				};

				platformGridControllerService.initListController($scope, projectMainCompanyUIConfigurationService, dataService, null, myGridConfig);

				let removeItems = ['create', 'delete', 'createChild'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});
			}
		]);
})(angular);
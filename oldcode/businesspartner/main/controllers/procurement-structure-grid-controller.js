/**
 * Created by wui on 12/22/2014.
 */

(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainProcurementStructureGridController',
		['$scope', 'platformGridControllerService', 'businesspartnerMainProcurementStructureDataService',
			'businesspartnerMainPrcStructureUIStandardService', 'platformModalService', 'businesspartnerMainPrcStructureValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformGridControllerService, dataService, uiStandardService, platformModalService, validator) {

				var gridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'ParentPrcStructureFk',
					childProp: 'ChildItems'
				};

				platformGridControllerService.initListController($scope, uiStandardService, dataService, validator, gridConfig);

			}
		]);

})(angular);
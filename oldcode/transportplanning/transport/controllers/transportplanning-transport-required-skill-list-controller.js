/**
 * Created by baf on 30.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';

	/**
	 * @ngdoc controller
	 * @name resourceRequisitionRequiredSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource requisition required skill entities.
	 **/

	angular.module(moduleName).controller('transportplanningTransportRequiredSkillListController', TransportplanningTransportRequiredSkillListController);

	TransportplanningTransportRequiredSkillListController.$inject = ['$scope', '$injector', 'resourceRequisitionConstantValues', 'platformContainerControllerService',
	'platformGridControllerService', 'resourceRequisitionRequiredSkillLayoutService', 'resourceRequisitionRequiredSkillValidationService', 'transportplanningTransportRequiredSkillDataService'];

	function TransportplanningTransportRequiredSkillListController($scope, $injector, resourceRequisitionConstantValues, platformContainerControllerService,
	platformGridControllerService, uiStandardService, validationService, dataServiceFactory) {

		var parentService = {};

		if($scope.getContentValue('parentUuid')) {
			var parentGuid = $scope.getContentValue('parentUuid');
			parentService = $injector.get('transportplanningTransportContainerInformationService').getContainerInfoByGuid(parentGuid).dataServiceName;
		}
		else if ($scope.getContentValue('parentServiceOptions')) {
			var parentOptions = $scope.getContentValue('parentServiceOptions');
			parentService = $injector.get('productionplanningCommonResRequisitionDataServiceFactory').getOrCreateService(parentOptions);
		}
		var uuid = $scope.getContentValue('uuid');
		var gridConfig = {initCalled: false, columns: []};
		var dataService = dataServiceFactory.getService(uuid, parentService);

		var modifiedUiStandardService = replaceFilterFnOfSkillFkColumn(uiStandardService);

		platformGridControllerService.initListController($scope, modifiedUiStandardService, dataService, validationService, gridConfig);

		function replaceFilterFnOfSkillFkColumn(uiStandardService) {
			var columns = angular.copy(uiStandardService.getStandardConfigForListView().columns);
			var skillFkCol = _.find(columns, {'id': 'skillfk'});

			function filter(item) {
				let selectedReq = parentService.getItemById(item.RequisitionFk); // use parentService to get item
				return selectedReq.TypeFk;
			}

			if (skillFkCol) {
				skillFkCol.editorOptions.lookupOptions.filter = filter;
				skillFkCol.formatterOptions.filter = filter;
			}

			return {
				addValidationAutomatically: true,
				getStandardConfigForListView: function () {
					return { columns: columns };
				}
			};
		}
	}
})(angular);
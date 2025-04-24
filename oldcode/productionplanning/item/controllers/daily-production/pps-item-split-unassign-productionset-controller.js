/**
 * Created by anl on 25/02/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemSplitUnassignProductionsetController', splitUnassignProductionsetController);
	splitUnassignProductionsetController.$inject = [
		'$scope',
		'$http',
		'platformModalService',
		'$translate',
		'platformTranslateService',
		'productionplanningItemDailyProductionDataService',
		'params'];

	function splitUnassignProductionsetController($scope,
		$http,
		platformModalService,
		$translate,
		platformTranslateService,
		dailyProductionDataService,
		params) {

		const close = () => {
			return $scope.$close(false);
		};

		const createInputRows = () => {
			return {
				fid: 'productionplanning.item.split.request',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'request',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}],
				rows: [
					{
						gid: 'request',
						rid: 'splitnumber',
						type: 'integer',
						label: '*Split Number',
						label$tr$: 'productionplanning.item.dailyProduction.splitNumber',
						model: 'SplitNumber',
						sortOrder: 1
					}]
			};
		};

		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(createInputRows())
		};
		$scope.formOptions.entity = {SplitNumber: 1};

		$scope.handleOK = () => {
			dailyProductionDataService.splitUnassign($scope.formOptions.entity, params.planningBoardService);
			$scope.$close(false);
		};

		$scope.modalOptions = {
			headerText: $translate.instant('productionplanning.item.dailyProduction.splitUnassign'),
			cancel: close
		};

		$scope.isOKDisabled = () => {
			return $scope.formOptions.entity.SplitNumber <= 0 || $scope.formOptions.entity.SplitNumber === null;
		};
	}
})(angular);
/**
 * Created by anl on 7/23/2020.
 */

(function (angular) {
	'use strict';
	/*global angular, globals*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemMergeWizardController', MergeWizardController);

	MergeWizardController.$inject = [
		'_', '$scope', '$options', '$http', '$injector',
		'$translate',
		'platformGridAPI',
		'productionplanningItemMergeWizardService',
		'productionplanningItemDataService'];

	function MergeWizardController(
		_, $scope, $options, $http, $injector,
		$translate,
		platformGridAPI,
		mergeWizardService,
		itemDataService) {

		mergeWizardService.initial($scope, $options.ppsItems);

		function onCellChange(e, args) {
			mergeWizardService.updateCheck(args.item);
		}

		function onInitialized(){
			mergeWizardService.setDefaultSelected();
		}

		$scope.handleOK = function handleOK() {
			var items = platformGridAPI.rows.getRows($scope.itemGrid.state);
			var postData = {
				ppsItems: items
			};
			$http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/mergeItems', postData).then(function (response) {
				if (response.data) {
					var selected = _.find(response.data, {IsLive: true});

					$injector.get('platformDataServiceDataProcessorExtension').doProcessItem(selected, itemDataService.getContainerData());
					itemDataService.syncDynamicColumns(selected.Id);
					itemDataService.refresh().then(function(){
						itemDataService.setSelected(selected);
					});
				}
			});
			$scope.$close(true);
		};

		$scope.modalOptions = {
			headerText: $translate.instant('productionplanning.item.wizard.itemMerge.mergeDialogTitle'),
			cancel: close
		};

		function close() {
			return $scope.$close(false);
		}

		platformGridAPI.events.register($scope.itemGrid.state, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.itemGrid.state, 'onInitialized', onInitialized);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.itemGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.itemGrid.state, 'onInitialized', onInitialized);
			platformGridAPI.grids.unregister($scope.itemGrid.state);
		});
	}

})(angular);
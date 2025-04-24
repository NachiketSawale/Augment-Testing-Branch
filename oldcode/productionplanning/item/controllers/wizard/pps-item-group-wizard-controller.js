/**
 * Created by anl on 8/10/2020.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemGroupWizardDialogController', Controller);
	Controller.$inject = [
		'$http', '$scope', '_',
		'$options',
		'$translate',
		'productionplanningItemSplitWizardStepsService',
		'productionplanningItemGroupSelectionService',
		'platformGridAPI',
		'$injector',
		'productionplanningItemDataService'];

	function Controller(
		$http, $scope, _,
		$options,
		$translate,
		ppsItemSplitWizardStepsService,
		groupSelectionService,
		platformGridAPI,
		$injector,
		itemDataService) {


		$scope.isBusy = false;
		$scope.context = {
			selectedItems: $options.selectedItems,
			ppsEventInfo: $options.ppsEventInfo,
			ppsEventTypes: $options.ppsEventTypes
		};
		$scope.steps = [
			{
				url: 'productionplanning.item/partials/pps-item-group-selection.html',
				service: 'productionplanningItemGroupSelectionService',
				title: $translate.instant('productionplanning.item.wizard.itemGroup.groupSelection'),
				isInitialized: true
			},
			{
				url: 'productionplanning.item/partials/pps-item-group-creation.html',
				service: 'productionplanningItemGroupCreationService',
				title: $translate.instant('productionplanning.item.wizard.itemGroup.groupCreation')
			}
		];

		ppsItemSplitWizardStepsService.initialize($scope, finish);

		$scope.$on('$destroy', function () {
		});

		_.extend($scope.modalOptions, {
			headerText: $translate.instant('productionplanning.item.wizard.itemGroup.groupDialogTitle'),
			cancel: close
		});

		function close() {
			return $scope.$close(false);
		}


		function finish(service) {
			var selectResult = groupSelectionService.getResult();
			var createResult = service.getResult();

			var postData = {
				selectedItems: selectResult.selectedItems,
				config: _.extend(selectResult.selectionEntity, createResult.creationEntity),
				eventTypeSeqs: selectResult.eventTypeSeqs
			};

			$http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/groupItems', postData).then(function (response) {
				if (response.data) {
					var selected = response.data;

					$injector.get('platformDataServiceDataProcessorExtension').doProcessItem(selected, itemDataService.getContainerData());
					itemDataService.syncDynamicColumns(selected.Id);
					itemDataService.refresh().then(function(){
						itemDataService.setSelected(selected);
					});
				}
			});

			$scope.$close(false);
		}
	}
})(angular);
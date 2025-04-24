/**
 * Created by anl on 6/21/2019.
 */

(function (angular) {
	'use strict';
	/*global angular, globals*/
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemSplitWizardDialogController', Controller);
	Controller.$inject = ['$http', '$scope', '_',
		'$options',
		'$translate',
		'productionplanningItemSplitWizardStepsService',
		'productionplanningItemDataService',
		'platformGridAPI',
		'$injector',
		'ppsCommonProjectLocationSideloadFilterDataServiceFactory'];

	function Controller(
		$http, $scope, _,
		$options,
		$translate,
		ppsItemSplitWizardStepsService,
		itemDataService,
		platformGridAPI,
		$injector,
		locationSideloadFilterDataServiceFactory) {

		initializeScope();

		function initializeScope() {
			$scope.parentItem = $options.parentItem;
			$scope.isBusy = false;
			$scope.isNew = true;
			$scope.context = {
				parentItem: $options.entity, eventTypes: $options.eventTypes, fromTo: $options.fromTo,
				splitMode: $options.splitMode
			};
			$scope.steps = [
				{
					url: 'productionplanning.item/partials/pps-item-split-configuration.html',
					service: 'productionplanningItemSplitConfigurationService',
					title: $translate.instant('productionplanning.item.wizard.itemSplit.config'),
					isInitialized: true
				},
				{
					url: 'productionplanning.item/partials/pps-item-split-location-assign.html',
					service: 'productionplanningItemSplitLocationAssignService',
					title: $translate.instant('productionplanning.item.wizard.itemSplit.locationAssign')
				}
			];

			$scope.headerText = $options.splitMode ? $translate.instant('productionplanning.item.wizard.itemSplit.splitDialogTitle') :
				$translate.instant('productionplanning.item.wizard.itemSplit.copyDialogTitle');

			ppsItemSplitWizardStepsService.initialize($scope, finish);

			$scope.$on('$destroy', function () {
			});
		}

		function finish(service) {
			const busyFn = function (flag) {
				$scope.isBusy = flag;
				if (service && service.busy) {
					service.busy(flag);
				}
			};
			busyFn(true);
			if (service && service.busy) {
				service.busy(true);
			}
			//save splitedItems with location

			_.forEach($scope.context.splitedItems, function (splitedItem) {
				if (splitedItem.PrjLocationFk === -1) {
					splitedItem.PrjLocationFk = null;
				}
			});
			_.forEach($scope.context.events, function (itemEvent) {
				itemEvent.PrjLocationFk = null;
			});

			const postData = {
				AsChild: $scope.context.config.ChildItem,
				SelectedItem: $scope.context.parentItem,
				Info: {
					SplitedItems: $scope.context.splitedItems,
					Events: $scope.context.events,
					Item2Events: $scope.context.item2events
				},
				Locations: $scope.context.locations
			};

			$http.post(globals.webApiBaseUrl + 'productionplanning/item/savespliteditem', postData).then(function (response) {
				$injector.get('projectLocationLookupDataService').setCache({}, null);//clear project location data cache
				if (response && response.data && response.data.items.length > 0) {
					//Update BranchLocation
					if(response.data.locationInfos !== null) {
						const locationCodeService = $injector.get('productionplanningCommonLocationInfoService');
						_.forEach(response.data.locationInfos, function (location) {
							locationCodeService.updateList(location);
						});
					}

					const returnItems = response.data.items;
					// const childProp = 'ChildItems';
					// const parentItem = $options.entity;
					// // from the beginning of split-item wizard service, parentItem is a copy of selected item(don't know the reason exactly)
					// // but we need to add children of selected item, so the copy does not work,
					// // parentItem should be the real item showing in container
					const selectedPpsItem = itemDataService.getSelected();
					// if (selectedPpsItem && selectedPpsItem.Id === parentItem.Id) {
					// parentItem = selectedPpsItem;
					// }

					itemDataService.mergeWithCopySplitItems(returnItems, selectedPpsItem, $scope.context.config.ChildItem);

					//Update PrjLocation filter
					const locationFilterService = locationSideloadFilterDataServiceFactory.getPrjLocationFilterService(
						itemDataService, true, 'byJob');
					locationFilterService.load();

					$scope.$close(false);
				}
			}, function () {
				busyFn(false);
			});
		}
	}
})(angular);
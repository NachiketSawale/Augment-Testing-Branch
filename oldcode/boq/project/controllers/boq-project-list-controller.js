(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.project';

	/**
	 * @ngdoc controller
	 * @name boqProjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the project boqs
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqProjectListController',
		['$scope', '$state', '$translate', 'platformGridControllerService', 'boqProjectService', 'boqProjectStandardConfigurationService', 'boqProjectValidationService', '$injector',
			function ($scope, $state, $translate, platformGridControllerService, boqProjectService, bqoProjectStandardConfigurationService, boqProjectValidationService, $injector) {

				var myGridConfig = {initCalled: false, columns: []};
				platformGridControllerService.initListController($scope, bqoProjectStandardConfigurationService, boqProjectService, boqProjectValidationService, myGridConfig);
				var boqMainService = $injector.get('boqMainService');
				var platformGridAPI = $injector.get('platformGridAPI');

				function syncWithCurrentBoqMainItem() {
					// Look if one of the loaded boq items corresponds to the currently loaded item in the boqMainService
					// and sync it if it's necessary. Currently we only sync if reference number or outline spec differ.

					// First look for a corresponding entry in the project boq list
					var projectBoqList = boqProjectService.getList();
					var boqMainRootItem = boqMainService.getRootBoqItem();

					var correspondingProjectBoQ = _.find(projectBoqList, function (item) {
						if (angular.isDefined(item) && (item !== null) && angular.isDefined(item.BoqRootItem) && (item.BoqRootItem !== null)) {
							if (angular.isDefined(boqMainRootItem) && (boqMainRootItem !== null)) {
								return ((item.BoqRootItem.BoqHeaderFk === boqMainRootItem.BoqHeaderFk) && (item.BoqRootItem.Id === boqMainRootItem.Id));
							}
						}
						return false;
					});

					if (angular.isDefined(correspondingProjectBoQ) && (correspondingProjectBoQ !== null)) {
						var projectBoqRootItem = correspondingProjectBoQ.BoqRootItem;
						if (angular.isDefined(projectBoqRootItem) && (projectBoqRootItem !== null) && (projectBoqRootItem.Version < boqMainRootItem.Version) && ((projectBoqRootItem.Reference !== boqMainRootItem.Reference) || !angular.equals(projectBoqRootItem.BriefInfo, boqMainRootItem.BriefInfo))) {
							// We've detected a mismatch of property values between the corresponding project boq and the
							// currently selected boq root item in the boq main service. Furthermore the versions of the
							// two entities differ in a way that we can suppose the entity of the boqMainService is more
							// up-to-date then the one from the project boq list. -> do a reload to sync the items.
							boqProjectService.load();
						}
					}
				}

				var navigationItem = [
					{
						id: 'prjGoToBoq',
						caption: $translate.instant('boq.main.openBoq'),
						type: 'item',
						iconClass: 'tlb-icons ico-goto',
						fn: function openBoQ() {
							boqProjectService.prepareGoTo().then(function() {
								$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, boqProjectService.getSelected(), 'BoqItemNavigator');
							});
						},
						disabled: function () {
							return _.isEmpty(boqProjectService.getSelected());
						}
					}
				];
				platformGridControllerService.addTools(navigationItem);

				var setBoqMainReadOnlyState = function setBoqMainReadOnlyState(callingContext) {
					// If the given callingContext is a boq composite object we can easily derive the readonly state.
					boqMainService.setReadOnly(callingContext && callingContext.BoqHeader && callingContext.BoqHeader.IsReadOnly);
				};

				boqMainService.requestReadOnlyState.register(setBoqMainReadOnlyState);

				var setCellEditable = function (e, args) {
					var field = args.column.field;
					var item = args.item;

					return boqProjectService.getCellEditable(item, field);
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
				boqMainService.addBoqHeaderDeepCopyTool($scope, boqProjectService);
				boqMainService.addBoqBackupTools(       $scope, boqProjectService, 'Boq', 'boq/project');

				$scope.$on('$destroy', function () {
					boqMainService.requestReadOnlyState.unregister(setBoqMainReadOnlyState);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});

				syncWithCurrentBoqMainItem();
			}
		]);
})();
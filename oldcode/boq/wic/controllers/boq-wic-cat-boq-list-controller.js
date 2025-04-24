(function () {

	/* global _, globals */
	'use strict';
	var moduleName = 'boq.wic';

	/**
	 * @ngdoc controller
	 * @name boqWicCatBoqListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the wic cat composite boqs
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqWicCatBoqListController',
		['$scope', '$state', '$translate', 'platformGridControllerService', 'boqWicCatBoqService', 'boqWicCatBoqStandardConfigurationService', 'boqWicCatBoqValidationService', '$injector',
			function ($scope, $state, $translate, platformGridControllerService, boqWicCatBoqService, boqWicCatBoqStandardConfigurationService, boqWicCatBoqValidationService, $injector) {

				var myGridConfig = {initCalled: false, columns: []};
				platformGridControllerService.initListController($scope, boqWicCatBoqStandardConfigurationService, boqWicCatBoqService, boqWicCatBoqValidationService, myGridConfig);

				var boqMainService = $injector.get('boqMainService');
				var platformGridAPI = $injector.get('platformGridAPI');

				function syncWithCurrentBoqMainItem() {
					// Look if one of the loaded boq items corresponds to the currently loaded item in the boqMainService
					// and sync it if it's necessary. Currently we only sync if reference number or outline spec differ.

					// First look for a corresponding entry in the project boq list
					var wicCatBoqList = boqWicCatBoqService.getList();
					var boqMainRootItem = boqMainService.getRootBoqItem();

					var correspondingWicCatBoQ = _.find(wicCatBoqList, function (item) {
						if (angular.isDefined(item) && (item !== null) && angular.isDefined(item.BoqRootItem) && (item.BoqRootItem !== null)) {
							if (angular.isDefined(boqMainRootItem) && (boqMainRootItem !== null)) {
								return ((item.BoqRootItem.BoqHeaderFk === boqMainRootItem.BoqHeaderFk) && (item.BoqRootItem.Id === boqMainRootItem.Id));
							}
						}
						return false;
					});

					if (angular.isDefined(correspondingWicCatBoQ) && (correspondingWicCatBoQ !== null)) {
						var wicCatBoqRootItem = correspondingWicCatBoQ.BoqRootItem;
						if (angular.isDefined(wicCatBoqRootItem) && (wicCatBoqRootItem !== null) &&
							(wicCatBoqRootItem.Version < boqMainRootItem.Version) &&
							((wicCatBoqRootItem.Reference !== boqMainRootItem.Reference) || !angular.equals(wicCatBoqRootItem.BriefInfo, boqMainRootItem.BriefInfo))) {
							// We've detected a mismatch of property values between the corresponding wic cat boq and the
							// currently selected boq root item in the boq main service.
							// Furthermore the versions of the two entities differ in a way that we can suppose the entity
							// of the boqMainService is more up-to-date then the one from the project boq list.
							// -> do a reload to sync the items.
							boqWicCatBoqService.load();
						}
					}
				}

				var tools = [{
					id: 't11',
					caption: $translate.instant('boq.main.openBoq'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openBoQ() {
						// First save current changes via parent service...
						boqWicCatBoqService.prepareGoto().then(function () {
							// ...then go to boq module
							$state.transitionTo(globals.defaultState + '.boqmain');
						});
					}
				}];

				syncWithCurrentBoqMainItem();

				platformGridControllerService.addTools(tools);

				var setBoqMainReadOnlyState = function setBoqMainReadOnlyState() {
					let selectedWicBoqComposite = boqWicCatBoqService.getSelected();
					boqMainService.setReadOnly(boqWicCatBoqService.getReadOnly() || boqWicCatBoqService.isFrameworkWicBoq(selectedWicBoqComposite));
				};

				var setCellEditable = function (e, args) {
					var field = args.column.field;
					var item = args.item;

					if(boqWicCatBoqService.getReadOnly()) {
						return false;
					}

					return boqWicCatBoqService.getCellEditable(item, field);
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				boqMainService.requestReadOnlyState.register(setBoqMainReadOnlyState);

				$scope.$on('$destroy', function () {
					boqMainService.requestReadOnlyState.unregister(setBoqMainReadOnlyState);
				});
			}
		]);
})();
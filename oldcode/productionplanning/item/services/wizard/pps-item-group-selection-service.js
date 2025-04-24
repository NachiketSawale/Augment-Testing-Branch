/**
 * Created by anl on 8/19/2020.
 */


(function (angular) {
	'use strict';
	/* global angular, Slick, globals, _, moment */

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemGroupSelectionService', GroupSelectionService);

	GroupSelectionService.$inject = [
		'$q',
		'$http',
		'$translate',
		'platformGridAPI',
		'platformTranslateService',
		'productionplanningItemUIStandardService',
		'basicsLookupdataLookupFilterService',
		'PlatformMessenger',
		'productionplanningItemGroupUIService',
		'platformModalService'
	];

	function GroupSelectionService(
		$q,
		$http,
		$translate,
		platformGridAPI,
		platformTranslateService,
		itemUIStandardService,
		basicsLookupdataLookupFilterService,
		PlatformMessenger,
		groupUIService,
		platformModalService
	) {
		var service = {};

		var scope = {};

		var ppsItems = {};
		var eventInfo = {};
		var eventTypeIds = [];
		var eventTypeNames = [];
		var sumQuantity = 0;
		var defaultConfig = {};

		var eventTypeBeforePool = [];
		var eventTypeAfterPool = [];

		service.eventTypePool = [];
		service.selectedItems = {};
		service.selectionEntity = {};
		service.eventTypeSeqs = {};

		service.initialize = function initialize($scope) {
			scope = $scope;
			service.active();
		};

		service.updateGroupBeforeAfter = new PlatformMessenger();

		var filters = [
			{
				key: 'pps-itemgroup-eventtype-before-filter',
				fn: function (eventType) {
					return _.find(eventTypeBeforePool, {Id: eventType.Id});
				}
			},
			{
				key: 'pps-itemgroup-eventtype-after-filter',
				fn: function (eventType) {
					return _.find(eventTypeAfterPool, {Id: eventType.Id});
				}
			}];

		service.registerFilters = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
			service.updateGroupBeforeAfter.register(updateBeforeAfter);
		};

		service.unregisterFilters = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		service.updateEventSeq = function updateEventSeq() {
			var listItems = scope.gridOptions.itemGrid.dataView.getRows();
			var selectedItems = _.filter(listItems, function (item) {
				return item.Checked;
			});
			sumQuantity = 0;
			_.forEach(selectedItems, function (item) {
				sumQuantity += item.Quantity;
			});
			service.selectionEntity.Quantity = sumQuantity;
			service.selectedItems = selectedItems;
			updateEventSeqGrid(selectedItems);
		};

		service.updateEventSeqQuantity = function updateEventSeqQuantity(event, field) {
			if (field === 'Quantity') {
				var listEvents = scope.gridOptions.eventGrid.dataView.getRows();
				service.eventTypeSeqs = listEvents;
			}
		};

		service.getResult = function () {
			return {
				selectedItems: service.selectedItems,
				selectionEntity: service.selectionEntity,
				eventTypeSeqs: service.eventTypeSeqs
			};
		};

		service.isValid = function isValid() {

			return service.selectedItems.length > 0;
		};

		service.unActive = function unActive() {
			eventTypeBeforePool = eventTypeAfterPool = service.eventTypePool = [];
			var defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.active = function active() {
			initCache();

			var selectionForm = groupUIService.initForm(service);
			scope.formOptions = {
				configure: platformTranslateService.translateFormConfig(selectionForm)
			};
			initFormData(scope);

			var gridOptions = initGrid();
			gridOptions.itemGrid.data = ppsItems;
			gridOptions.eventGrid.data = service.eventTypeSeqs;

			platformGridAPI.grids.config(gridOptions.itemGrid);
			platformGridAPI.grids.config(gridOptions.eventGrid);

			scope.gridOptions = gridOptions;

		};

		service.showWarningInfo = function showWarningInfo(code) {
			switch (code) {
				case 1:
					platformModalService.showErrorBox('productionplanning.item.wizard.haveChildWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 2:
					platformModalService.showErrorBox('productionplanning.item.wizard.wrongStatesWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 3:
					platformModalService.showErrorBox('productionplanning.item.wizard.diffEventSequenceWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 6:
					platformModalService.showErrorBox('productionplanning.item.wizard.haveParentWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 7:
					platformModalService.showErrorBox('productionplanning.item.wizard.moreItemsWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 9:
					platformModalService.showErrorBox('productionplanning.item.wizard.notSame',
						'productionplanning.item.wizard.itemGroup.notSameTitle', 'warning');
					break;
			}
		};

		function initCache(){
			ppsItems = angular.copy(scope.context.selectedItems);
			eventInfo = angular.copy(scope.context.ppsEventInfo);
			eventTypeIds = _.values(eventInfo[0]);
			eventTypeNames = _.keys(eventInfo[0]);
			defaultConfig = eventInfo[1];
			initSortedEventType(angular.copy(scope.context.ppsEventTypes));
			eventTypeBeforePool = eventTypeAfterPool = service.eventTypePool;
			sumQuantity = 0;
		}

		function initGrid() {
			var columns = groupUIService.initColumn(eventInfo, eventTypeNames);
			var itemGrid = {
				id: '0b3e99d0bef74a34b6ccd626f5ad8d0e',
				title: 'productionplanning.item.listTitle',
				columns: columns.itemColumns,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: '0b3e99d0bef74a34b6ccd626f5ad8d0e',
				toolbarItemsDisabled: false
			};

			var eventGrid = {
				id: '33c4254c2bf64933ba64184febb640c4',
				title: 'productionplanning.item.listTitle',
				columns: columns.eventColumns,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: '33c4254c2bf64933ba64184febb640c4',
				toolbarItemsDisabled: false
			};

			return {
				itemGrid: itemGrid,
				eventGrid: eventGrid
			};
		}

		function initFormData($scope) {
			var passIds = _.map(eventInfo, function (value, key) {
				if (key > 0) {
					return key;
				}
			});

			service.selectedItems = _.filter(ppsItems, function (item) {
				return _.find(passIds, function (id) {
					return parseInt(id) === item.Id;
				});
			});

			_.forEach(service.selectedItems, function (selectedItem) {
				selectedItem.PPSItemFk = 0;
				selectedItem.Checked = true;
				sumQuantity += selectedItem.Quantity;
			});

			var foundGroupBefore = false;
			var foundGroupAfter = false;
			if(defaultConfig.GroupBefore !== null) {
				foundGroupBefore = _.find(eventTypeIds, function (id) {
					return parseInt(id) === parseInt(defaultConfig.GroupBefore);
				});
			}
			if(defaultConfig.GroupAfter !== null) {
				foundGroupAfter = _.find(eventTypeIds, function (id) {
					return parseInt(id) === parseInt(defaultConfig.GroupAfter);
				});
			}
			$scope.formOptions.selectionEntity = service.selectionEntity = {
				Id: 1,
				GroupBefore: foundGroupBefore ? parseInt(defaultConfig.GroupBefore): null,
				GroupAfter: foundGroupAfter ? parseInt(defaultConfig.GroupAfter): null,
				Quantity: sumQuantity
			};

			setEventStartTime(service.selectedItems);

			service.eventTypeSeqs = buildEventSeq(service.selectedItems);
		}

		function initSortedEventType(eventTypes) {
			service.eventTypePool = [];
			for (var i = 0; i < eventTypeIds.length; i++) {
				service.eventTypePool.push(_.find(eventTypes, {Id: parseInt(eventTypeIds[i])}));
			}
		}

		function setEventStartTime(selectedItems) {
			_.forEach(selectedItems, function (item) {
				var dates = eventInfo[item.Id];
				item.DateInfo = {};
				for (var i = 0; i < eventTypeNames.length; i++) {
					item.DateInfo[eventTypeNames[i]] = moment(dates[eventTypeNames[i]]).utc();
				}
			});
		}

		function updateBeforeAfter(entity, field) {
			var pushEventType = false;
			switch (field) {
				case 'GroupBefore':
					var spilitAfter = [];

					_.forEach(service.eventTypePool, function (eventType) {
						if (eventType.Id === entity.GroupBefore) {
							pushEventType = true;
							spilitAfter.push(eventType);
						}
						if (pushEventType && !_.find(spilitAfter, {Id: eventType.Id})) {
							spilitAfter.push(eventType);
						}
					});
					eventTypeAfterPool = spilitAfter;
					break;

				case 'GroupAfter':
					var spilitBefore = [];
					pushEventType = true;

					_.forEach(service.eventTypePool, function (eventType) {
						if (eventType.Id === entity.GroupAfter) {
							spilitBefore.push(eventType);
							pushEventType = false;
						}
						if (pushEventType && !_.find(spilitBefore, {Id: eventType.Id})) {
							spilitBefore.push(eventType);
						}
					});
					eventTypeBeforePool = spilitBefore;
					break;
				default:
					return;
			}
		}

		/**
		 * Build data of Event Sequence grid based on selectedItems in PU grid
		 * @param selectedItems
		 * @returns {*|[]}
		 */
		function buildEventSeq(selectedItems) {
			var eventSequence = [];
			var event = {};
			for (var i = 0; i < service.eventTypePool.length; i++) {
				var quantity = 0;
				var startDate = null;
				_.forEach(selectedItems, function (item) {
					var newStartDate = moment(eventInfo[item.Id][eventTypeNames[i]]).utc();
					if (startDate === null || !startDate._isValid) {
						startDate = newStartDate;
					} else {
						startDate = newStartDate !== null && startDate.diff(newStartDate) > 0 ?
							newStartDate : startDate;
					}
					quantity = newStartDate !== null ? quantity + item.Quantity : quantity;
				});
				event = {
					Id: i,
					EventTypeFk: parseInt(eventTypeIds[i]),
					PlannedStart: startDate,
					Quantity: quantity
				};
				eventSequence.push(event);
			}
			eventSequence = _.sortBy(eventSequence, 'PlannedStart');
			return eventSequence;
		}

		function updateEventSeqGrid(selectedItems) {
			service.eventTypeSeqs = buildEventSeq(selectedItems);
			scope.gridOptions.eventGrid.dataView.setItems(service.eventTypeSeqs);
			scope.gridOptions.eventGrid.data = service.eventTypeSeqs;
			platformGridAPI.items.data(scope.gridOptions.eventGrid.state, service.eventTypeSeqs);
			platformGridAPI.grids.refresh(scope.gridOptions.eventGrid.state, true);
		}

		return service;
	}

})(angular);
(function () {
	'use strict';

	function subscribeEventsController($scope, platformModuleStateService, basicsWorkflowBaseGridController,
	                                   basicsWorkflowEventService, basicsWorkflowTemplateService) {
		var state = platformModuleStateService.state('basics.workflow');

		var columns = [
			{
				id: 'uuid',
				field: 'Uuid',
				name: 'event',
				name$tr$: 'basics.workflow.subscribedEvents.event',
				sortable: true,
				width: 150,
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'basics-workflow-event-dialog-lookup',
					lookupOptions: {
						showClearButton: true,
						valueMember: 'uuid',
						displayMember: 'description',
						dataProvider: {
							getList: function () {
								return basicsWorkflowEventService.getEvents();
							},
							getItemByKey: function (uuid) {
								return basicsWorkflowEventService.getEvent(uuid);
							},
							getSearchList: function () {
								var searchObj = arguments[arguments.length - 1];
								return basicsWorkflowEventService.getEvents().then(function (response) {
									response = _.filter(response, function (item) {
										return _.includes(item.description.toUpperCase(), searchObj.searchString.toUpperCase());
									});
									return _.uniqBy(response, 'uuid');
								});
							}
						}
					}
				},
				formatter: function (row, cell, value) {
					var entity = basicsWorkflowEventService.getEvent(value);
					if (entity) {
						return entity.description;
					} else {
						return '';
					}
				},
				grouping: {
					title: 'Event',
					title$tr$: 'basics.workflow.subscribedEvents.event',
					getter: 'Uuid',
					aggregators: [],
					aggregateCollapsed: false
				}
			}
		];

		function getItemsWatch() {
			return state.selectedMainEntity;
		}

		function itemsListener(newVal, oldVal) {
			if (newVal) {
				$scope.setItems(filterList(newVal.SubscribedEvents), oldVal ? oldVal.SubscribedEvents : null);
			}
		}

		function filterList(list) {
			return _.filter(list, {IsDeleted: false});
		}

		function getCurrentItemWatch() {
			return state.selectedSubscribedEvent;
		}

		function currentItemListener(newVal, oldVal) {
			if (newVal && (newVal !== oldVal)) {
				$scope.changeToolbar(null, true);
				if (_.indexOf(state.selectedMainEntity.SubscribedEvents, {Id: newVal.Id}) === -1) {
					$scope.setItems(filterList(state.selectedMainEntity.SubscribedEvents), null);
				}
				basicsWorkflowBaseGridController.gridAPI.rows.selection({
					gridId: $scope.gridId,
					rows: [newVal],
					nextEnter: $scope.newItemIsAdded
				});
				$scope.newItemIsAdded = false;
			}
		}

		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			{expression: getCurrentItemWatch, listener: currentItemListener, name: 'selectedSubscribedEvent'}, {
				expression: getItemsWatch,
				listener: itemsListener
			});
		$scope.configGrid({
			data: [],
			columns: angular.copy(columns),
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				idProperty: 'Id',
				showFooter: false
			}
		});

		var disabledFn = function () {												//--Defect #111659 - New - Update toolbar
			var disabled = false;
			if (_.isEmpty(state.selectedMainEntity)) {
				disabled = true;
			}
			return disabled;
		};

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't4',
						caption: 'cloud.common.toolbarSearch',
						type: 'check',
						value: _.isObject(basicsWorkflowBaseGridController.gridAPI.filters.showSearch($scope.gridId)) ? true : basicsWorkflowBaseGridController.gridAPI.filters.showSearch($scope.gridId),
						iconClass: 'tlb-icons ico-search',
						disabled: disabledFn,
						fn: function () {
							basicsWorkflowBaseGridController.gridAPI.filters.showSearch($scope.gridId, this.value);
						}
					},
					{
						id: 'insert',
						caption: 'cloud.common.toolbarInsert',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						disabled: disabledFn, //false, //$scope.isNewButtonDisabled,
						fn: function () {
							basicsWorkflowTemplateService.createNewSubscribedEvent(state.selectedMainEntity.Id);
						}
					},
					{
						id: 'delete',
						caption: 'cloud.common.toolbarDelete',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						// disabled: $scope.isDeleteButtonDisabled,
						disabled: disabledFn,
						fn: function () {
							basicsWorkflowTemplateService.markCurrentSubscribedEventForDelete();
							basicsWorkflowBaseGridController.gridAPI.items.data($scope.gridId, filterList(state.selectedMainEntity.SubscribedEvents));
						}
					}
				]
			});

	}

	subscribeEventsController.$inject = ['$scope', 'platformModuleStateService', 'basicsWorkflowBaseGridController',
		'basicsWorkflowEventService', 'basicsWorkflowTemplateService'];

	angular.module('basics.workflow').controller('basicsWorkflowSubscribedEventsController', subscribeEventsController);
})();

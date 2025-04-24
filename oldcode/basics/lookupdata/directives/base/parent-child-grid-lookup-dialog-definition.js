/**
 * Created by jes on 2/13/2017.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('BasicsLookupdataParentChildGridLookupDialogDefinition', BasicsLookupdataParentChildGridLookupDialogDefinition);

	BasicsLookupdataParentChildGridLookupDialogDefinition.$inject = [
		'_',
		'platformGridAPI',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataParentChildGridDataService'
	];

	function BasicsLookupdataParentChildGridLookupDialogDefinition(
		_,
		platformGridAPI,
		BasicsLookupdataLookupDirectiveDefinition,
		basicsLookupdataParentChildGridDataService
	) {

		return function (options) {

			var parentDataService = basicsLookupdataParentChildGridDataService.createDataService(
				{
					role: 'parent',
					key: options.parent.key,
					presenter: options.parent.presenter,
					httpRead: options.parent.httpRead,
					dataProcessor: _.isArray(options.parent.dataProcessor) ? options.parent.dataProcessor : []
				});

			var childDataService = basicsLookupdataParentChildGridDataService.createDataService(
				{
					role: 'child',
					presenter: options.child.presenter,
					httpRead: options.child.httpRead,
					parentFk: options.child.parentFk,
					filterParent: options.child.filterParent,
					showAllSearchResult: options.child.showAllSearchResult,
					dataProcessor: _.isArray(options.child.dataProcessor) ? options.child.dataProcessor : []
				});

			parentDataService.childService = childDataService;
			childDataService.parentService = parentDataService;

			if (!options.width) {
				options.width = '900px'; // default modal dialog width
			}

			options.parent.dataService = parentDataService;

			options.child.dataService = childDataService;

			options.dialogOptions.templateUrl = globals.appBaseUrl + 'basics.lookupdata/partials/parent-child-grid-lookup-dialog-template.html';
			options.dialogOptions.controller = ['$scope', 'keyCodes', '$translate', controller];

			if (!_.isNil(options.popupOptions)) {
				options.columns = _.cloneDeep(options.child.columns); // for popup grid
			}

			if (options.dataProvider) {
				return new BasicsLookupdataLookupDirectiveDefinition('input-base', options, {dataProvider: options.dataProvider});
			} else {
				return new BasicsLookupdataLookupDirectiveDefinition('input-base', options);
			}
		};

		function controller(scope, keyCodes, $translate) {
			var pOptions = scope.options;
			var parentService = pOptions.parent.dataService;
			var childService = pOptions.child.dataService;

			var isDisableOkButton = true;
			var canApply = _.isFunction(pOptions.child.canApply) ? pOptions.child.canApply : function () {return true;};

			initialize();

			function initialize() {

				scope.modalOptions = {
					headerText: $translate.instant(pOptions.dialogOptions.headerText),
					refresh: refresh,
					ok: ok,
					cancel: cancel,
					search: search,
					onSearchInputKeyDown: onSearchInputKeyDown,
					searchValue: null,
					disable: function () {
						return isDisableOkButton;
					}
				};

				scope.gridOptions = {
					parent: {
						dataService: parentService,
						uuid: pOptions.parent.uuid,
						gridData: {
							state: pOptions.parent.uuid
						},
						columns: pOptions.parent.columns
					},
					child: {
						dataService: childService,
						uuid: pOptions.child.uuid,
						gridData: {
							state: pOptions.child.uuid
						},
						columns: pOptions.child.columns
					}
				};

				parentService.registerSelectionChanged(onParentSelectionChanged);
				parentService.registerSelectionChanged(childService.load);
				childService.registerSelectionChanged(onChildSelectionChanged);
				platformGridAPI.events.register(pOptions.child.uuid, 'onDblClick', ok);
				parentService.load();

				scope.$on('$destroy', function () {
					parentService.unregisterSelectionChanged(onParentSelectionChanged);
					parentService.unregisterSelectionChanged(childService.load);
					childService.unregisterSelectionChanged(onChildSelectionChanged);
					platformGridAPI.events.unregister(pOptions.child.uuid, 'onDblClick', ok);
				});
			}

			function refresh() {
				if (scope.modalOptions.searchValue) {
					parentService.setSelected(null);
					search(scope.modalOptions.searchValue);
				} else {
					parentService.refresh();
					childService.clear();
				}
			}

			function ok() {
				var selected = childService.getSelected();
				if (selected && canApply(selected)) {
					scope.$close({
						isOk: true,
						selectedItem: selected
					});
				}
			}

			function cancel() {
				scope.$close({isOk: false, selectedItem: null});
			}

			function search(searchValue) {
				var disableGetAll = _.isNil(pOptions.child.httpSearch.disableGetAll) ? true : pOptions.child.httpSearch.disableGetAll;
				if (disableGetAll && !searchValue) {
					return;
				}
				parentService.setSelected(null);
				childService.search(searchValue, {
					lookupType: pOptions.lookupType,
					searchOptions: pOptions.child.httpSearch
				});
			}

			function onSearchInputKeyDown($event, searchValue) {
				if (event.keyCode === keyCodes.ENTER || scope.instantSearch) {
					search(searchValue);
				}
			}

			function onChildSelectionChanged() {
				var selected = childService.getSelected();
				if (selected) {
					isDisableOkButton = !canApply(selected);
				}
			}

			function onParentSelectionChanged() {
				childService.unLoadSubItems();
				isDisableOkButton = true;
			}
		}
	}

})(angular, globals);
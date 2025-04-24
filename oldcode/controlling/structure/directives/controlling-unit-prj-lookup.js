/**
 * Created by joj on 2017/4/13.
 */
(function (angular) {
	'use strict';
	/* globals _ */
	// controlling-Structure-Prj-Controlling-Unit-Lookup
	angular.module('controlling.structure').directive('controllingStructurePrjControllingUnitLookup', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', getOption(), {
				processData: function (itemList, options) {
					let result = [];
					if (options.considerPlanningElement && itemList && itemList.length > 0) {
						let allItems = [];
						$injector.get('cloudCommonGridService').flatten(itemList, allItems, 'ControllingUnits');
						_.forEach(allItems, function (item) {
							if(item && (item.IsPlanningElement || _.isArray(item.ControllingUnits) && item.ControllingUnits.length)) {
								result.push(item);
								item.ControllingUnits = [];
							}
						});
					}
					return result;
				}
			});
		}]);

	function getOption() {
		return {
			version: 2,
			lookupType: 'prjcontrollingunit',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: 'a3d886e6260549979ff4247271d24615',
			columns: [
				{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
				{id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription'},
				{id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'quantity', name$tr$: 'cloud.common.entityQuantity', searchable:false},
				{id: 'qtyuom', field: 'UomFk', name: 'UomFk', width: 120, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
					formatterOptions: {lookupType: 'uom', displayMember: 'Unit'}, searchable:false}
			],
			height: 250,
			treeOptions: {
				parentProp: 'ControllingunitFk',
				childProp: 'ControllingUnits',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			},
			title: {name: 'Controlling Unit Code Search Dialog', name$tr$: 'cloud.common.controllingCodeTitle'},
			buildSearchString: function (searchValue) {
				if (!searchValue) {
					return '';
				}
				let searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
				return searchString.replace(/%SEARCH%/g, searchValue);
			},
			events: [
				{
					name: 'onSelectedItemChanged',
					handler: function (e, args) {
						if(args && args.entity){
							if(args.selectedItem){
								args.entity.selectedLeafCu = !args.selectedItem.ControllingUnits || args.selectedItem.ControllingUnits.length === 0;
							}
						}
					}
				}
			]
		};
	}

	angular.module('controlling.structure').directive('controllingStructurePrjControllingUnitLookupAction', ['basicsLookupdataLookupFilterService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (basicsLookupdataLookupFilterService, BasicsLookupdataLookupDirectiveDefinition) {

			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'est-prj-controlling-unit-filter',
				serverSide: true,
				serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
				fn: function (controlling/* , entity */) {
					return 'ProjectFk=' + (controlling.ProjectFk ? controlling.ProjectFk : controlling.ControllingUnit && controlling.ControllingUnit.ProjectFk ? controlling.ControllingUnit.ProjectFk : 0);
				}
			}]);

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', getOption());
		}]);
})(angular);

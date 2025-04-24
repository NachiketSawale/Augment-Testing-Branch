(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).directive('ppsItemSourceBoqLookup', SourceBoqLookup);
	SourceBoqLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];
	function SourceBoqLookup(BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			lookupType: 'BoqItem',
			valueMember: 'Id',
			displayMember: 'Reference',
			uuid: '62854a545b1141ef903abfd36d7bffd9',
			columns: [{
				id: 'ref',
				field: 'Reference',
				name: 'Reference',
				width: 100,
				toolTip: 'Reference',
				formatter: 'description',
				name$tr$: 'boq.main.Reference'
			}, {
				id: 'brief',
				field: 'BriefInfo',
				name: 'Brief',
				width: '120',
				toolTip: 'Brief',
				formatter: 'translation',
				name$tr$: 'boq.main.BriefInfo'
			}],
			showClearButton: true,
			treeOptions: {
				parentProp: 'BoQItemFk',
				childProp: 'BoqItems',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
	}
})(angular);
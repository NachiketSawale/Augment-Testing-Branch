(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonHeaderLookup', ProductionplanningCommonHeaderLookup);

	ProductionplanningCommonHeaderLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ProductionplanningCommonHeaderLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'CommonHeader',
			valueMember: 'Id',
			displayMember: 'Code',
			//editable: 'false'
			uuid: '9dad8bcad3f64813b7614d3c4c71f43e',
			columns: [
				{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'DescriptionInfo', name$tr$: 'cloud.common.entityDescription' },
				{
					id: 'prjprojectfk', field: 'PrjProjectFk', name: 'Project No', name$tr$: 'productionplanning.common.prjProjectFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					}
				},
				{
					id: 'basclerkprpfk', field: 'BasClerkPrpFk', name: 'Preparation Clerk', name$tr$: 'productionplanning.common.basClerkPrpFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'clerk',
						lookupDirective: 'cloud-clerk-clerk-dialog',
						lookupOptions: {
							showClearButton: true
						},
						displayMember: 'Code'
					}
				},
				{
					id: 'prjlocationfk', field: 'PrjLocationFk', name: 'Location', name$tr$: 'productionplanning.common.PrjLocationFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'ProjectLocation',
						displayMember: 'DescriptionInfo.Description'
					}
				}
			],
			width: 500,
			height: 200,
			title: { name: 'Assign Header', name$tr$: 'productionplanning.common.dialogTitleHeader' }
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);
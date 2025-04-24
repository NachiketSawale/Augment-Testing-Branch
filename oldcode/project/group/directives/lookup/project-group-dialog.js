(function(angular){
	'use strict';
	var moduleName = 'project.group';
	angular.module(moduleName).directive('projectGroupDataDialog', ProjectGroupDataDialog);

	ProjectGroupDataDialog.$inject = ['_', 'BasicsLookupdataLookupDirectiveDefinition'];

	function ProjectGroupDataDialog(_, BasicsLookupdataLookupDirectiveDefinition){
		var defaults = {
			version: 3,
			lookupType: 'ProjectGroupTree',
			valueMember: 'Id',
			displayMember: 'Code',
			descriptionMember: 'DescriptionInfo.Translated',
			dialogUuid: '071f838025c745e3bcf9ff501cb98b4f',
			uuid: '6df7ca744ab64644b2f791b1ee3dc831',
			columns: [
				{ id: 'code', field: 'Code', name: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'descriptioninfo', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription' },
				{ id: 'Comments', field: 'CommentText', name: 'Comment', formatter: 'comment', width: 150, name$tr$: 'cloud.common.entityComment' },
				{ id: 'UncPath', field: 'UncPath', name: 'UncPath', formatter: 'comment', width: 150, name$tr$: 'project.group.uncPath' }
			],
			treeOptions: {
				parentProp: 'ProjectGroupFk',
				childProp: 'Children',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true

			},
			width: 500,
			height: 200,
			disableDataCaching : true,
			selectableCallback: function(dataItem){
				return dataItem.IsActive === true;
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
	}
})(angular);
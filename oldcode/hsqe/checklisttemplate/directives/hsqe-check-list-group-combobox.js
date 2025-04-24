(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName).directive('hsqeCheckListGroupCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'HsqeCheckListGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '381b12d5faf34d7b846b479538cabf3f',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 80,
						name$tr$:'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 120,
						name$tr$:'cloud.common.entityDescription'
					}
				],
				treeOptions: {
					parentProp: 'HsqCheckListGroupFk',
					childProp: 'HsqChecklistgroupChildren',
					initialState: 'expanded',
					inlineFilter: true,
					hierarchyEnabled:true
				}
			};

			function setImage(entity) {
				if (entity.HasChildren) {
					entity.image = 'ico-folder-assemblies';
                    
					for (var i = 0; i < entity.HsqChecklistgroupChildren.length; i++) {
						setImage(entity.HsqChecklistgroupChildren[i]);
					}
				}
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				processData: function (entities) {
					for (var i = 0; i < entities.length; i++) {
						setImage(entities[i]);
					}
					return entities;
				}
			});
		}]);
})(angular);

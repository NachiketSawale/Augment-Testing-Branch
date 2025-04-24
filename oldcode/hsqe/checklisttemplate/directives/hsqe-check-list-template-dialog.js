(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName).directive('hsqeCheckListTemplateDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'HsqeCheckListTemplate',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '1c8d62c519a54a3aaf3bd3b5946fe69a',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter:'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'Description', field: 'DescriptionInfo.Translated', name: 'Description', width: 200,  name$tr$: 'cloud.common.entityDescription'},
					{ id: 'CommentText', field: 'CommentText', name: 'CommentText', width: 200, name$tr$: 'cloud.common.entityCommentText'}
				],
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);
})(angular);

(function (angular) {
	'use strict';
	angular.module('qto.main').directive('qtoCommentCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition', 'qtoCommentComboboxDataService',
		function ($q, BasicsLookupdataLookupDirectiveDefinition, qtoCommentComboboxDataService) {
			let defaults = {
				version: 2,
				lookupType: 'QtoComment',
				valueMember: 'Id',
				displayMember: 'CommentText',
				columns: [
					{id: 'Code', field: 'Code', name: 'Code',width: 100, name$tr$: 'cloud.common.entityCode'},
					{
						id: 'CommentText',
						field: 'CommentText',
						name: 'CommentText',
						width: 1000,
						name$tr$: 'qto.formula.comment.title'
					}
				],
				title: {name: 'CommentText', name$tr$: 'qto.formula.comment.title'},
				selectableCallback: function (dataItem, entity) {
					if (dataItem && entity) {
						entity.LineText = dataItem.CommentText;
					}
					return true;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'qtoCommentComboboxLookupHandler',
					getList: function getList(settings, scope) {
						let currentQtoLine = scope.entity;
						return qtoCommentComboboxDataService.getQtoCommentList(currentQtoLine.QtoHeaderFk);
					}
				}
			});
		}
	]);
})(angular);
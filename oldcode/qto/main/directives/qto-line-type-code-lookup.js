
(function (angular, globals) {
	'use strict';
	/* global  globals */

	globals.lookups.qtoLineTypeCode = function qtoLineTypeCode(){
		return {
			lookupOptions:{
				lookupType: 'qtoLineTypeCode',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'cbed25157ad14953ae173ba5dcab0001',
				matchDisplayMembers: ['Code'],
				isClientSearch: true,
				columns: [
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription'}
				],
				title: { name: 'CommentText', name$tr$: 'qto.formula.comment.title' },
				searchInterval: 1200,
				formatInput: function (newValue) {
					return  newValue;
				}
			},
			dataProvider: 'qtoLineTypeCodeLookupService'
		};
	};

	angular.module( 'qto.main' ).directive( 'qtoLineTypeCodeLookup', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition)
		{
			var defaults = globals.lookups.qtoLineTypeCode($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	] );
})(angular, globals);
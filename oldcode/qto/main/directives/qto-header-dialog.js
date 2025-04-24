/**
 * Created by lvy on 7/31/2019.
 */
( function ( angular, globals){
	/* global  globals */
	'use strict';
	var moduleName = 'qto.main';

	globals.lookups.QtoHeader = function QtoHeader(){
		return {
			lookupOptions:{
				version: 2,
				lookupType: 'QtoHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'c314c95640d341699bc41c96cd28db40',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' }
				],
				title: {name: 'Assign QTO Header', name$tr$: 'qto.main.dialogTitleQTOHeader'}
			}
		};
	};

	angular.module(moduleName).directive( 'qtoHeaderDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition)
		{
			var defaults = globals.lookups.QtoHeader();
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions);
		}
	] );
})( angular, globals);
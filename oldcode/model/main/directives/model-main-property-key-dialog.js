/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	angular.module('model.main').directive('modelMainPropertyKeyDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 3,
				lookupType: 'PropertyKey',
				valueMember: 'Id',
				displayMember: 'PropertyName',
				columns: [
					{id: 'pn', field: 'PropertyName', name: 'Name', name$tr$: 'cloud.common.entityName', width: 280},
					{id: 'vtCode', field: 'ValueTypeDto.Code', name: 'Type Code', name$tr$: 'typeCode', width: 75},
					{
						id: 'vtName',
						field: 'ValueTypeDto.DescriptionInfo.Translated',
						name: 'Type Name',
						name$tr$: 'typeName',
						width: 180
					}
				],
				title: {name: 'Assign Property Key', name$tr$: 'model.main.propKeyDialogTitle'},
				uuid: '64e74b4b2a834fd583c5626ddc8fd56c',
				pageOptions: {
					enabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);

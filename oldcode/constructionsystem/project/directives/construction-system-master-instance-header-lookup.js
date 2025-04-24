/**
 * created by zpa on 2016/8/18.
 */
(function (angular) {
	'use strict';
	var modulename = 'constructionsystem.project';

	angular.module(modulename).directive('constructionSystemProjectInstanceHeaderLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'InstanceHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '54f0d34a3d054217aa8c8c292a81f6ae',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);

})(angular);

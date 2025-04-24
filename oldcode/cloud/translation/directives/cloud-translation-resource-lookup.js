(function (angular) {
	'use strict';
	angular.module('cloud.translation').directive('cloudTranslationResourceLookup', ['$http', '_', '$q', 'cloudTranslationResourceDataService', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupFilterService',
		function ($http, _, $q, cloudTranslationResourceDataService, BasicsLookupdataLookupDirectiveDefinition, filterService) {
			var defaults = {
				lookupType: 'cloudTranslationResourceLookup',
				valueMember: 'Id',
				displayMember: 'ResourceTerm',
				uuid: '4bb6e7abca2f44b5a452f162ea4863af',
				columns: [
					{
						id: 'id',
						field: 'Id',
						name: 'Id',
						width: 20,
						toolTip: 'Id',
						formatter: 'integer',
						name$tr$: 'cloud.common.entityId'
					},
					{
						id: 'resourceterm',
						field: 'ResourceTerm',
						name: 'ResourceTerm',
						width: 120,
						toolTip: 'ResourceTerm',
						formatter: 'description',
						name$tr$: 'cloud.translation.ResourceTerm'
					},
					{
						id: 'resourcekey',
						field: 'ResourceKey',
						name: 'Resourcekey',
						width: 70,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.resourceKey'
					},
					{
						id: 'path',
						field: 'Path',
						name: 'Path',
						width: 70,
						toolTip: 'Path',
						formatter: 'description',
						name$tr$: 'cloud.translation.path'
					},
					{
						id: 'isapproved',
						field: 'IsApproved',
						name: 'IsApproved',
						width: 20,
						toolTip: 'Is Approved',
						formatter: 'boolean',
						name$tr$: 'cloud.translation.IsApproved'
					}
				],
				width: 700,
				height: 300,
				title: {name: 'Assign a Resource', name$tr$: 'cloud.translation.assignAResource'}
			};

			var filters = [
				{
					key: 'self-reference-resource',
					fn: function (resource, entity) {
						// allow ressources with no parent, and all but no self-reference
						return entity.Id !== resource.Id && resource.ResourceFk === null;
					}
				}
			];

			filterService.registerFilter(filters);

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'cloudTranslationResourceLookup',

					getList: function () {
						return cloudTranslationResourceDataService.getSearchList('');
					},
					getItemByKey: function (key) {
						return cloudTranslationResourceDataService.getItemByKey(key);
					},
					getSearchList: function (value) {
						return cloudTranslationResourceDataService.getSearchList(value);
					}
				}
			});
		}]);
})(angular);

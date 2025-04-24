/**
 * Created by zos on 9/11/2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.unit';
	angular.module(moduleName).directive('basicsLookupdataUomLookup',['_','BasicsLookupdataLookupDirectiveDefinition',
		function (_, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'uom',
				valueMember: 'Id',
				displayMember: 'Unit',
				dialogUuid: '976a83d47233498194855c8930e43d51',
				uuid: '9fe88b1569494b239bb295e2375f2d1a',
				columns: [
					{ id: 'Uom', field: 'Unit', name: 'Uom', width: 100,name$tr$: 'cloud.common.entityUoM' },
					{ id: 'Description', field: 'DescriptionInfo.Translated', name: 'Description', width: 150,name$tr$: 'cloud.common.entityDescription' },
					{ id: 'IsoCode', field: 'IsoCode', name: 'IsoCode', width: 150,name$tr$: 'basics.unit.isoCode' }
				],
				filterOptions: {
					serverSide: false,
					fn: function (item, entity) {
						if (entity.Material2Uoms) {
							return _.includes(_.map(entity.Material2Uoms, 'UomFk'), item.Id) && item.IsLive;
						} else if(entity.Material2UomIds){
							return _.includes(entity.Material2UomIds, item.Id) && item.IsLive;
						} else {
							return item.IsLive;
						}
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);

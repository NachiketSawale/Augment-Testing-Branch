(function (angular, globals) {
    'use strict';

    var moduleName = 'productionplanning.common';

    globals.lookups.pesItem = function pesItem() {
        return {
            lookupOptions: {
                version: 2,
                lookupType: 'PesItemWithPpsUpStream',
                valueMember: 'Id',
                displayMember: 'Description1',
                uuid: '3819a8a5317c4579908f4d2e2f95d757',
                columns: [
                    {
                        id: 'itemNo',
                        field: 'ItemNo',
                        name$tr$: 'procurement.pes.entityItemNo'
                    },
                    {
                        id: 'description1',
                        field: 'Description1',
                        name$tr$: 'cloud.common.entityDescription'
                    },
                    {
                        id: 'description2',
                        field: 'Description2',
                        name$tr$: 'cloud.common.entityDescription2'
                    },
                    {
                        id: 'pesStatusFkDescription',
                        field: 'PesStatusFk',
                        name$tr$: 'cloud.common.entityState',
                        formatter: 'lookup',
                        formatterOptions: {
	                        lookupType: 'PesStatus',
	                        displayMember: 'Description',
	                        imageSelector: 'platformStatusIconService'
                        },
                        searchable: false
                    },
	                {
		                id: 'projectNo',
		                field: 'PrjProjectFk',
		                name$tr$: 'cloud.common.entityProjectNo',
		                formatter: 'lookup',
		                formatterOptions: {
			                lookupType: 'project',
			                displayMember: 'ProjectNo'
		                }
	                },
	                {
		                id: 'projectName',
		                field: 'PrjProjectFk',
		                name$tr$: 'cloud.common.entityProjectName',
		                formatter: 'lookup',
		                formatterOptions: {
			                lookupType: 'project',
			                displayMember: 'ProjectName'
		                }
	                },
	                {
		                id: 'pesItemQuantity',
		                field: 'Quantity',
		                name$tr$: 'cloud.common.entityQuantity',
		                searchable: false
	                },
	                {
		                id: 'pesItemUom',
		                field: 'BasUomFk',
		                name$tr$: 'cloud.common.entityUoM',
		                formatter: 'lookup',
		                formatterOptions: {
			                lookupType: 'uom',
			                displayMember: 'Unit'
		                },
		                searchable: false
	                }
                ],
                width: 500,
                height: 200,
                title: {name:'productionplanning.common.pesItemLookupDialogTitle'}
            }
        };
    };

    /**
     * @ngdoc directive
     * @name productionplanning.pesItem.directive:productionplanningCommonPesItemLookup
     * @element div
     * @restrict A
     * @description
     * Package lookup.
     *
     */
    angular.module(moduleName).directive('productionplanningCommonPesItemLookup', ['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition',
        function (basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition) {
            return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.pesItem().lookupOptions);
        }
    ]);

})(angular, globals);
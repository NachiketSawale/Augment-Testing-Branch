/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).directive('modelEstLineItemDialogLookup',
		modelEstLineItemDialogLookup);

	modelEstLineItemDialogLookup.$inject = ['$injector',
		'BasicsLookupdataLookupDirectiveDefinition'];

	function modelEstLineItemDialogLookup($injector,
		BasicsLookupdataLookupDirectiveDefinition) {

		const defaults = {
			lookupType: 'modelEstLineItem',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '0b46e35958334917b4ad0d8d9e0d254e',
			columns: [
				{
					id: 'IsTemp', field: 'IsTemp', name: 'Temporary', width: 20,
					formatter: 'image',
					formatterOptions: {
						imageSelector: 'platformStatusIconService'
					},
					name$tr$: 'model.main.temporary'
				},
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					width: 180,
					formatter: 'code',
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'Description',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					width: 300,
					formatter: 'description',
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			width: 660,
			height: 200,
			title: {name: 'Model Line Item', name$tr$: 'model.main.lineItemSelection'},
			events: [
				{
					name: 'onSelectedItemChanged', // register event and event handler here.
					handler: function (e, args) {
						const lineItemEntity = args.selectedItem;
						const modelObjectService = $injector.get('modelMainEstLineItem2ObjectService');
						const modelObject = modelObjectService.getSelected();
						// calculate te quantitytotal for lineitem2modelobject
						modelObject.QuantityTotal = lineItemEntity.QuantityFactor1 * lineItemEntity.QuantityFactor2 * lineItemEntity.QuantityFactor3 * lineItemEntity.QuantityFactor4 * lineItemEntity.ProductivityFactor;
						modelObjectService.markItemAsModified(modelObject);
					}
				}]
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
			dataProvider: 'modelEstLineItemLookupDataService'
		});
	}
})(angular);

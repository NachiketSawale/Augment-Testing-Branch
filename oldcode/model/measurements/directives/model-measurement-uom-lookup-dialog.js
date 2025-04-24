/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.measurements').directive('modelMeasurementUomLookupDialog',
		modelMeasurementUomLookupDialog);

	modelMeasurementUomLookupDialog.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function modelMeasurementUomLookupDialog(BasicsLookupdataLookupDirectiveDefinition) {

		const defaults = {
			version: 3,
			lookupType: 'ModelMeasurementUom',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			columns: [{
				id: 'uom',
				field: 'Uom',
				name$tr$: 'model.measurements.uom',
				width: 100
			}],
			title: {
				name$tr$: 'model.measurements.measurementLookupTitle'
			},
			uuid: '2911e5c2391f40799106b734a67a9b63',
			pageOptions: {
				enabled: true
			}
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);
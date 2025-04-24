/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.main').directive('modelMainObjectLookupDialog',
		modelMainObjectLookupDialog);

	modelMainObjectLookupDialog.$inject = ['BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataConfigGenerator', 'modelViewerModelSelectionService', '_',
		'basicsLookupdataLookupFilterService'];

	function modelMainObjectLookupDialog(BasicsLookupdataLookupDirectiveDefinition,
		basicsLookupdataConfigGenerator, modelViewerModelSelectionService, _,
		basicsLookupdataLookupFilterService) {

		const filters = [{
			key: 'model-main-object-by-model-filter',
			serverKey: 'model-main-object-by-model-filter',
			serverSide: true,
			fn: function (item) {
				return {
					ModelFk: item.ModelFk || item.MdlModelFk
				};
			}
		}];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		const defaults = {
			version: 3,
			lookupType: 'ModelObject',
			valueMember: 'Id',
			displayMember: 'Description',
			columns: [{
				id: 'description',
				field: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				width: 300
			}, {
				id: 'uuid',
				field: 'CpiId',
				name$tr$: 'model.main.objectCpiId',
				width: 400
			}],
			title: {
				name$tr$: 'model.main.objectLookupTitle'
			},
			uuid: '0d951f8354464b40855f470af598d11d',
			pageOptions: {
				enabled: true
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);

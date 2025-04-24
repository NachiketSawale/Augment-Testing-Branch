/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainColumnConfigLineTypeCombobox
	 * @requires  BasicsLookupdataLookupDirectiveDefinition, estimateMainColumnConfigDetailService
	 * @description dropdown lookup grid to select the line type item
	 */

	angular.module(moduleName).directive('estimateMainColumnConfigLineTypeCombobox',[
		'$http', '$q', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($http, $q, BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'getlinetypes',
				valueMember: 'Id',
				displayMember: 'ShortKeyInfo.Translated',
				uuid: '2d1b26e0a6054a29a16768402cab5d69',
				columns:[
					{ id: 'id', field: 'ShortKeyInfo.Translated', name: 'Code',toolTip: 'Resource Type Code', formatter: 'code', name$tr$: 'cloud.common.entityCode'},
					{ id: 'Description', field: 'DescriptionInfo.Translated', name: 'Description', toolTip: 'Description', formatter: 'description',  name$tr$: 'cloud.common.entityDescription'}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: 'estimateMainEstColumnConfigLineTypeComboboxService'
			});
		}]);
})(angular);

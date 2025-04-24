/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainGenerateEstimateTypeCombobox
	 * @requires  BasicsLookupdataLookupDirectiveDefinition
	 * @description dropdown lookup grid to select the type project or wic
	 */

	angular.module(moduleName).directive('estimateMainGenerateEstimateTypeCombobox',[
		'$http', '$q', '$translate','BasicsLookupdataLookupDirectiveDefinition',
		function ($http, $q, $translate,BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'typeprojectorwic',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'b9e3ad5eb2994cb4ba2d4a33bd55b834',
				columns:[
					{ id: 'id', field: 'Description', name: 'Description', toolTip: 'Description', formatter: 'description',  name$tr$: 'cloud.common.entityDescription'}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: 'estimateMainTypeBoqProjectLookupDataService'
			});
		}]);
})(angular);

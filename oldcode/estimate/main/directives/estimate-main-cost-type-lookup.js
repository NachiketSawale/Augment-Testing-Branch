/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateMainColumnConfigType
	 * @requires BasicsLookupdataLookupDirectiveDefinition
	 * @description
	 */
	angular.module('estimate.main').directive('estimateMainCostType', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				version: 3,
				lookupType: 'estimateCostType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				uuid : 'c359050664f340a2830bf45d7238ccd9'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})();

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateWicGroupLookup', ['$q','BasicsLookupdataLookupDirectiveDefinition','boqWicGroupService',
		function ($q,BasicsLookupdataLookupDirectiveDefinition,boqWicGroupService) {
			let defaults = {
				lookupType: 'WicGroupFk',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '78D50B5378B64D03837875A132C10A4D'
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {

					getList: function () {
						return boqWicGroupService.getWicGroupList();
					},

					getItemByKey: function (value) {
						return $q.when(boqWicGroupService.getWicGroupItemById(value));
					},

					getItemByIdAsync: function (value) {
						return  $q.when(boqWicGroupService.getItemByIdAsync(value));
					},

					getSearchList: function () {
						return $q.when({});
					}
				}
			});
		}]);
})(angular);

/**
 * Created by waz on 3/6/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);

	module.factory('productionplanningCommonDocumentRevisionLayout', RevisionLayout);
	RevisionLayout.$inject = ['basicsLookupdataConfigGenerator', 'platformObjectHelper'];
	function RevisionLayout(basicsLookupdataConfigGenerator, platformObjectHelper) {
		var groups = [{
			gid: 'basic',
			attributes: ['description', 'originfilename', 'barcode', 'commenttext']
		}, {
			gid: 'version',
			attributes: ['revision']
		}, {
			gid: 'entityHistory',
			isHistory: true
		}];
		var overloads = {
			originfilename: {readonly: true},
			revision: {readonly: true}
		};
		var addition = {grid: platformObjectHelper.extendGrouping([])};

		return {
			fid: 'productionplanning.common.document.revision',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: groups,
			overloads: overloads,
			addition: addition
		};
	}
})(angular);
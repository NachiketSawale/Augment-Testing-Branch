/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).factory('basicsTextModulesHyperlinkLayout', basicsTextModulesHyperlinkLayout);

	basicsTextModulesHyperlinkLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function basicsTextModulesHyperlinkLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'basics.textmodules.hyperlink.detailform',
			'version': '1.0.0',
			'showGrouping': true,
			addValidationAutomatically: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['languagefk', 'descriptioninfo', 'url']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			overloads: {
				'languagefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.language', 'Description', {
					required: true,
					filterKey: 'basics-textmodules-hyperlink-language-filter'
				})
			}
		};
	}
})(angular);
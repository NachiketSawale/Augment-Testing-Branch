(function () {
	'use strict';

	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2ExternalLayout', Site2ExternalLayout);
	Site2ExternalLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function Site2ExternalLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'basics.site.site2ExternalLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['basexternalsourcefk', 'extcode', 'extdescription', 'commenttext', 'sorting', 'isdefault', 'productionrelease']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				basexternalsourcefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsource', 'Description')
			}
		};
	}
})();

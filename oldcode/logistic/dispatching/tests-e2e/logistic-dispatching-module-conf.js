(function () {
	'use strict';

	// --------------------------------------------------------
	// Logistic dispatching module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Dispatching',
		url: 'dispatching',
		internalName: 'logistic.dispatching',
		mainEntity: 'Dispatch Header',
		mainEntities: 'Dispatch Header',
		tile: 'logistic.dispatching',
		desktop: 'desktop',
		container: [{
			uid: 'ccd5c52d5e4d45b4aba1a3f53d1f6b6a',
			permission: 'ccd5c52d5e4d45b4aba1a3f53d1f6b6a',
			name: 'Dispatch Header',
			dependent: [{
					uid: '28414b3c79034bda912b932190054920',
					permission: 'ccd5c52d5e4d45b4aba1a3f53d1f6b6a',
					name: 'Dispatch Header Details',
					dependent: []
				},{
					uid: '2aba47e0b663449e8cd86d5e6258e417',
					permission: '2aba47e0b663449e8cd86d5e6258e417',
					name: 'Dispatch Records',
					dependent: [{
						uid: '029196d1c6e54602847114fa1f1ddccd',
						permission: '2aba47e0b663449e8cd86d5e6258e417',
						name: 'Dispatch Record Details',
						dependent: []
					},{
						uid: 'bf58f66d23ff4b04ba452aeff4d74a6b',
						permission: '2aba47e0b663449e8cd86d5e6258e417',
						name: 'Article Details',
						dependent: []
					}]
				},{
					uid: '8905e348c2d44a1fa31f1e69f380adec',
					permission: '8905e348c2d44a1fa31f1e69f380adec',
					name: 'Dispatch Documents',
					noCreateDelete: true,
					dependent: [{
						uid: '71571ef0220e480ca04797f054fde1f2',
						permission: '8905e348c2d44a1fa31f1e69f380adec',
						name: 'Dispatch Document Details',
						dependent: []
					}]
				},{
					uid: 'f68370052d6a4c0fbf47594012cd764c',
					permission: 'f68370052d6a4c0fbf47594012cd764c',
					name: 'Pinboard',
					dependent: []
				},{
					uid: '626f2e46f5a8436f8e94d6660fffa5e6',
					permission: '626f2e46f5a8436f8e94d6660fffa5e6',
					name: 'Characteristics',
					dependent: []
				},
				{
					uid: '8d60e6fa3fdc41a7aaa6ca81ab8b0fe4',
					permission: '8d60e6fa3fdc41a7aaa6ca81ab8b0fe4',
					name: 'Material Stock Source',
					dependent: []
				},{
					uid: '155bda0056214e40b0223f3e569cd71a',
					permission: '155bda0056214e40b0223f3e569cd71a',
					name: 'Plant Stock Source',
					dependent: []
				},{
					uid: 'c581784ef4234a629b1a6b0af272e416',
					permission: 'c581784ef4234a629b1a6b0af272e416',
					name: 'Linkages',
					dependent: [{
						uid: 'c69c924b42d24ad9a82e1c15e6d97f02',
						permission: 'c581784ef4234a629b1a6b0af272e416',
						name: 'Linkage Details',
						dependent: []
					}]
				},{
					uid: '4eaa47c530984b87853c6f2e4e4fc67e',
					permission: '4eaa47c530984b87853c6f2e4e4fc67e',
					name: 'Documents',
					dependent: [{
						uid: '8bb802cb31b84625a8848d370142b95c',
						permission: '4eaa47c530984b87853c6f2e4e4fc67e',
						name: 'Document Details',
						dependent: []
					}]
				},{
					uid: 'ca4314096bea4206a6423df7b0864c7a',
					permission: 'ca4314096bea4206a6423df7b0864c7a',
					name: 'Address Remark',
					dependent: []
				},{
					uid: 'b486266f86984782963b773b98fcad29',
					permission: 'b486266f86984782963b773b98fcad29',
					name: 'Job Card Source',
					dependent: []
				}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 1
	});
})();

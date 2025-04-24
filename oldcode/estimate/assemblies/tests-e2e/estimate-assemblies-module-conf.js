(function () {
	'use strict';
	// estimate-assemblies module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Estimate Assemblies',
		url: 'assemblies',
		internalName: 'estimate.assemblies',
		mainEntity: 'Assembly',
		mainEntities: 'Assemblies',
		tile: 'estimate.assemblies',
		desktop: 'desktopcfg',
		forceLoad: true,
		mainRecords: 10,
		container: [{
			name: 'Assemblies',
			uid: '234bb8c70fd9411299832dcce38ed118',
			dependent: [{
				name: 'Assembly Details',
				uid: 'b5c6ff9eab304beba4335d30700773da',
				permission: '234BB8C70FD9411299832DCCE38ED118',
				dependent: []
			}, {
				name: 'Assembly Resources',
				uid: 'a32ce3f29bd446e097bc818f71b1263d',
				noCreateDelete: true,
				dependent: [{
					name: 'Resource Details',
					uid: '8eb36f285d154864bba7da0574973c94',
					permission: 'A32CE3F29BD446E097BC818F71B1263D',
					dependent: []
				}]
			}, {
				name: 'Controlling Group Assignments',
				uid: '588be3ee73e94971a1c7a0bc7867c6bd',
				dependent: []
			}, {
				name: 'Characteristics',
				uid: '3ad1fb03bfb14342bac0401d73019dab',
				dependent: []
			}, {
				name: 'Characteristics2',
				uid: 'b7c8b98ac24c4565b296492ca9407ad6',
				dependent: []
			}, {
				name: 'Translation',
				uid: '45249f7155b24adfb8eb809f54131172',
				dependent: []
			}, {
				name: 'Cost Group 1',
				uid: 'fe19e77a2e1247ddb8abee9fcc2ffae1',
				dependent: []
			}, {
				name: 'Cost Group 2',
				uid: 'f0dcecd9bb844aa8a6b0b46f835358b1',
				dependent: []
			}, {
				name: 'Cost Group 3',
				uid: 'ec4a6816640d4e7c8125b3af3ed94eff',
				dependent: []
			}, {
				name: 'Cost Group 4',
				uid: '8cc959edf7eb40baacefd8d1318b7cb6',
				dependent: []
			}, {
				name: 'Cost Group 5',
				uid: '6172961971b74e76bfe2de726b3e08de',
				dependent: []
			}, {
				name: 'Totals',
				uid: '0dc8f53c3e9343c388c466ac1d2884a5',
				dependent: []
			}, {
				name: 'WIC',
				uid: '4dcc2ec321af4a6297fed83eeacf9f38',
				dependent: []
			}, {
				name: 'Estimate Rules',
				uid: '22860b73d4464e6abdf7fc9f7216a397',
				dependent: []
			}, {
				name: 'Assembly Categories',
				uid: '179d44d751834dabb06ef4ba1f425d3c',
				dependent: []
			}]
		}]
	});
})();

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Model',
		url: 'model',
		internalName: 'model.administration',
		mainEntity: 'Dummy',
		mainEntities: 'Dummies',
		tile: 'model-administration',
		desktop: 'desktopcfg',
		container: [{
			uid: 'a77d13ea33784bbcb9f21e9ed7fb3ff2',
			permission: 'a77d13ea33784bbcb9f21e9ed7fb3ff2',
			name: 'Static Highlighting Schemes',
			dependent: [{
				uid: '1aa62e964ad34df6a9eb71484a0188fb',
				permission: 'a77d13ea33784bbcb9f21e9ed7fb3ff2',
				name: 'Static Highlighting Scheme Details',
				dependent: []
			}, {
				uid: '325a35cc5b0c4c2184d3f5eb72c58f5a',
				permission: '325a35cc5b0c4c2184d3f5eb72c58f5a',
				name: 'Static Highlighting Items',
				dependent: [{
					uid: '61f6e953a2a046e89df4b252e7b4b988',
					permission: '325a35cc5b0c4c2184d3f5eb72c58f5a',
					name: 'Static Highlighting Item Details',
					dependent: []
				}, {
					uid: '70272edc6016496587b8ea84b20cf441',
					permission: '325a35cc5b0c4c2184d3f5eb72c58f5a',
					name: 'Filter State Info',
					dependent: []
				}]
			}]
		}, {
			uid: 'f7f839f32f4a47d8ab550a998421b17f',
			permission: 'f7f839f32f4a47d8ab550a998421b17f',
			name: 'Dynamic Highlighting Schemes',
			dependent: [{
				uid: '227e5eab5efe472086262160515c91bb',
				permission: 'f7f839f32f4a47d8ab550a998421b17f',
				name: 'Dynamic Highlighting Scheme Details',
				dependent: []
			}, {
				uid: 'ebd51626b3ff4f8689e1fed61bf6a49e',
				permission: 'ebd51626b3ff4f8689e1fed61bf6a49e',
				name: 'Dynamic Highlighting Items',
				dependent: [{
					uid: '18cc3cc979c24f7390607c9e45df177c',
					permission: 'ebd51626b3ff4f8689e1fed61bf6a49e',
					name: 'Dynamic Highlighting Item Details',
					dependent: []
				}]
			}]
		}, {
			uid: '373d22dca21440bda308ff6e85f81a85',
			permission: '373d22dca21440bda308ff6e85f81a85',
			name: 'Data Trees',
			dependent: [{
				uid: 'f04423524cb94bd1a76330c348f8e1b8',
				permission: '373d22dca21440bda308ff6e85f81a85',
				name: 'Data Tree Details',
				dependent: []
			}, {
				uid: 'f97ebbe0f8594fe686c78899cbb3c59b',
				permission: 'f97ebbe0f8594fe686c78899cbb3c59b',
				name: 'Data Tree Levels',
				dependent: [{
					uid: 'ff23c6d3aea74dbcbeb0e3122b368be1',
					permission: 'f97ebbe0f8594fe686c78899cbb3c59b',
					name: 'Data Tree Level Details',
					dependent: []
				}]
			}, {
				uid: 'beb34f7d5c704610870cba1be748cc34',
				permission: 'beb34f7d5c704610870cba1be748cc34',
				name: 'Data Tree Nodes',
				dependent: [{
					uid: '19a6a6b9816e49d99141986d8880fb39',
					permission: 'beb34f7d5c704610870cba1be748cc34',
					name: 'Data Tree Node Details',
					dependent: []
				}]
			}, {
				uid: '710cd16529f6429fa457d207481adc26',
				permission: '710cd16529f6429fa457d207481adc26',
				name: 'Data Tree 2 Model List',
				dependent: [{
					uid: '27d6e2162efc40208eb9cebda2deec00',
					permission: '710cd16529f6429fa457d207481adc26',
					name: 'Data Tree 2 Model Details',
					dependent: []
				}]
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();

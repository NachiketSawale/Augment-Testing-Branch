(function () {
	'use strict';

	// estimate-main module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Estimate',
		url: 'estimate',
		internalName: 'estimate.main',
		mainEntity: 'Line Item',
		mainEntities: 'Line Items',
		tile: 'estimate.main',
		desktop: 'desktop',
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 2,
		forcePinning: true,
		// TODO: organize dependent container
		container: [{
			name: 'Line Items',
			uid: '681223e37d524ce0b9bfa2294e18d650',
			dependent: [
				{
					name: 'Line Items Details',
					uid: 'e1956964883749dfa7cf4207d1eb3b50',
					permission: '681223e37d524ce0b9bfa2294e18d650',
					dependent: []
				}, {
					name: 'Resources',
					uid: 'bedd392f0e2a44c8a294df34b1f9ce44',
					permission: 'bedd392f0e2a44c8a294df34b1f9ce44',
					dependent: [{
						name: 'Resource Details',
						uid: '9ddb004429ab4d58a8e778eecaa877db',
						permission: 'bedd392f0e2a44c8a294df34b1f9ce44',
						dependent: []
					}, {
						name: 'Resource Characteristics',
						uid: '9201bfe4297c4eb9bdf2bbca7d798148',
						dependent: []
					}]
				}, {
					name: 'BoQs',
					uid: 'ecaf41be6cc045588297d5efb9745fe4',
					dependent: []
				}, {
					name: 'Wic',
					uid: '0198BF22D9A94B2BB6489E3E9A53C9EB',
					dependent: []
				}, {
					name: 'Activities',
					uid: 'f423a7daa8cd474385097af443f3c73f',
					dependent: []
				}, {
					name: 'Controlling Units',
					uid: '72e7c6850eec42e9aca9a0fd831cb7cc',
					dependent: []
				}, {
					name: 'Assembly Structure',
					uid: '75bbd8df20de4a3b8f132bdacbb203f6',
					dependent: []
				}, {
					name: 'Locations',
					uid: '1dd77e2e10b54f2392870a53fcb44982',
					dependent: []
				},{
					name: 'Cost Group',
					uid: '5f3dd493c4e145a49b54506af6da02ef',
					dependent: []
				}, {
					name: 'Cost Group 1',
					uid: 'b2a0c0db32f44342a689c1c8864b3fa4',
					dependent: []
				}, {
					name: 'Cost Group 2',
					uid: '1e2f913902724083b01a3b91f6f02e8e',
					dependent: []
				}, {
					name: 'Cost Group 3',
					uid: '9f121380981d47258dd065fd17d448c4',
					dependent: []
				}, {
					name: 'Cost Group 4',
					uid: '74ef9c44b27846e8890132b183f9aed1',
					dependent: []
				}, {
					name: 'Cost Group 5',
					uid: '935ad0ae6f2e45468b451503b77041c8',
					dependent: []
				}, {
					name: 'Project Cost Group 1',
					uid: '61a05151650c4bdbabd836d9448a4860',
					dependent: []
				}, {
					name: 'Project Cost Group 2',
					uid: '878bf7ed98424272af18225b1cd7e3d6',
					dependent: []
				}, {
					name: 'Project Cost Group 3',
					uid: '816a6634f9754f6196e58185fe4022f3',
					dependent: []
				}, {
					name: 'Project Cost Group 4',
					uid: '612af80b3dab41a092744dbcf86290fd',
					dependent: []
				}, {
					name: 'Project Cost Group 5',
					uid: '350521d2f20a499c8c35fd6122133e0d',
					dependent: []
				}, {
					name: 'Root Assignment',
					uid: '7925d8cdb20b4256a0808620c28d4666',
					dependent: []
				}, {
					name: 'Totals',
					uid: '07b7499a1f314f16a94edddc540c55d4',
					dependent: []
				}, {
					name: 'Procurement Structure',
					uid: '5bafbad1e3fe4bc2a7a114e27972795c',
					dependent: []
				}, {
					name: 'Rules',
					uid: 'c41abea3ef7741d083bfc34029e8a8f1',
					dependent: []
				}, {
					name: 'Rule Execution Output',
					uid: '8989297c1ce24515a2f81521bda937c7',
					dependent: []
				}, {
					name: '3D Viewer',
					uid: 'bb1fddaed89d46c2b674fe612e1321c3',
					permission: '7ac2a568c32e4a16a2b4106db572133d',
					dependent: []
				}, {
					name: '3D Viewer',
					uid: 'f76c791a7c874e0ea53dc395a1b5a3d1',
					permission: '9275c055a1e14f82a37831cd0f68c40f',
					dependent: []
				}, {
					name: '3D Viewer',
					uid: '726cdbd5379541ebaebce29f5b2a2499',
					permission: 'a272cac0ae67421eb9976bf6392f80a7',
					dependent: []
				}, {
					name: '3D Viewer',
					uid: '85ddf15bb095446a93aa1ff7feb77b99',
					permission: '097de59303a8453680bdc61d350365fd',
					dependent: []
				}, {
					name: 'Saved Camera Positions',
					uid: '8fe0f95ab4904222868c511759c3267b',
					permission: '17c46d111cd44732827332315ea206ed',
					dependent: []
				}, {
					name: 'Model Object Info List',
					uid: 'da5481eabd71482dbca12c4260eec5bf',
					noCreateDelete: true,
					permission: '36abc91df46f4129a78cc26fe79a6fdc',
					dependent: [{
						name: 'Model Object Info Details',
						uid: '086b1d0b9d4e4bc6a80ffddaa668ada7',
						permission: '36abc91df46f4129a78cc26fe79a6fdc',
						dependent: []
					}]
				}, {
					name: 'Simulation Cockpit',
					uid: '447c8cb06ac3490bbb87e744e4373cae',
					permission: 'a919c5302c1a4a8c975726f2466ca52d',
					dependent: []
				}, {
					name: 'Model Objects',
					uid: 'a08569edfec7481fa903fc29273d8df5',
					permission: '8b2b9def0459434eb95d412c9d031f01',
					dependent: []
				}, {
					name: 'Line Item Quantities',
					uid: '9cc2043da33141f78511adf92662cfb9',
					dependent: []
				}, {
					name: 'Characteristics',
					uid: 'e1b52e16cd0549f7b5707e3f0de534f4',
					dependent: []
				}, {
					name: 'Characteristics2',
					uid: 'e78e840150ce4a4b933d73772412e6eb',
					dependent: []
				}, {
					name: 'Line Items Structure',
					uid: '66788defaa8f43319b5122462e09c41d',
					permission: '681223e37d524ce0b9bfa2294e18d650',
					dependent: []
				}, {
					name: 'Related Assemblies',
					uid: '23572ca132f44b9e8269b39002c2908b',
					dependent: []
				}]
		}]
	});
})();

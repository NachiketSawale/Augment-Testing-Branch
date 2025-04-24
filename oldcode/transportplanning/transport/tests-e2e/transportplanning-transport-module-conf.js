(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Transport',
		url: 'transport',
		internalName: 'transportplanning.transport',
		mainEntity: 'TrsRoute',
		mainEntities: 'TrsRoutes',
		tile: 'transportPlanning.transport',
		desktop: 'desktop',
		container: [{
			uid: '1293102b4ee84cb5bd1b538fdf2ae90a',
			permission: 'a78a23e2b050418cb19df541ab9bf028',
			name: 'Transport List',
			dependent: [{
				uid: 'a967cd748f8f4f93a4651e791a4984cf',
				permission: 'a78a23e2b050418cb19df541ab9bf028',
				name: 'Transport Detail',
				dependent: []
			}, {
				uid: '2ce6d855a43844d595fe5c2ce8d86ae6',
				permission: 'bef5226c8c9d4ea381b2a53aaaa5e358',
				name: 'Transport Way Point List',
				dependent: [{
					uid: 'b4957d223f55496ebda1c8fa591c471b',
					permission: 'bef5226c8c9d4ea381b2a53aaaa5e358',
					name: 'Transport Way Point Detail',
					dependent: []
				}, {
					uid: '5d77c342bd2a409ea0f84bb8af3be6b4',
					permission: 'cec2f439b2d8488eb5f08002f517717a',
					name: 'Transport Way Point: Packages',
					dependent: []
				}, {
					uid: '0e94c5aa0e084a39bac50f6c6daea331',
					permission: 'a78a23e2b050418cb19df541ab9bf028',
					name: 'Transport Way Point: Job Document List',
					dependent: [{
						uid: 'd4ad106101ed4eb994c6856e615dfe8d',
						permission: 'a78a23e2b050418cb19df541ab9bf028',
						name: 'Transport Way Point: Job Document Delivery Address Blob',
						dependent: []
					}]
				}]
			}, {
				uid: 'b4b59a210d884d3cbdb527fc6a49f645',
				permission: 'cec2f439b2d8488eb5f08002f517717a',
				name: 'Transport Package List',
				dependent: [{
					uid: 'b26bc27d19844a9eb9b46a9eae1b287b',
					permission: 'cec2f439b2d8488eb5f08002f517717a',
					name: 'Transport Package Detail',
					dependent: []
				}]
			}, {
				uid: '201f7b76a0ba40da9e96fdb10f61a0a1',
				permission: '291a21ca7ab94d549d2d0c541ec09f5d',
				name: 'Transport: Resource Requisitions',
				dependent: []
			}, {
				uid: 'bfd8fd809c934a6ca78d97c3a51c6c57',
				permission: '6540965b6c84450aa1da41fd1c870a47',
				name: 'Transport: Resource Reservations',
				dependent: []
			}, {
				uid: '42ea007cf15e4b2f8d8e74498d316d7c',
				permission: 'a78a23e2b050418cb19df541ab9bf028',
				name: 'Transport: Dispatching Header List',
				dependent: []
			}, {
				uid: 'a64ce5da59d84a098c197ad602396e41',
				permission: 'a78a23e2b050418cb19df541ab9bf028',
				name: 'Site Filter',
				dependent: []
			}, {
				uid: '447732fc3d924f47a8f1ace405b78d5a',
				permission: 'a78a23e2b050418cb19df541ab9bf028',
				name: 'Generic Structure',
				dependent: []
			}, {
				uid: '0726d0faf8e14b1fbaff8a1fc38af771',
				permission: 'a78a23e2b050418cb19df541ab9bf028',
				name: 'Route Map',
				dependent: []
			}, {
				uid: '552d705ec56b40c8992eb2849f867f45',
				permission: '5640a72648e24f21bf3985624c4d0fdf',
				name: 'Route: Document List',
				dependent: [{
					uid: '24cf0e6bebb248d69233870d913fe9b8',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Route: Document Revision List',
					dependent: []
				}]
			}, {
				uid: '1ea969134456457cbda5965b9790cd5a',
				permission: 'a78a23e2b050418cb19df541ab9bf028',
				name: 'Job Document List',
				dependent: [{
					uid: '5582628160474a2396746ebc60d151f9',
					permission: 'a78a23e2b050418cb19df541ab9bf028',
					name: 'Job Delivery Address Blob',
					dependent: []
				}]
			}, {
				uid: 'f6abcc756e894f7caa87a5f239468b8a',
				permission: 'f6abcc756e894f7caa87a5f239468b8a',
				name: 'Translate',
				dependent: []
			}, {
				uid: '7ba2304725f04d6e968cee3e55fcd8fc',
				permission: '6540965b6c84450aa1da41fd1c870a47',
				name: 'Planning Board',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 0
	});
})();

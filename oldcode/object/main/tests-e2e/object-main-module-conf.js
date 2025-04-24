(function () {
	'use strict';

	// --------------------------------------------------------
	// Object main module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Main',
		url: 'main',
		internalName: 'object.main',
		mainEntity: 'Object-Unit',
		mainEntities: 'Object-Units',
		tile: 'object.main',
		desktop: 'desktop',
		forceLoad: true,
		sidebarFilter: 'E2E-',
		forcePinning: true,
		mainRecords: 2,
		container: [{
			uid: 'f863261368cb4f2c90224df8b9847afe',
			permission: 'f863261368cb4f2c90224df8b9847afe',
			name: 'Object Units',
			dependent: [
				{
					uid: '3d333462cfc848cb95e79b82e718101a',
					permission: 'f863261368cb4f2c90224df8b9847afe',
					name: 'Object Unit Details',
					dependent: []
				},
				{
					uid: '283a88b5a04a423d938180b0774c3040',
					permission: '283a88b5a04a423d938180b0774c3040',
					name: 'Object Unit Areas',
					dependent: [{
						uid: '1f1e8da2c5a54d4e83ba29cadf13fcd2',
						permission: '283a88b5a04a423d938180b0774c3040',
						name: 'Object Unit Area Details',
						dependent: []
					}]
				},
				{
					uid: 'f288176f4614422f95e33d79dee8dba5',
					permission: 'f288176f4614422f95e33d79dee8dba5',
					name: 'Object Unit Prices',
					dependent: [{
						uid: 'f73af0eec7524ed7824884e67b003c7f',
						permission: 'f288176f4614422f95e33d79dee8dba5',
						name: 'Object Unit Price Details',
						dependent: []
					}]
				},
				{
					uid: '0fe9e5cff36745768670d19df28dfe9f',
					permission: '0fe9e5cff36745768670d19df28dfe9f',
					name: 'Document',
					noCreateDelete: true,
					dependent: [{
						uid: '916d6a951ca640808cfe0b80d634b20b',
						permission: '0fe9e5cff36745768670d19df28dfe9f',
						name: 'Document Details',
						dependent: []
					}]
				},
				{
					uid: 'f86f7eb6dfc54753875ab41db67797d4',
					permission: 'e175af97563843b9925adcd0b60e8d3b',
					name: 'Photo View',
					dependent: []
				},
				{
					uid: '98e77e63a57443f096284f2ee00e8f66',
					permission: '98e77e63a57443f096284f2ee00e8f66',
					name: 'Prospects',
					dependent: [{
						uid: '3ed83dc6e18f4565855eff19902418fb',
						permission: '98e77e63a57443f096284f2ee00e8f66',
						name: 'Prospect Details',
						dependent: []
					}, {
						uid: '5ce1540a85eb4de0b13ddbd7b7ab09cf',
						permission: '5ce1540a85eb4de0b13ddbd7b7ab09cf',
						name: 'Prospect Activities',
						dependent: [{
							uid: '3c4e746e02154eca9f1e8f8fc832d702',
							permission: '5ce1540a85eb4de0b13ddbd7b7ab09cf',
							name: 'Prospect Activity Details',
							dependent: []
						}]
					}, {
						uid: '47c8300404b9436282791d79db6d9cb6',
						permission: '47c8300404b9436282791d79db6d9cb6',
						name: 'Prospect Changes',
						dependent: [{
							uid: 'de707626032f4bd3bc6e6edeee75dccc',
							permission: '47c8300404b9436282791d79db6d9cb6',
							name: 'Prospect Change Details',
							dependent: []
						}]
					}, {
						uid: '2bdfd213a302401c88fbff8bc80df3c5',
						permission: '2bdfd213a302401c88fbff8bc80df3c5',
						name: 'Prospect Documents',
						noCreateDelete: true,
						dependent: [{
							uid: '7c50d259385e4567afad3544e9047df4',
							permission: '2bdfd213a302401c88fbff8bc80df3c5',
							name: 'Prospect Document Details',
							dependent: []
						}]
					}]
				},
				{
					uid: 'e175af97563843b9925adcd0b60e8d3b',
					permission: 'e175af97563843b9925adcd0b60e8d3b',
					name: 'Object Unit Photos',
					noCreateDelete: true,
					dependent: [{
						uid: '42e90f3cbc2f41afb9d46268d11a3bbe',
						permission: 'e175af97563843b9925adcd0b60e8d3b',
						name: 'Object Unit Photo Details',
						dependent: []
					}]
				},
				{
					uid: '687b0fd5315f47e8a109715375f2596a',
					permission: '687b0fd5315f47e8a109715375f2596a',
					name: 'Unit to Object Units',
					dependent: [{
						uid: 'c05eef6a46bf479391bd129480faf3de',
						permission: '687b0fd5315f47e8a109715375f2596a',
						name: 'Unit to Object Unit Details',
						dependent: []
					}]
				},
				{
					uid: '2bb446f7ffa94d679d8ea9e7005d6431',
					permission: '2bb446f7ffa94d679d8ea9e7005d6431',
					name: 'Meter Type Reading Titles',
					dependent: [{
						uid: 'fe7f54b726f442488eec07c925cf152f',
						permission: '2bb446f7ffa94d679d8ea9e7005d6431',
						name: 'Meter Type Reading Titles',
						dependent: []
					}]
				},
				{
					uid: 'c42358caed2a40c1966c3f9988448a24',
					permission: 'c42358caed2a40c1966c3f9988448a24',
					name: 'Characteristics',
					dependent: []
				},
				{
					uid: '4EAA47C530984B87853C6F2E4E4FC67E',
					permission: '4EAA47C530984B87853C6F2E4E4FC67E',
					name: 'Documents Project',
					dependent: []
				}]
		}]
	});
})();

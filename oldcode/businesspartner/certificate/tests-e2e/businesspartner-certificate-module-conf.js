(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,module,require */

	// --------------------------------------------------------
	// Basics bank module configuration
	const iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Evaluation Schema',
		url: 'certificate',
		internalName: 'businesspartner.certificate',
		mainEntity: 'Certificate',
		mainEntities: 'Certificates',
		tile: 'businesspartner-certificate',
		desktop: 'desktop',
		container: [{
			uid: '2c39331cf48c4016af9d17a573388100',
			permission: '2c39331cf48c4016af9d17a573388100',
			name: 'Certificates',
			dependent: [{
				uid: 'fb49ad44d3c3497a8ef693026933fbff',
				permission: '2c39331cf48c4016af9d17a573388100',
				name: 'Certificate Details',
				dependent: []
			}, {
				uid: '1b11c041c2e54c87b7be08ebf066089c',
				permission: '1B11C041C2E54C87B7BE08EBF066089C',
				name: 'Certificate Reminders',
				dependent: [{
					uid: '78373adc2a214ab2b3c9564317dcd36b',
					permission: '1B11C041C2E54C87B7BE08EBF066089C',
					name: 'Certificate Reminder Details',
					dependent: []
				}]
			}, {
				uid: '5fb79d9928d244f7b012c3f92441da95',
				permission: '5FB79D9928D244F7B012C3F92441DA95',
				name: 'Characteristics',
				dependent: []
			}, {
				uid: '4eaa47c530984b87853c6f2e4e4fc67e',
				permission: '4EAA47C530984B87853C6F2E4E4FC67E',
				name: 'Project Documents',
				dependent: [{
					uid: '8bb802cb31b84625a8848d370142b95c',
					permission: '4EAA47C530984B87853C6F2E4E4FC67E',
					name: 'Project Documents Details',
					dependent: []
				}, {
					uid: '684f4cdc782b495e9e4be8e4a303d693',
					permission: '684F4CDC782B495E9E4BE8E4A303D693',
					name: 'Project Document Revisions',
					dependent: [{
						uid: 'd8be3b30fed64aab809b5dc7170e6219',
						permission: '684F4CDC782B495E9E4BE8E4A303D693',
						name: 'Project Document Revision Details',
						dependent: []
					}]
				}]
			}, {
				uid: 'b2167043a37a4512944edaa52986a6c3',
				permission: 'b2167043a37a4512944edaa52986a6c3',
				name: 'Pin Board',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 5
	});
})();

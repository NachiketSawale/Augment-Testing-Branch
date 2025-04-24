(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,require,module */

	// --------------------------------------------------------
	// Basics bank module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Business Partner',
		url: 'businesspartner',
		internalName: 'businesspartner.main',
		mainEntity: 'Business Partner',
		mainEntities: 'Business Partners',
		tile: 'businesspartner-main',
		desktop: 'desktop',
		container: [{
			uid: '75dcd826c28746bf9b8bbbf80a1168e8',
			permission: '75dcd826c28746bf9b8bbbf80a1168e8',
			name: 'Business Partners',
			dependent: [{
				uid: '411d27cfbb0b4643a368b19fa95d1b40',
				permission: '75dcd826c28746bf9b8bbbf80a1168e8',
				name: 'Business Partner Details',
				dependent: []
			}, {
				uid: '4f864faad8094b4c97b3e1edb28d21f8',
				permission: '4f864faad8094b4c97b3e1edb28d21f8',
				name: 'Characteristics',
				dependent: []
			}, {
				uid: '4eaa47c530984b87853c6f2e4e4fc67e',
				permission: '4EAA47C530984B87853C6F2E4E4FC67E',
				name: 'Documents Project',
				dependent: [{
					uid: '8bb802cb31b84625a8848d370142b95c',
					permission: '4EAA47C530984B87853C6F2E4E4FC67E',
					name: 'Document Project Details',
					dependent: []
				}, {
					uid: '684f4cdc782b495e9e4be8e4a303d693',
					permission: '684F4CDC782B495E9E4BE8E4A303D693',
					name: 'Documents Revision',
					dependent: [{
						uid: 'd8be3b30fed64aab809b5dc7170e6219',
						permission: '684F4CDC782B495E9E4BE8E4A303D693',
						name: 'Document Revision Details',
						dependent: []
					}]
				}]
			}, {
				uid: '0651027c87ac4b499dd09fcb14cf84f5',
				permission: '0651027C87AC4B499DD09FCB14CF84F5',
				name: 'Pin Board',
				dependent: []
			},
			{
				uid: 'bae2a04908044b118585a58af96390d5',
				permission: 'BAE2A04908044B118585A58AF96390D5',
				name: 'Private Comment',
				dependent: []
			}, {
				uid: '9299c9b28b41432dac41fee1d53eb868',
				permission: '2c39331cf48c4016af9d17a573388100',
				name: 'Actual Certificates',
				dependent: [{
					uid: 'eb367ee13d5844d8b9092fefc65e3b17',
					permission: '2c39331cf48c4016af9d17a573388100',
					name: 'Actual Certificate Detail',
					dependent: []
				}, {
					uid: 'dc43044581c047268996e6214ef5860e',
					permission: 'b2167043a37a4512944edaa52986a6c3',
					name: 'Certificate Pin Board',
					dependent: []
				}]
			}, {
				uid: 'c87f45d900e640768a08d471bd476b2c',
				permission: 'C87F45D900E640768A08D471BD476B2C',
				name: 'Activities',
				dependent: [{
					uid: 'b47a6a7bb5c7964d3acb4e6a8ff4dafb',
					permission: 'C87F45D900E640768A08D471BD476B2C',
					name: 'Activity Detail',
					dependent: []
				}]
			}, {
				uid: '9c8641a6e04b406d8481fb404ee7d85e',
				permission: '9c8641a6e04b406d8481fb404ee7d85e',
				name: 'Agreements',
				dependent: [{
					uid: '20616D61A4A048029721C68BEBD8F64C',
					permission: '9c8641a6e04b406d8481fb404ee7d85e',
					name: 'Agreement Detail',
					dependent: []
				}]
			}, {
				uid: '44bd90285b354396a90efb0f8466c0c9',
				permission: '44BD90285B354396A90EFB0F8466C0C9',
				name: 'Banks',
				dependent: [{
					uid: 'a484373668e242cd8e6f220874c4f533',
					permission: '44BD90285B354396A90EFB0F8466C0C9',
					name: 'Bank Detail',
					dependent: []
				}]
			}, {
				uid: '72a2227e86964a35a4072dc3fda7b45a',
				permission: '72a2227e86964a35a4072dc3fda7b45a',
				name: 'Business Partner to External',
				noCreateDelete: true,
				dependent: [{
					uid: '489a6f1ecc1b406e842466e0a0fc9920',
					permission: '72a2227e86964a35a4072dc3fda7b45a',
					name: 'Business Partner to External Detail',
					dependent: []
				}]
			}, {
				uid: '5e83dc4be236407e94844a77dbd33010',
				permission: '5E83DC4BE236407E94844A77DBD33010',
				name: 'Businesspartner Form Data',
				dependent: []
			}, {
				uid: '1a3e4d47049242e58f149208e9732d8f',
				permission: '1a3e4d47049242e58f149208e9732d8f',
				name: 'Business Partner Clerk',
				dependent: [{
					uid: '24178473693143239dbbffe71d098496',
					permission: '1a3e4d47049242e58f149208e9732d8f',
					name: 'Business Partner Clerk Detail',
					dependent: []
				}]
			}, {
				uid: '12394ae7fb944ba1b1006bd13864149a',
				permission: '12394ae7fb944ba1b1006bd13864149a',
				name: 'Business Partner Relation',
				dependent: [{
					uid: 'a2v6eq1f6dj84fd8br6j25e6c3a43vug',
					permission: '12394ae7fb944ba1b1006bd13864149a',
					name: 'Business Partner Relation Detail',
					dependent: []
				}]
			}, {
				uid: '11dd248f6db045029ba634baa501faad',
				permission: '12394ae7fb944ba1b1006bd13864149a',
				name: 'Business Partner Relation Chart',
				dependent: []
			}, {
				uid: 'e48c866c714440f08a1047977e84481f',
				permission: 'E48C866C714440F08A1047977E84481F',
				name: 'Subsidiaries',
				dependent: [{
					uid: '79d7f116fe29482687375a6afa9149fe',
					permission: 'E48C866C714440F08A1047977E84481F',
					name: 'Subsidiary Detail',
					dependent: []
				}]
			}, {
				uid: '72f38c9d2f4b429bae5f70da33068ae3',
				permission: '73b6280b180149a09f3a97f142bfc3dc',
				name: 'Contacts',
				dependent: [{
					uid: '2bea71e2f2bf42eaa0ea2fc60f8f5615',
					permission: '73b6280b180149a09f3a97f142bfc3dc',
					name: 'Contact Detail',
					dependent: []
				}, {
					uid: '3d4ec8d837f049eda2e7d92e051d9351',
					permission: '3d4ec8d837f049eda2e7d92e051d9351',
					name: 'Contact Photo',
					dependent: []
				}, {
					uid: '791481C3C29D4E7CA10030977895FF83',
					permission: '791481c3c29d4e7ca10030977895ff83',
					name: 'Contact Form Data',
					dependent: []
				}, {
					uid: 'a072433d39d6459f8ffae73e4ec7026f',
					permission: 'a072433d39d6459f8ffae73e4ec7026f',
					name: 'Contact Characteristics',
					dependent: []
				}, {
					uid: 'cae393de7edc4d67b528e3ed8f5d90f3',
					permission: '75af61c378494d838df091d217d8eb30',
					name: 'Contact Clerk',
					dependent: [{
						uid: 'ac7e9c5ab92b46189fca366e4b818b88',
						permission: '75af61c378494d838df091d217d8eb30',
						name: 'Contact Clerk Detail',
						dependent: []
					}]
				}, {
					uid: '9e634079a9e343e3b370b9383245cdd3',
					permission: 'fb458f707ab341888cba09af594078d4',
					name: 'Contact Private Comment',
					dependent: []
				}, {
					uid: 'ba8741962e974470a7c3e9d49b8a156d',
					permission: 'eda4fc727cfd4d23a0c0118a01a57d83',
					name: 'Synchronize Contacts to Exchange Server',
					dependent: []
				}]
			}, {
				uid: '7f5057a88b974acd9fb5a00cee60a33d',
				permission: '7F5057A88B974ACD9FB5A00CEE60A33D',
				name: 'Suppliers',
				dependent: [{
					uid: '23f48d0283624c7bb3d5b57339d5f038',
					permission: '7F5057A88B974ACD9FB5A00CEE60A33D',
					name: 'Supplier Detail',
					dependent: []
				}]
			}, {
				uid: '53aa731b7da144cdbff201a7df205016',
				permission: '53AA731B7DA144CDBFF201A7DF205016',
				name: 'Customer',
				dependent: [{
					uid: 'cb4e664d3a796afa8fb47a5cd74bbafb',
					permission: '53AA731B7DA144CDBFF201A7DF205016',
					name: 'Customer Detail',
					dependent: []
				}]
			}, {
				uid: 'b3a462afc69040048f267a15244aadb8',
				permission: 'B3A462AFC69040048F267A15244AADB8',
				name: 'Customer Satisfaction',
				dependent: []
			}, {
				uid: '953895e120714ab4b6d7283c2fc50e14',
				permission: '953895e120714ab4b6d7283c2fc50e14',
				name: 'Evaluation',
				dependent: []
			}, {
				uid: 'ddf49471e5944a5f8b8de31c9715375e',
				permission: 'ddf49471e5944a5f8b8de31c9715375e',
				name: 'Guarantors',
				dependent: [{
					uid: '81579d8e9d0648769a118c2840e1fe8a',
					permission: 'ddf49471e5944a5f8b8de31c9715375e',
					name: 'Guarantor Detail',
					dependent: []
				}]
			}, {
				uid: 'd08cf732ad23451aafed4078ca389619',
				permission: 'D08CF732AD23451AAFED4078CA389619',
				name: 'Marketing',
				dependent: []
			}, {
				uid: '72121ad6a4774cbea673753606fb19d2',
				permission: '72121AD6A4774CBEA673753606FB19D2',
				name: 'Objects of Customer',
				dependent: [{
					uid: 'cdc1a6ecee8946079c1cccb1215b931b',
					permission: '72121AD6A4774CBEA673753606FB19D2',
					name: 'Object of Customer Detail',
					dependent: []
				}]
			}, {
				uid: '77964d3aa8fb47a6af4bbcb4e65cdafb',
				permission: '77964D3AA8FB47A6AF4BBCB4E65CDAFB',
				name: 'Procurement Structure',
				dependent: []
			}, {
				uid: '39984583e79c449aa1d9c764222233a5',
				permission: '39984583E79C449AA1D9C764222233A5',
				name: 'Remark1',
				dependent: []
			}, {
				uid: '6c99da89e843470c82be35c7046a5e9a',
				permission: '6C99DA89E843470C82BE35C7046A5E9A',
				name: 'Remark2',
				dependent: []
			}, {
				uid: '1e2ac147d54f452abc4fb6ad6bc62bed',
				permission: '1E2AC147D54F452ABC4FB6AD6BC62BED',
				name: 'Registered for Company',
				dependent: [{
					uid: 'f7a6a2b30bc776ea84b4964dfbe65cda',
					permission: '1e2ac147d54f452abc4fb6ad6bc62bed',
					name: 'Registered for Company Detail',
					dependent: []
				}]
			}, {
				uid: 'c81d6b2b37d44ea1a328a9ca245b6a1c',
				permission: 'C81D6B2B37D44EA1A328A9CA245B6A1C',
				name: 'Reference Images',
				dependent: []
			}, {
				uid: '7c29553fdae541dda903d4707d0c8df3',
				permission: '7C29553FDAE541DDA903D4707D0C8DF3',
				name: 'Update Requests',
				dependent: []
			}
			]
		}],
		forceLoad: true,
		mainRecords: 5
	});
})();
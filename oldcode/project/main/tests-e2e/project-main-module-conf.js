(function() {
	'use strict';

	// --------------------------------------------------------
	// Project main module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Project',
		url: 'project',
		internalName: 'project.main',
		mainEntity: 'Project',
		mainEntities: 'Projects',
		tile: 'project.main',
		desktop: 'desktop',
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 4,
		container: [{
			name: 'Projects',
			uid: '713b7d2a532b43948197621ba89ad67a',
			permission: '713B7D2A532B43948197621BA89AD67A',
			dependent: [
				{
					uid: 'e33fc83676e9439a959e4d8c2f4435b6',
					name: 'Project Details',
					permission: '713B7D2A532B43948197621BA89AD67A',
					dependent: []
				},
				{
					uid: '6cc22ab7897d4b0f8a96f4c5978eaa59',
					name: 'Remarks',
					permission: '6CC22AB7897D4B0F8A96F4C5978EAA59',
					dependent: []
				},
				{
					uid: '7447b8df191c45118f56dd84d25d1b41',
					name: 'Schedules',
					permission: '7447B8DF191C45118F56DD84D25D1B41',
					dependent: [{
						uid: '7f2c6c99acb84ba8b1d455c2acf93050',
						name: 'Schedule Details',
						permission: '7447B8DF191C45118F56DD84D25D1B41',
						dependent: []
					},
						{
						uid: 'd11b8a235a8646b4af9c7d317f192973',
						name: 'Timelines',
						permission: 'D11B8A235A8646B4AF9C7D317F192973',
						dependent: [{
							uid: '6681a59396f24d02a4beab2fff3c735f',
							name: 'Timeline Details',
							permission: 'D11B8A235A8646B4AF9C7D317F192973',
							dependent: []
						}]
					},
						{
							uid: '468be38b0d104ee58361b7e4395ac82d',
							name: 'scheduling.schedule.scheduleClerkListTitle',
							permission: '468be38b0d104ee58361b7e4395ac82d',
							dependent: [{
								uid: '9dba09dfec334213bc8cb59ef42ffc27',
								name: 'scheduling.schedule.scheduleClerkDetailTitle',
								permission: '468be38b0d104ee58361b7e4395ac82d',
								dependent: []
							}]
						}
					]
				},
				{
					uid: '42ff27d7f0ea40eaba389d669be3a1df',
					name: 'Locations',
					permission: '42FF27D7F0EA40EABA389D669BE3A1DF',
					dependent: [{
						uid: '33761e17bfb84451bd226bf2882bc11d',
						name: 'Location Details',
						permission: '42FF27D7F0EA40EABA389D669BE3A1DF',
						dependent: []
					}]
				},
				{
					uid: '975aec379e4e4b02be76ccb7a0059f65',
					name: 'Clerks',
					permission: '975AEC379E4E4B02BE76CCB7A0059F65',
					dependent: [{
						uid: '190febd3204840f58f5d6398705744f9',
						name: 'Clerk Details',
						permission: '975AEC379E4E4B02BE76CCB7A0059F65',
						dependent: []
					}]
				},
				{
					uid: '038bd9f8e0114c3e8c14940baa458935',
					name: 'Project 2 Companies',
					permission: '713B7D2A532B43948197621BA89AD67A',
					dependent: []
				},
				{
					uid: 'a701b3a3e03b44f2bc3b12f316997e7f',
					name: 'Cost Group 1 List',
					permission: 'A701B3A3E03B44F2BC3B12F316997E7F',
					dependent: [{
						uid: 'e3751bcff88e4c46a4bac242b1ece565',
						name: 'Cost Group 1 Details',
						permission: 'A701B3A3E03B44F2BC3B12F316997E7F',
						dependent: []
					}]
				},
				{
					uid: 'b0cb0cd176744a9b85b0285a847acd08',
					name: 'Cost Group 2 List',
					permission: 'B0CB0CD176744A9B85B0285A847ACD08',
					dependent: [{
						uid: '7048c5e2acd44017a2675fff4a505acb',
						name: 'Cost Group 2 Details',
						permission: 'B0CB0CD176744A9B85B0285A847ACD08',
						dependent: []
					}]
				},
				{
					uid: 'fe0fc48a539748cb90838606bdb4b0c0',
					name: 'Cost Group 3 List',
					permission: 'FE0FC48A539748CB90838606BDB4B0C0',
					dependent: [{
						uid: 'b81aeed81ce04524abb1a0c880f924c6',
						name: 'Cost Group 3 Details',
						permission: 'FE0FC48A539748CB90838606BDB4B0C0',
						dependent: []
					}]
				},
				{
					uid: 'bf398a70b5494f3ba3b2d9ef9559ffb4',
					name: 'Cost Group 4 List',
					permission: 'BF398A70B5494F3BA3B2D9EF9559FFB4',
					dependent: [{
						uid: '606e357e8d4b42f5af9641cfb6d0d603',
						name: 'Cost Group 4 Details',
						permission: 'BF398A70B5494F3BA3B2D9EF9559FFB4',
						dependent: []
					}]
				},
				{
					uid: '68665414146a46e28ca23502012087fe',
					name: 'Cost Group 5 List',
					permission: '68665414146A46E28CA23502012087FE',
					dependent: [{
						uid: '0502c84733c54922beda8bde5c3c0522',
						name: 'Cost Group 5 Details',
						permission: '68665414146A46E28CA23502012087FE',
						dependent: []
					}]
				},
				{
					uid: '6937c94aa27a405ead0dcb703133e03f',
					name: 'Changes',
					permission: 'f86aa473785b4625adcabc18dfde57ac',
					dependent: [{
						uid: 'e1405bbc35214477b518d2639af5b2ed',
						name: 'Change Details',
						permission: 'f86aa473785b4625adcabc18dfde57ac',
						dependent: []
					}]
				},
				{
					uid: 'b499f098a24511e489d3123b93f75cba',
					name: 'User Form',
					permission: 'b499f098a24511e489d3123b93f75cba',
					dependent: []
				},
				{
					uid: '463c61ded9ae494aa02850dba570234f',
					name: 'Exchange Rates',
					permission: '463C61DED9AE494AA02850DBA570234F',
					dependent: []
				},
				{
					uid: 'ae98a15a959e48b89770125ca714de4c',
					name: 'Characteristics',
					permission: 'ae98a15a959e48b89770125ca714de4c',
					dependent: []
				},
				{
					uid: 'ac4a13a8f33540ed80d0d9f67983fa01',
					name: 'BoQs',
					permission: 'ac4a13a8f33540ed80d0d9f67983fa01',
					dependent: []
				},
				{
					uid: 'ce87d35899f34e809cad2930093d86b5',
					name: 'Estimates',
					permission: 'ce87d35899f34e809cad2930093d86b5',
					dependent: []
				},
				{
					uid: 'ebb7b20bd41047179d2fa0610423c1b1',
					name: 'Cost Codes',
					noCreateDelete: true,
					permission: 'EBB7B20BD41047179D2FA0610423C1B1',
					dependent: [{
						uid: '01970505be4b428288ee23567deeed58',
						name: 'Cost Code Details',
						permission: 'EBB7B20BD41047179D2FA0610423C1B1',
						dependent: []
					}]
				},
				{
					uid: '130eb724690c429aa4e359ed0c53115b',
					name: 'project.main.addressList',
					permission: '130eb724690c429aa4e359ed0c53115b',
					dependent: [{
						uid: 'caa64e99b7d449bd981e798331c458f9',
						name: 'project.main.addressDetail',
						permission: '130eb724690c429aa4e359ed0c53115b',
						dependent: []
				}]
				},

				{
					uid: '183c55b9f3e7482298098e2346b2de84',
					name: 'project.main.estimateCharacteristics',
					permission: '183c55b9f3e7482298098e2346b2de84',
					dependent: []
				},
				{
					uid: 'b278decd9b204e2fbcb61b4952e194e5',
					name: 'project.main.estimateFormData',
					permission: 'b278decd9b204e2fbcb61b4952e194e5',
					dependent: []
				},
				{
					uid: '17947c4e6d894d7792e79f18848fc3f8',
					name: 'productionplanning.engineering.headerListTitle',
					permission: '17947c4e6d894d7792e79f18848fc3f8',
					dependent: []
				},
				{
					uid: 'abfa68a6d1a34097ab6f87a57b0e97cf',
					name: 'productionplanning.engineering.headerDetailTitle',
					permission: 'abfa68a6d1a34097ab6f87a57b0e97cf',
					dependent: []
				},
				{
					uid: 'f3044885941741b8a9c0c8eea34fb647',
					name: 'constructionsystem.project.instanceHeaderGridContainerTitle',
					permission: 'f3044885941741b8a9c0c8eea34fb647',
					dependent: []
				},
				{
					uid: 'e755a4d373c44fb7a19339d238685dac',
					name: 'project.main.entityKeyFigureList',
					permission: 'e755a4d373c44fb7a19339d238685dac',
					dependent: []
				},
				{
					uid: '1b83b76fac8b4ae782be99455b47fe54',
					name: 'Translation',
					permission: '1B83B76FAC8B4AE782BE99455B47FE54',
					dependent: []
				},
				{
					uid: '486bac686fa942449b4effcb8b2de308',
					name: 'Materials',
					noCreateDelete: true,
					permission: '486bac686fa942449b4effcb8b2de308',
					dependent: [{
						uid: '9b3839487a6445cdb63d307dbf9de780',
						name: 'Material Details',
						permission: '486bac686fa942449b4effcb8b2de308',
						dependent: []
					}]
				},
				{
					uid: '8d00d49507ea490f8f256518e84a98e8',
					name: 'Generals',
					permission: '8d00d49507ea490f8f256518e84a98e8',
					dependent: [{
						uid: '82366961458345aa8113ed3c2fcddc1d',
						name: 'General Details',
						permission: '8d00d49507ea490f8f256518e84a98e8',
						dependent: []
					}]
				},
				{
					uid: 'd161af4bc60047cc8961e186f889863a',
					name: 'Tender Result',
					permission: 'd161af4bc60047cc8961e186f889863a',
					dependent: [{
						uid: '3dd9fa3c5742468db296da347a7f1c31',
						name: 'Tender Result Details',
						permission: 'd161af4bc60047cc8961e186f889863a',
						dependent: []
					}]
				},
				{
					uid: 'c1dc179e9bea402abff0f5f6da4557b2',
					name: 'Project Comment',
					permission: 'C1DC179E9BEA402ABFF0F5F6DA4557B2',
					dependent: []
				},
				{
					uid: 'e3c65c3d3ce44c9e83cfa4b8a00e273e',
					name: 'Pinboard for Tender Result',
					permission: 'E3C65C3D3CE44C9E83CFA4B8A00E273E',
					dependent: []
				},
				{
					uid: 'b15a05e067094d3988f4626281c88e24',
					name: 'Business Partner',
					permission: 'B15A05E067094D3988F4626281C88E24',
					dependent: [{
						uid: 'a47736265c1242348d032a55de80aa99',
						name: 'Business Partner Details',
						permission: 'B15A05E067094D3988F4626281C88E24',
						dependent: []
					},
						{
							uid: '09b099cdd4bf4aafb4bc7d28dd8bf1c9',
							name: 'Business Partner Contacts',
							permission: '09B099CDD4BF4AAFB4BC7D28DD8BF1C9',
							dependent: [{
								uid: 'b2cdec2972234462804b1aca15e00330',
								name: 'Business Partner Contact Details',
								permission: '09B099CDD4BF4AAFB4BC7D28DD8BF1C9',
								dependent: []
							}]
						}]
				},
				{
					uid: '011b0cf9e74e4e5094995de0ec1e9217',
					name: 'Sales',
					permission: '011b0cf9e74e4e5094995de0ec1e9217',
					dependent: [{
						uid: 'b85c94bf5b2a4496bd7e2cd7312b9104',
						name: 'Sale Details',
						permission: '011b0cf9e74e4e5094995de0ec1e9217',
						dependent: []
					}]
				},
				{
					uid: '96e96054b48c4f82aed3f9140611b010',
					name: 'Bids',
					noCreateDelete: true,
					permission: '96E96054B48C4F82AED3F9140611B010',
					dependent: [{
						uid: 'fdf2e64888f544ec8310359384e823c6',
						name: 'Bid Details',
						permission: '96E96054B48C4F82AED3F9140611B010',
						dependent: []
					}]
				},
				{
					uid: 'f28370473e8648498fc471fb88d7baac',
					name: 'Contracts',
					noCreateDelete: true,
					permission: 'F28370473E8648498FC471FB88D7BAAC',
					dependent: [{
						uid: '00b327a345274e5a8b57b02db5fcaab7',
						name: 'Contract Details',
						permission: 'F28370473E8648498FC471FB88D7BAAC',
						dependent: []
					}]
				},
				{
					uid: '4b0d79fffce24775b00d8ccd88e489de',
					name: 'Bills',
					noCreateDelete: true,
					permission: '4B0D79FFFCE24775B00D8CCD88E489DE',
					dependent: [{
						uid: 'c49bd5baa6454b0e80d3985c93789eb4',
						name: 'Bill Details',
						permission: '4B0D79FFFCE24775B00D8CCD88E489DE',
						dependent: []
					}]
				},
				{
					uid: 'e462bc1e81f648039cb506b9fcf70f4e',
					name: 'WIPs',
					noCreateDelete: true,
					permission: 'E462BC1E81F648039CB506B9FCF70F4E',
					dependent: [{
						uid: 'ee83bc7ff01e47cdaaf2771245e8374c',
						name: 'WIP Details',
						permission: 'E462BC1E81F648039CB506B9FCF70F4E',
						dependent: []
					}]
				},
				{
					uid: 'd4d807d4047e439d9ba536d7114e9009',
					name: 'Models',
					noCreateDelete: true,
					permission: 'd4d807d4047e439d9ba536d7114e9009',
					dependent: [{
						uid: '8a10e1cb69774d56926abd47c0c8dca9',
						name: 'Model Details',
						permission: 'd4d807d4047e439d9ba536d7114e9009',
						dependent: []
					},
						{
							uid: '8b4e238704f84550b00830dec07b25b5',
							name: 'Model Files',
							permission: '8b4e238704f84550b00830dec07b25b5',
							dependent: [{
								uid: '4909263a40954a3caf4f757e782dd679',
								name: 'Model File Details',
								permission: '8b4e238704f84550b00830dec07b25b5',
								dependent: []
							}]
						},
						{
							uid: 'eee4bf0089af41d2ae0f4a68027b58b3',
							name: 'Model Parts',
							permission: 'eee4bf0089af41d2ae0f4a68027b58b3',
							dependent: [{
								uid: 'b5faadeba52d44828e9cb453913eb8fd',
								name: 'Sub Models Details',
								permission: 'eee4bf0089af41d2ae0f4a68027b58b3',
								dependent: []
							}]
						},
					    {
						uid: 'd5d4776c5ea64701912a9c8b007ec446',
						name: 'Model Versions',
						permission: 'd4d807d4047e439d9ba536d7114e9009',
						dependent: []
						},
						{
							uid: 'a16d5eb0ec314c00871308b03f4a1c39',
							name: 'Model Versions Detail',
							permission: 'd4d807d4047e439d9ba536d7114e9009',
							dependent: []
						}
					]
				},
				{
					uid: 'f0930caddf2c4043b08b24661a683bc4',
					name: 'Estimate Rules',
					noCreateDelete: true,
					permission: 'f0930caddf2c4043b08b24661a683bc4',
					dependent: [{
						uid: '677f693b516c41c3b65fd3d1b68e652d',
						name: 'Estimate Rule Parameter',
						permission: '677F693B516C41C3B65FD3D1B68E652D',
						dependent: [{
							uid: 'edab9784710a4822aea158e82ece45f7',
							name: 'Estimate Rules Parameter Value',
							permission: 'EDAB9784710A4822AEA158E82ECE45F7',
							dependent: []
						}]
					}, {
						uid: 'b514a6f1041b40499f4cfff00a149a25',
						name: 'Estimate Rules Script',
						permission: 'B514A6F1041B40499F4CFFF00A149A25',
						dependent: []
					}]
				},
				{
					uid: '0f73eafb75614d60bb5334d6586fd539',
					name: 'Estimate Parameter',
					permission: '0f73eafb75614d60bb5334d6586fd539',
					dependent: []
				},
				{
					uid: '1d9edc7227ef492c8dea37bd11a2011e',
					name: 'Hoops',
					permission: '7ac2a568c32e4a16a2b4106db572133d',
					dependent: []
				},
				{
					uid: '4fbadfb0ca71406eba039925a82daba2',
					name: 'Hoops 2',
					permission: '9275c055a1e14f82a37831cd0f68c40f',
					dependent: []
				},
				{
					uid: '71b46d3a2dc949fc80404d0a0f3996ea',
					name: 'Hoops 3',
					permission: 'a272cac0ae67421eb9976bf6392f80a7',
					dependent: []
				},
				{
					uid: 'fba385e1c79846acbf5db4a3ff4bae12',
					name: 'Hoops 4',
					permission: '097de59303a8453680bdc61d350365fd',
					dependent: []
				},
				{
					uid: 'a29cb3a3235e4254bfb18c536b42ea88',
					name: 'Camera Positions',
					permission: '17c46d111cd44732827332315ea206ed',
					dependent: []
				},
				{
					uid: 'b187af9db8be4cdd87307c06b12d7c1c',
					name: 'Object Informations',
					noCreateDelete: true,
					permission: '36abc91df46f4129a78cc26fe79a6fdc',
					dependent: [{
						uid: '38f9abc2a0024f898a2607dbc27e647d',
						name: 'Object Information Details',
						permission: '36abc91df46f4129a78cc26fe79a6fdc',
						dependent: []
					}]
				},
				{
					uid: 'b1482570d88e42978e5acdc79c15f2fa',
					name: 'Simulation Cockpit',
					permission: 'a919c5302c1a4a8c975726f2466ca52d',
					dependent: []
				},
				{
					uid: '4eaa47c530984b87853c6f2e4e4fc67e',
					name: 'Documents',
					noCreateDelete: true,
					permission: '4EAA47C530984B87853C6F2E4E4FC67E',
					dependent: [{
						uid: '8bb802cb31b84625a8848d370142b95c',
						name: 'Document Details',
						permission: '4EAA47C530984B87853C6F2E4E4FC67E',
						dependent: []
					},
						{
							uid: '684f4cdc782b495e9e4be8e4a303d693',
							name: 'Document Revisions',
							permission: '684F4CDC782B495E9E4BE8E4A303D693',
							dependent: [{
								uid: 'd8be3b30fed64aab809b5dc7170e6219',
								name: 'Document Revision Details',
								permission: '684F4CDC782B495E9E4BE8E4A303D693',
								dependent: []
							}]
						}]
				},
				{
					uid: 'fd77a1ee53124d0ebbc1715996942dcc',
					name: 'Project Remark',
					permission: 'fd77a1ee53124d0ebbc1715996942dcc',
					dependent: []
				},
				{
					uid: '078ea761dbf74be19f8b29cb28705e5a',
					name: 'Tender Remark',
					permission: '078ea761dbf74be19f8b29cb28705e5a',
					dependent: []
				},
				{
					uid: '8f8e4f4d4d3f4ccb9a4fb173f849d18d',
					name: 'Call Off Remark',
					permission: '8f8e4f4d4d3f4ccb9a4fb173f849d18d',
					dependent: []
				},
				{
					uid: '7e2299e11b01408290b7b3f49548a4a8',
					name: 'Warrenty Remark',
					permission: '7e2299e11b01408290b7b3f49548a4a8',
					dependent: []
				},
				{
					uid: '43d4482c29aa4b119675465dc928fdfa',
					name: 'Project Map',
					permission: '43d4482c29aa4b119675465dc928fdfa',
					dependent: []
				},
				{
					uid: 'f9aae1e070e24b5bb2dacc96d5af9763',
					name: 'Object Header',
					permission: '34ce2fbe7aa74734b5389b19df8646b6',
					dependent: [{
						uid: '22be537a8ca5497a86350d825f809378',
						name: 'Object Header Details',
						permission: '34ce2fbe7aa74734b5389b19df8646b6',
						dependent: []
					}, {
						uid: '79bf98afdcfc42b1be7b9e661c6500ff',
						name: 'Object Header Level',
						permission: '230a2d63c31e429486325c62660afcca',
						dependent: [{
							uid: 'd2f88bec61c14c89a93f87a226797f3d',
							name: 'Object Header Level Details',
							permission: '230a2d63c31e429486325c62660afcca',
							dependent: []
						}]
					}]
				},
				{
					uid: '9ae8c2111f354edea6c775fb64469de3',
					name: 'Sort Code 01 List',
					permission: '9ae8c2111f354edea6c775fb64469de3',
					dependent: [{
						uid: 'b5b27ff9adae4de09deb1e765b53bff9',
						name: 'Sort Code 01 Details',
						permission: '9ae8c2111f354edea6c775fb64469de3',
						dependent: []
					}]
				},
				{
					uid: '8a747d2e83ab42ed8c918f9840af2b2e',
					name: 'Sort Code 02 List',
					permission: '8a747d2e83ab42ed8c918f9840af2b2e',
					dependent: [{
						uid: '77058c67284b412e92a65bfab55f8beb',
						name: 'Sort Code 02 Details',
						permission: '8a747d2e83ab42ed8c918f9840af2b2e',
						dependent: []
					}]
				},
				{
					uid: '8b8070460f8c477382a3f4ca0eccecf0',
					name: 'Sort Code 03 List',
					permission: '8b8070460f8c477382a3f4ca0eccecf0',
					dependent: [{
						uid: '67f570d0ac7c4ee7b0049f7bd2069eaa',
						name: 'Sort Code 03 Details',
						permission: '8b8070460f8c477382a3f4ca0eccecf0',
						dependent: []
					}]
				},
				{
					uid: '4232f7b7aa174dc9b9b1cbfb2d92e61b',
					name: 'Sort Code 04 List',
					permission: '4232f7b7aa174dc9b9b1cbfb2d92e61b',
					dependent: [{
						uid: 'b47caaaecb014b9cabbbcc547eeb83f8',
						name: 'Sort Code 04 Details',
						permission: '4232f7b7aa174dc9b9b1cbfb2d92e61b',
						dependent: []
					}]
				},
				{
					uid: '5d796e309aeb45318236d806a34f0028',
					name: 'Sort Code 05 List',
					permission: '5d796e309aeb45318236d806a34f0028',
					dependent: [{
						uid: 'e5c93bd4eba44faeb922d79718f9d69e',
						name: 'Sort Code 05 Details',
						permission: '5d796e309aeb45318236d806a34f0028',
						dependent: []
					}]
				},
				{
					uid: 'bd4aebdaf1fe4a779bb2096946a918a5',
					name: 'Sort Code 06 List',
					permission: 'bd4aebdaf1fe4a779bb2096946a918a5',
					dependent: [{
						uid: '2ae50bf1b5074521a66f799b5b2db27b',
						name: 'Sort Code 06 Details',
						permission: 'bd4aebdaf1fe4a779bb2096946a918a5',
						dependent: []
					}]
				},
				{
					uid: '76cf8afdfef64049b7820423d83c24c5',
					name: 'Sort Code 07 List',
					permission: '76cf8afdfef64049b7820423d83c24c5',
					dependent: [{
						uid: 'b788d63109d040ceb43615efaaf050a7',
						name: 'Sort Code 07 Details',
						permission: '76cf8afdfef64049b7820423d83c24c5',
						dependent: []
					}]
				},
				{
					uid: '3a86e227a1d245148a04d0da26162ac4',
					name: 'Sort Code 08 List',
					permission: '3a86e227a1d245148a04d0da26162ac4',
					dependent: [{
						uid: 'f4055b7677cb48609b5346cf1c52c480',
						name: 'Sort Code 08 Details',
						permission: '3a86e227a1d245148a04d0da26162ac4',
						dependent: []
					}]
				},
				{
					uid: '7eb96a183423427c8427f809c658359b',
					name: 'Sort Code 09 List',
					permission: '7eb96a183423427c8427f809c658359b',
					dependent: [{
						uid: 'f38d7efcb775488191ed248bf121f52d',
						name: 'Sort Code 09 Details',
						permission: '7eb96a183423427c8427f809c658359b',
						dependent: []
					}]
				},
				{
					uid: '138e7d85bbc141a29501b08ec1e3d92e',
					name: 'Sort Code 10 List',
					permission: '138e7d85bbc141a29501b08ec1e3d92e',
					dependent: [{
						uid: '9e2d856e32cf4e4aa36a79f29b1ce59f',
						name: 'Sort Code 10 Details',
						permission: '138e7d85bbc141a29501b08ec1e3d92e',
						dependent: []
					}]
				},
				{
					uid: '1db4b61556414ef7893837ae7af004b0',
					name: 'Source Locations',
					permission: '42FF27D7F0EA40EABA389D669BE3A1DF',
					dependent: []
				},
				{
					uid: 'b053362c4d4a4331bfe32bc3a835e664',
					name: 'Source CostGroups 01',
					permission: 'A701B3A3E03B44F2BC3B12F316997E7F',
					dependent: []
				},
				{
					uid: 'c32e69481fa6417d871b0f422d37468e',
					name: 'Source CostGroups 02',
					permission: 'B0CB0CD176744A9B85B0285A847ACD08',
					dependent: []
				},
				{
					uid: '83ef603ed1d0457d8db772c02b963e44',
					name: 'Source CostGroups 03',
					permission: 'FE0FC48A539748CB90838606BDB4B0C0',
					dependent: []
				},
				{
					uid: '3e5341c1d6114f0aaa71d656c6201c5f',
					name: 'Source CostGroups 04',
					permission: 'BF398A70B5494F3BA3B2D9EF9559FFB4',
					dependent: []
				},
				{
					uid: 'b893bd126dcc45388f58233cfb9d97e3',
					name: 'Source CostGroups 05',
					permission: '68665414146A46E28CA23502012087FE',
					dependent: []
				},
				{
					uid: 'c3956ca8e16444e5b76400bc58e54aeb',
					name: 'Model-Users',
					permission: 'c3956ca8e16444e5b76400bc58e54aeb',
					dependent: [{
						uid: 'a050b407bf3a4f1ba1862bf88d812e68',
						name: 'Model-User Details',
						permission: 'c3956ca8e16444e5b76400bc58e54aeb',
						dependent: []
					}]
				},
				{
					uid: '428870a65a7a4e48b753387259c6acfa',
					name: 'Project Photos',
					permission: '428870a65a7a4e48b753387259c6acfa',
					dependent: []
				},
				{
					uid: '851058b59dad4c80b0ef544b9db4dd8c',
					name: 'Price Condition',
					permission: '851058B59DAD4C80B0EF544B9DB4DD8C',
					dependent: []
				},
				{
					uid: '66ed2d9c263c4ed694332ee7fb6744f1',
					name: 'Production Planning Header',
					permission: '66ed2d9c263c4ed694332ee7fb6744f1',
					dependent: [{
						uid: '372b897147d4451ba0eb6f68cef8ac9b',
						name: 'Production Planning Header Event',
						permission: '372b897147d4451ba0eb6f68cef8ac9b',
						dependent: []
					}]
				},
				{
					uid: '42859c49547445f3862a4ec10588db45',
					name: 'Mounting Requisitions',
					permission: '42859c49547445f3862a4ec10588db45',
					dependent: [{
						uid: '25489c49547445f3862a4ec10588db99',
						name: 'Mounting Requisition Details',
						permission: '42859c49547445f3862a4ec10588db45',
						dependent: []
					}]
				},
				{
					uid: '84f41825c88a463286c9502f983b4e90',
					name: 'Project Stocks',
					permission: '84f41825c88a463286c9502f983b4e90',
					dependent: [{
						uid: '82554e69247e442e82175ccd48147b81',
						name: 'Project Stock Details',
						permission: '84f41825c88a463286c9502f983b4e90',
						dependent: []
					}, {
						uid: '55f6ac464f67460882c719f035091290',
						name: 'Project Stock Locations',
						permission: '55f6ac464f67460882c719f035091290',
						dependent: [{
							uid: '90b9dd6abb7c40c1b4f8f17d8919ac88',
							name: 'Project Stock Location Details',
							permission: '55f6ac464f67460882c719f035091290',
							dependent: []
						}]
					}, {
						uid: '562132b3f18e470f8eef6b9dbe5dc9d4',
						name: 'Project Stock Materials',
						permission: '562132b3f18e470f8eef6b9dbe5dc9d4',
						dependent: [{
							uid: 'ca05a162837b4e01b1416116a8a846be',
							name: 'Project Stock Material Details',
							permission: '562132b3f18e470f8eef6b9dbe5dc9d4',
							dependent: []
						}]
					}]
				}
			]
		}]
	});
})();

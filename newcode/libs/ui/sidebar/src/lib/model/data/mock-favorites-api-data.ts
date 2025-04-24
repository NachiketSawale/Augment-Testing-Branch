/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
/**
 * Mock favorites Api data for testing.
 */
export const MOCK_FAVORITES_DATA = {
	projectInfo: {
		'1007973': { projectId: 1007973, projectDescription: '999-999-04 - Prj assembly2', itemToFavType: { '2': [{ favType: 2, id: 1003640, description: '1 - Est1' }] } },
		'1008834': {
			projectId: 1008834,
			projectDescription: 'QUI-001 - Quill Text Editor',
			itemToFavType: {
				'3': [
					{ favType: 3, id: 1026071, description: '1 - Editor and print test' },
					{ favType: 3, id: 1026072, description: '2 - Editor and print test' },
					{ favType: 3, id: 1029542, description: '3 - Editor and print test (Extern Document)' },
					{ favType: 3, id: 1038929, description: '4 - Baulogistik - LV' },
					{ favType: 3, id: 1037343, description: 'ALM-140500 - HTML - Editor / Formatting of numbered lists with underlying text is not correct' },
					{ favType: 3, id: 1031309, description: 'AMJ-001 - Better Tables' },
					{ favType: 3, id: 1033808, description: 'AMJ-002 - Juergens playground' },
					{ favType: 3, id: 1037110, description: 'AMJ-003 - Numbered list' },
					{ favType: 3, id: 1038113, description: 'AMJ-004 - Business Partner' },
					{ favType: 3, id: 1033744, description: 'BAGO-001 - Test Playground' },
					{ favType: 3, id: 1034464, description: 'BAGO-002 - Editor Test' },
					{ favType: 3, id: 1022012, description: 'BoQ-001 - Editor and print test' },
					{ favType: 3, id: 1022037, description: 'BoQ-002 - Arial Text' },
					{ favType: 3, id: 1025016, description: 'BoQ-003 - Inline Style Image' },
					{ favType: 3, id: 1025019, description: 'BoQ-004 - Source Sans' },
					{ favType: 3, id: 1032396, description: 'Test-Editor-1 - Editor and print test (Extern Document)' },
				],
			},
		},
		'1014020': {
			projectId: 1014020,
			projectDescription: 'RISKTESTWINJIT - riskTestWinjit',
			itemToFavType: {
				'1': [{ favType: 1, id: 1004091, description: 'RISKTEST-00001 - 001' }],
				'2': [
					{ favType: 2, id: 1006516, description: '1 - risk test' },
					{ favType: 2, id: 1007211, description: '10 - with 0' },
					{ favType: 2, id: 1007222, description: '11 - disabled' },
					{ favType: 2, id: 1007370, description: '12 - 140759' },
					{ favType: 2, id: 1007201, description: '2 - risk test' },
					{ favType: 2, id: 1007202, description: '3 - risk test' },
					{ favType: 2, id: 1007203, description: '4' },
					{ favType: 2, id: 1007204, description: '5 - with 0' },
					{ favType: 2, id: 1007205, description: '6' },
					{ favType: 2, id: 1007208, description: '7 - with 0' },
					{ favType: 2, id: 1007209, description: '8 - with 0' },
					{ favType: 2, id: 1007210, description: '9 - with 0' },
				],
				'3': [{ favType: 3, id: 1034044, description: '1 - Created based on Line item structure' }],
				'4': [
					{ favType: 4, id: 1004457, description: 'Schdl00080310' },
					{ favType: 4, id: 1004458, description: 'Schdl00080311' },
				],
			},
		},
		'1014485': {
			projectId: 1014485,
			projectDescription: 'N-186210',
			itemToFavType: {
				'2': [
					{ favType: 2, id: 1007595, description: '2 - Tender Estimate' },
					{ favType: 2, id: 1007366, description: '3' },
					{ favType: 2, id: 1007598, description: '4 - Tender Estimate' },
				],
				'3': [
					{ favType: 3, id: 1039737, description: '1' },
					{ favType: 3, id: 1039874, description: '2.MS01 - Main BoQ' },
					{ favType: 3, id: 1039875, description: '2.MSW4' },
				],
			},
		},
	},
	favoritesSetting: {
		'1007973': { projectId: 1007973, projectName: '999-999-04', expanded: { '0': false, '2': false, '1007973': true }, addedAt: '2023-05-12T08:53:46.231Z' },
		'1008834': { projectId: 1008834, projectName: '{"projectName":"QUI-001","sort":0}', expanded: { '0': false, '3': true, '1008834': true }, addedAt: '2023-03-17T06:03:21.943Z' },
		'1014020': { projectId: 1014020, projectName: '{"projectName":"RISKTESTWINJIT","sort":2}', expanded: { '0': false, '1': false, '2': false, '3': true, '4': true, '1014020': true }, addedAt: '2023-03-23T06:09:51.968Z' },
		'1014485': { projectId: 1014485, projectName: 'N-186210', expanded: { '0': false, '2': false, '3': false, '1014485': true }, addedAt: '2023-05-12T07:59:57.452Z' },
	},
};

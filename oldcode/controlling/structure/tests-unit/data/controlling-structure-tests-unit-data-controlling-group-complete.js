(function (angular) {
	'use strict';

	var nextGroupId = 0;
	var nextDetailId = 0;

	function createDetail(code, description) {
		return {
			'Id': ++nextDetailId,
			'ControllinggroupFk': nextGroupId + 1,
			'Code': code,
			'DescriptionInfo': {'Translated': description},
			'Version': 1
		};
	}

	function createGroup(code, description, details) {
		return {
			'Id': ++nextGroupId,
			'Code': code,
			'DescriptionInfo': {'Translated': description},
			'Version': 1,
			'ControllinggroupdetailEntities': details
		};
	}

	// CREATE DATA function: use that in dev tools console to generate javascript code below
	// 	_.each(groups, function (g) {
	// 		console.log('createGroup("' + g.Code + '", "' + g.DescriptionInfo.Translated + '"), [');
	// 		_.each(g.ControllinggroupdetailEntities, function (d) {
	// 			console.log('   ' + 'createDetail("' + d.Code + '", "' + d.DescriptionInfo.Translated + '"),');
	// 		});
	// 	});

	var moduleName = 'controlling.structure';
	angular.module(moduleName).constant('controllingGroupCompleteData', [
		createGroup('CAT', 'Categories', [
			createDetail('CAT1', 'Civil Engineering'),
			createDetail('CAT2', 'Building Construction'),
			createDetail('CAT3', 'Road Construction'),
			createDetail('CAT4', 'Hydraulic Engineering')]),
		createGroup('MAN', 'Managers', [
			createDetail('MAN1', 'Smith'),
			createDetail('MAN2', 'Mueller'),
			createDetail('MAN3', 'Widera')]),
		createGroup('DIS', 'Disciplines', [
			createDetail('DIS1', 'Earth Work'),
			createDetail('DIS2', 'Concrete Work'),
			createDetail('DIS3', 'Masonry Work'),
			createDetail('DIS4', 'Plaster And Stucco Work'),
			createDetail('DIS5', 'Masonry Work')]),
		createGroup('REG', 'Regions', [
			createDetail('REG1', 'Germany'),
			createDetail('REG2', 'France'),
			createDetail('REG3', 'Spain'),
			createDetail('REG4', 'Poland'),
			createDetail('REG5', 'Norway'),
			createDetail('REG6', 'Austria')]),
		createGroup('CGR', 'Controlling Groups KB', [
			createDetail('100', 'Earthwork'),
			createDetail('300', 'Concrete Work'),
			createDetail('500', 'Masonry Work')]),
		createGroup('RA-SEC', 'RASE Project Sectors', [
			createDetail('CAT1', 'ONG Sector'),
			createDetail('CAT2', 'Industry Sector')]),
		createGroup('GEWERKHB', 'GEWERKHB', [
			createDetail('11110', 'Eigenleistung Lohn'),
			createDetail('CONTROLLINGUNITD', 'For Controlling unit detail to assignment')]),
		createGroup('CG_STO', 'Standort', [
			createDetail('04', 'Leipzig'),
			createDetail('12', 'Berlin')]),
		createGroup('CG_VERW', 'Verwaltung', [
			createDetail('040', 'Versicherungen'),
			createDetail('050', 'Büro'),
			createDetail('060', 'Marketing')])
	]);

})(angular);




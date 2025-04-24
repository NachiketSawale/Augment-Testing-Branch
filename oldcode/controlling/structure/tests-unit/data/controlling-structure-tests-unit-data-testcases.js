/**
 * Created by janas on 05.07.2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'controlling.structure';

	function Unit(code, description, units) {
		return {
			Code: code,
			Description: description,
			ControllingUnits: units
		};
	}

	// test cases
	angular.module(moduleName).constant('generatorTestCasesData', {
		TestCase000: {
			Brief: 'Short description',
			Description: 'Fill in description of the test case here',
			DataSources: {
				// TODO:
			},
			CodeTemplate: {
				Code: '[P(1-4)][*]-[CUG{DIS}(1-4)][*]-[L(1-5)]',
				Assignment01: '',
				Assignment02: '',
				Assignment03: '',
				Assignment04: ''
				// ...
			},
			// Output
			ExpectedControllingStructure: [
				Unit('Proj', undefined/* TODO: check this! */, [
					Unit('Proj-DIS1', 'Earth Work', [
						Unit('Proj-DIS1-LOCA', 'Location A', [
							Unit('Proj-DIS1-LOCA1', 'Location A - 1', []),
							Unit('Proj-DIS1-LOCA2', 'Location A - 2', [])
						]),
						Unit('Proj-DIS1-LOCB', 'Location B', [
							Unit('Proj-DIS1-LOCB1', 'Location B - 1', []),
							Unit('Proj-DIS1-LOCB2', 'Location B - 2', [])
						]),
						Unit('Proj-DIS1-LOCC', 'Location C', [])
					]),
					Unit('Proj-DIS2', 'Concrete Work', [
						Unit('Proj-DIS2-LOCA', 'Location A', [
							Unit('Proj-DIS2-LOCA1', 'Location A - 1', []),
							Unit('Proj-DIS2-LOCA2', 'Location A - 2', [])
						]),
						Unit('Proj-DIS2-LOCB', 'Location B', [
							Unit('Proj-DIS2-LOCB1', 'Location B - 1', []),
							Unit('Proj-DIS2-LOCB2', 'Location B - 2', [])
						]),
						Unit('Proj-DIS2-LOCC', 'Location C', [])]),
					Unit('Proj-DIS3', 'Masonry Work', [
						Unit('Proj-DIS3-LOCA', 'Location A', [
							Unit('Proj-DIS3-LOCA1', 'Location A - 1', []),
							Unit('Proj-DIS3-LOCA2', 'Location A - 2', [])
						]),
						Unit('Proj-DIS3-LOCB', 'Location B', [
							Unit('Proj-DIS3-LOCB1', 'Location B - 1', []),
							Unit('Proj-DIS3-LOCB2', 'Location B - 2', [])
						]),
						Unit('Proj-DIS3-LOCC', 'Location C', [])]),
					Unit('Proj-DIS4', 'Plaster And Stucco Work', [
						Unit('Proj-DIS4-LOCA', 'Location A', [
							Unit('Proj-DIS4-LOCA1', 'Location A - 1', []),
							Unit('Proj-DIS4-LOCA2', 'Location A - 2', [])
						]),
						Unit('Proj-DIS4-LOCB', 'Location B', [
							Unit('Proj-DIS4-LOCB1', 'Location B - 1', []),
							Unit('Proj-DIS4-LOCB2', 'Location B - 2', [])
						]),
						Unit('Proj-DIS4-LOCC', 'Location C', [])]),
					Unit('Proj-DIS5', 'Masonry Work', [
						Unit('Proj-DIS5-LOCA', 'Location A', [
							Unit('Proj-DIS5-LOCA1', 'Location A - 1', []),
							Unit('Proj-DIS5-LOCA2', 'Location A - 2', [])
						]),
						Unit('Proj-DIS5-LOCB', 'Location B', [
							Unit('Proj-DIS5-LOCB1', 'Location B - 1', []),
							Unit('Proj-DIS5-LOCB2', 'Location B - 2', [])
						]),
						Unit('Proj-DIS5-LOCC', 'Location C', [])]
					)]
				)
			]
		}
	});

})(angular);
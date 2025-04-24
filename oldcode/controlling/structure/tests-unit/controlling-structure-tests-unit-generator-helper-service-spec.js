/**
 * Created by janas on 03.07.2018.
 */
(function (angular) {
	'use strict';

	describe('Generator Helper Service', function () {

		var generatorHelperService;

		beforeEach(module('controlling.structure'));

		beforeEach(inject(function (_, controllingStructureGeneratorHelperService) {
			expect(controllingStructureGeneratorHelperService).toBeDefined();
			expect(_).toBeDefined();
			generatorHelperService = controllingStructureGeneratorHelperService;
		}));

		it('should only provide the defined api functions', function () {
			expect(_.keys(generatorHelperService)).toEqual([
				// here's the expected api:
				'cartesianProductOf'
			]);
		});

		it('should calculate the cartesian product correctly', function () {
			// one operand
			expect(generatorHelperService.cartesianProductOf([['A', 'B']])).toEqual([['A'], ['B']]);

			// two operands
			expect(generatorHelperService.cartesianProductOf([['A', 'B'], ['1', '2', '3']])).toEqual(
				[['A', '1'], ['A', '2'], ['A', '3'], ['B', '1'], ['B', '2'], ['B', '3']]
			);

			// three operands
			expect(generatorHelperService.cartesianProductOf([['A', 'B'], ['1', '2', '3'], ['X', 'Y']])).toEqual([
				['A', '1', 'X'], ['A', '1', 'Y'], ['A', '2', 'X'], ['A', '2', 'Y'], ['A', '3', 'X'], ['A', '3', 'Y'],
				['B', '1', 'X'], ['B', '1', 'Y'], ['B', '2', 'X'], ['B', '2', 'Y'], ['B', '3', 'X'], ['B', '3', 'Y']
			]);
		});

	});
})(angular);
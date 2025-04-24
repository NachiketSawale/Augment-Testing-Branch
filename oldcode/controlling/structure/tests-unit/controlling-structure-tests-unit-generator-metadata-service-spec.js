/**
 * Created by janas on 11.07.2018.
 */
(function (angular) {
	'use strict';

	describe('Generator Meta Service', function () {

		var metaService;

		beforeEach(module('controlling.structure'));

		beforeEach(inject(function (_, controllingStructureGeneratorMetadataService) {
			expect(_).toBeDefined();
			expect(controllingStructureGeneratorMetadataService).toBeDefined();
			metaService = controllingStructureGeneratorMetadataService;
		}));

		it('should only provide the defined api functions', function () {
			expect(_.keys(metaService)).toEqual([
				// here's the expected api:
				'evaluateExpression',
				'init',
				'getObjects',
				'getList',
				'resolveExpression',
				'isConstant',
				'isCustom'
			]);
		});

	});

})(angular);
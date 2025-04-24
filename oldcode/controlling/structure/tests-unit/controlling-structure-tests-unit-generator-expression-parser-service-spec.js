/**
 * Created by janas on 05.07.2018.
 */
(function (angular) {
	'use strict';

	describe('Generator expression parser', function () {

		var generatorExpressionParserService;

		beforeEach(module('controlling.structure'));

		beforeEach(inject(function (_, controllingStructureGeneratorExpressionParserService) {
			expect(controllingStructureGeneratorExpressionParserService).toBeDefined();
			expect(_).toBeDefined();
			generatorExpressionParserService = controllingStructureGeneratorExpressionParserService;
		}));

		it('should only provide the defined api functions', function () {
			expect(_.keys(generatorExpressionParserService)).toEqual([
				// here's the expected api:
				'extractExpr',
				'extendExpressions',
				'parse'
			]);
		});

		it('should extract the expressions from given template', function () {
			expect(generatorExpressionParserService.extractExpr(
				'[P(1-4)][*]-[CUG{DIS}(1-4)][*]-[L(1-2)]'
			)).toEqual([
				{'expr': 'P(1-4)'},
				{'expr': '*'},
				'-',
				{'expr': 'CUG{DIS}(1-4)'},
				{'expr': '*'},
				'-',
				{'expr': 'L(1-2)'}
			]);
		});

		it('should parse (extract and extend the expressions) the given template', function () {
			expect(generatorExpressionParserService.parse(
				'[P(1-4)][*]-[CUG{DIS}(1-4)][*]-[L(1-2)]'
			)).toEqual([
				{
					'expr': 'P(1-4)',
					'entityName': 'P',
					'subStrList': ['1-4']
				},
				{'expr': '*'},
				'-',
				{
					'expr': 'CUG{DIS}(1-4)',
					'entitySub': 'DIS',
					'entitySubIndex': 0,
					'entityName': 'CUG',
					'subStrList': ['1-4']
				},
				{'expr': '*'},
				'-',
				{
					'expr': 'L(1-2)',
					'entityName': 'L',
					'subStrList': ['1-2']
				}
			]);
		});

		// TODO:
		// test with wrong templates
		// it('should throw exceptions on invalid templates', function () {
		// 	expect(generatorExpressionParserService.extractExpr(
		// 		'[P(1-4)[*]-[CUG{DIS}(1-4)][*]-[L(1-2)]'
		// 	)).toThrowError();
		// });

	});
})(angular);
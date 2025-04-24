/**
 * Created by janas on 09.07.2018.
 */
(function (angular) {
	'use strict';

	describe('Controlling Structure Planned Attributes Service', function () {

		var plannedAttributesService;

		beforeEach(module('controlling.structure'));

		beforeEach(inject(function (_, controllingStructurePlannedAttributesService) {
			expect(_).toBeDefined();
			expect(controllingStructurePlannedAttributesService).toBeDefined();
			plannedAttributesService = controllingStructurePlannedAttributesService;
		}));

		it('should only provide the defined api functions', function () {
			expect(_.keys(plannedAttributesService)).toEqual([
				// here's the expected api:
				'checkAndFillRowPlannedAttributes',
				'updateAntecessors',
				'updateAllUnits'
			]);
		});
	});
})(angular);
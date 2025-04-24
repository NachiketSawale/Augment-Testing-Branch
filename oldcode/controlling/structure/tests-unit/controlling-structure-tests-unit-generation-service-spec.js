(function (angular) {
	'use strict';

	describe('Generation Service', function () {
		var $httpMock;

		beforeEach(module('controlling.structure'));
		beforeEach(inject(function (globals, $httpBackend, controllingGroupCompleteData, projectLocationsData) {
			// Set up the mock http service responses
			$httpMock = $httpBackend;

			// controlling unit groups
			$httpMock.when('GET', globals.webApiBaseUrl + 'controlling/structure/lookup/controllinggroupcomplete')
				.respond(200, controllingGroupCompleteData);

			// project locations // TODO: at the moment project id is ignored (=> each project same locations)
			$httpBackend.when('GET', /project\/location\/tree\?projectId/)
				.respond(200, projectLocationsData);
		}));
		beforeEach(function () {
			jasmine.addCustomEqualityTester(unitTreeEquality);
		});

		afterEach(function () {
			$httpMock.verifyNoOutstandingExpectation();
			$httpMock.verifyNoOutstandingRequest();
		});

		it('should exist', inject(function (
			controllingStructureGeneratorExpressionParserService,
			controllingStructureGeneratorService,
			controllingStructureGeneratorMetadataService,
			projectMainForCOStructureService,
			controllingStructureWizardGenerateControllingGroupsService,
			controllingStructureWizardGenerateLocationService,
			controllingStructureWizardGenerateCustomService,
			controllingStructureWizardGenerateConstantsService) {

			expect(controllingStructureWizardGenerateConstantsService).toBeDefined();
			expect(controllingStructureWizardGenerateCustomService).toBeDefined();
			expect(controllingStructureWizardGenerateLocationService).toBeDefined();
			expect(controllingStructureWizardGenerateControllingGroupsService).toBeDefined();
			expect(projectMainForCOStructureService).toBeDefined();
			expect(controllingStructureGeneratorMetadataService).toBeDefined();
			expect(controllingStructureGeneratorService).toBeDefined();
			expect(controllingStructureGeneratorExpressionParserService).toBeDefined();
		}));

		it('should generate controlling units', inject(function (
			controllingStructureGeneratorService, controllingStructureGeneratorMetadataService, generatorTestCasesData) {

			var testCase = generatorTestCasesData.TestCase000;

			controllingStructureGeneratorMetadataService.init();
			$httpMock.flush(); // make sure http requests completed

			controllingStructureGeneratorService.init(testCase.CodeTemplate.Code, controllingStructureGeneratorMetadataService);
			var data = controllingStructureGeneratorService.generateCUs({
				parentProp: 'ControllingunitFk',
				childProp: 'ControllingUnits',
				idStart: 0
			});

			// TODO: create console function to generate + format structure below...
			expect(data).toEqual(testCase.ExpectedControllingStructure);
		}));

		// TODO:
		// test parent fk in tree structure

		// list of test cases
		// only code (without assignments)
		// - test without locations
		// - test without controlling groups
		// - test custom data
		// - test global constants (like company)
		// - test with locations, flat + tree
		// - test with controlling groups
		// - test with multiple controlling groups
		// - test constants (strings)
		// - test constants and expressions mixed
		// - test flat controlling structure (so only one level -> no [*] expression)
		// - test tree controlling structure (with
		//      - two levels
		//      - three levels
		// - test controlling groups not available
		// - test global constants not available
		// - test custom data not available

		// list of test cases (also assignments included)
		// - see above same as code
		// - test validation -> assignment matches code template?

	});
})(angular);
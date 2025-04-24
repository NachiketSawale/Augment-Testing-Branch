(function (angular) {
	'use strict';
	var moduleName='qto.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).constant('qtoMainLineType', {
		Standard: 1,
		CommentLine: 2,
		Subtotal: 3,
		ItemTotal: 4,
		RRefrence: 5,
		LRefrence: 6,
		IRefrence: 7,
		Hilfswert: 8
	});

	angular.module(moduleName).constant('qtoMainFormulaType', {
		Predefine: 1,
		FreeInput: 2,
		Script: 3
	});

	angular.module(moduleName).constant('qtoBoqType', {
		PrjBoq: 1,
		PrcBoq: 2,
		WipBoq: 3,
		BillingBoq: 4,
		PesBoq: 5,
		QtoBoq:6
	});

	angular.module(moduleName).constant('QtoType', {
		FreeQTO: 1,
		Standard: 2,
		RebQTO: 3,
		OnormQTO: 4,
		CrbQTO: 5
	});

	angular.module(moduleName).constant('qtoMainProjectModes', {
		Standard: 1,
		AustrianNorm1996: 2,
		AustrianNormA2063: 3,
		CRB: 4
	});

	// QtoTargetTypes
	angular.module(moduleName).constant('QtoTargetType', {
		PesBoq:    1,  // Procurement Pes BoQ(bq)
		WipOrBill: 2,  //Sales WIP/Bill  (iq/bq)
		PrcWqAq:   3, //Procurement WQ/AQ (wq/aq)
		PrjWqAq:   4  //Sales WQ/AQ(wq/aq)
	});

	angular.module(moduleName).constant('qtoRubricCategory', {
		liveTakeOffRubricCategory: 6,
		RebRubricCategory: 84,
		OnormRubricCategory: 525,
		FreeRubricCategory: 526,
		CrbRubricCategory: 530
	});

	angular.module(moduleName).controller('qtoMainDetailGridController',
		['$scope', '$injector', 'platformControllerExtendService', 'platformGridControllerService', 'qtoMainDetailService',
			'qtoMainUIStandardService', 'qtoMainDetailGridValidationService', 'platformGridAPI', '$timeout', 'qtoMainLineType', '$translate',
			'qtoMainClipboardService','qtoMainHeaderDataService', 'qtoMainDetailGridControllerService','qtoBoqType',
			function ($scope, $injector, platformControllerExtendService, gridControllerService, dataService, gridColumns, validationService, platformGridAPI, $timeout,
				qtoMainLineType, $translate,qtoMainClipboardService,parentService, qtoMainDetailGridControllerService,qtoBoqType) {

				qtoMainDetailGridControllerService.initQtoDetailController($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService, parentService,qtoBoqType.QtoBoq);
				// if all qto detial container need costGroup filter, then, the below line is needed to move in  qtoMainDetailGridControllerService.initQtoDetailController(...)
				$injector.get('qtoDetailDataFilterService').setServiceToBeFiltered(dataService);
			}
		]);
})(angular);
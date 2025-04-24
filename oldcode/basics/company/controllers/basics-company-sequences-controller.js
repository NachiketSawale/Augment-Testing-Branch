/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);


	angModule.value('basicsCompanySequencesColumns', {
		getStandardConfigForListView: function () {
			return { columns: [
				{ id: 'TradingSequences', field: 'TradingSequences', name: 'Trading Sequences',name$tr$:'basics.company.entityTradingSequences',formatter: 'code', editor: 'code', sortable: true, width: 300 },
				{ id: 'StartDateSequences', field: 'StartDate', name: 'Start Date',name$tr$:'basics.company.entityStartDate', formatter: 'date', editor: 'date', sortable: true, width: 300 },
				{ id: 'EndDateSequences', field: 'EndDate', name: 'End Date',name$tr$:'basic.companys.entityEndDate', formatter: 'date', editor: 'date', sortable: true, width: 300 }
			]};
		}
	});


	angModule.controller('basicsCompanySequencesController',
		['$scope', 'basicsCompanySequencesService', 'basicsCompanySequencesColumns', 'basicsCompanyValidationService', 'platformGridControllerService','platformTranslateService',
			function ($scope, basicsCompanySequencesService, basicsCompanySequencesColumns, basicsCompanyValidationService, platformGridControllerService,platformTranslateService) {

				var myGridConfig = { initCalled: false, columns: [] };

				platformTranslateService.translateGridConfig(basicsCompanySequencesColumns.getStandardConfigForListView().columns);

				platformGridControllerService.initListController($scope, basicsCompanySequencesColumns, basicsCompanySequencesService, basicsCompanyValidationService, myGridConfig);

			}
		]);
})();
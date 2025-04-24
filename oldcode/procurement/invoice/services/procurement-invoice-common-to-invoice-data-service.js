(function (angular) {

	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	// documentsProjectDocumentController
	angular.module(moduleName).factory('procurementInvoiceDocumentDataService', ['procurementInvoiceHeaderDataService','documentsProjectDocumentDataService',
		function(parentService,dataServiceFactory){
			dataServiceFactory.register({
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'InvHeaderFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
					{documentField: 'PrcPackageFk', dataField: 'PrcPackageFk', readOnly: false},
					{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
					{documentField: 'PesHeaderFk', dataField: 'PesHeaderFk', readOnly: false}
				]
			});
			return dataServiceFactory.getService({
				moduleName: moduleName
			});
		}]);

	// documentsProjectDocumentRevisionController
	angular.module(moduleName).factory('procurementInvoiceDocumentRevisionDataService', ['procurementInvoiceHeaderDataService','documentsProjectDocumentRevisionDataService','documentsProjectDocumentDataService',
		function(parentService,dataServiceFactory,documentsProjectDocumentDataService){
			var config = {
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'InvHeaderFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
					{documentField: 'PrcPackageFk', dataField: 'PrcPackageFk', readOnly: false},
					{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
					{documentField: 'PesHeaderFk', dataField: 'PesHeaderFk', readOnly: false}
				],
				title: moduleName
			};

			var revisionConfig = angular.copy(config);

			revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

			return dataServiceFactory.getService(revisionConfig);
		}]);

})(angular);
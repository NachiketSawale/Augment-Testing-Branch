(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).controller('businesspartnerContactController', [
		'$scope', 'platformMainControllerService', 'businesspartnerContactDataService', 'businesspartnerContactTranslationService','$translate','documentsProjectDocumentDataService',
		function ($scope, platformMainControllerService, mainDataService, translateService,$translate,documentsProjectDocumentDataService) {

			documentsProjectDocumentDataService.register({
				moduleName: moduleName,
				title: $translate.instant('businesspartner.contact.contact'),
				parentService: mainDataService,
				columnConfig: [
					{documentField: 'BpdContactFk', dataField: 'Id',readOnly: true},
					{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk',readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
					{documentField: 'MdcMaterialCatalogFk',dataField: 'MaterialCatalogFk', readOnly: false},
					{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
				]
			});

			let options = {search: true, reports: true, wizard: true, auditTrail: 'b6c13ae727ca4583b9c1d35d9644b20c'};
			let result = platformMainControllerService.registerCompletely($scope, mainDataService, {}, translateService, moduleName, options);
			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(mainDataService, result, translateService, options);
			});
		}
	]);
})(angular);
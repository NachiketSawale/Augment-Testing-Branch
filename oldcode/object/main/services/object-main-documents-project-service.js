
(function (angular) {
	'use strict';

	angular.module('object.main').factory('objectMainDocumentsProjectService',
		['documentsProjectDocumentDataService', 'objectMainUnitService',
			function (documentsProjectDocumentDataService, mainService) {

				function register() {

					var config = {
						moduleName: 'object.main',
						parentService: mainService,
						title: 'object.main.entityObjectMainUnit',
						columnConfig: [
							{documentField: 'ObjUnitFk', dataField: 'Id', readOnly: false},//ObjUnitFk
							//{documentField: 'ObjHeaderFk', dataField: 'HeaderFk', readOnly: false}
							//{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
							//{documentField: 'PrjLocationFk', dataField: 'LocationFk', readOnly: true}
						],
						subModules: []
					};
					documentsProjectDocumentDataService.register(config);
				}

				function unRegister() {
					documentsProjectDocumentDataService.unRegister();
				}

				return {
					register: register,
					unRegister: unRegister
				};
			}]);
})(angular);
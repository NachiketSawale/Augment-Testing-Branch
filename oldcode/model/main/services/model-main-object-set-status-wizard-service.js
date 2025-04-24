/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainObjectSetStatusWizardService
	 * @function
	 *
	 * @description Provides a status change wizard for object sets.
	 */
	angular.module('model.main').service('modelMainObjectSetStatusWizardService', ['basicsCommonChangeStatusService',
		'modelMainObjectDataService', 'modelMainObjectSetDataService', 'basicsLookupdataSimpleLookupService',
		'BasicsLookupdataLookupDictionary', '$http', 'documentProjectDocumentsStatusChangeService', 'basicsCustomMDLObjectsetStatusLookupDataService',
		function (basicsCommonChangeStatusService, modelMainObjectDataService, modelMainObjectSetDataService,
		          basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDictionary, $http,
		          documentProjectDocumentsStatusChangeService, basicsCustomMDLObjectsetStatusLookupDataService) {
			var service = {};

			service.showDialog = function () {
				var wz = basicsCommonChangeStatusService.provideStatusChangeInstance({
					mainService: modelMainObjectDataService,
					dataService: modelMainObjectSetDataService,
					title: 'Change Object Set Status', // TODO: translate
					statusField: 'ObjectSetStatusFk',
					statusName: 'objectSet',
					updateUrl: 'model/main/objectset/changestatus',
					pKey1Field: 'ProjectFk',
					projectField: 'ProjectFk',
					codeField: 'Name',
					descField: 'Remark',
					statusProvider: function () {
						return basicsCustomMDLObjectsetStatusLookupDataService.getList({});
					},
				});
				wz.fn();
			};

			function changeStatusForProjectDocument() {
				return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(modelMainObjectDataService, 'model.main');
			}

			service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;
			return service;
		}]);
})(angular);

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.measurements';

	angular.module(moduleName, ['model.annotation']);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'ModelMeasurementDto', moduleSubModule: 'Model.Measurements'},
							{typeName: 'ModelMeasurementGroupDto', moduleSubModule: 'Model.Measurements'},
							{typeName: 'ModelMeasurementPointDto', moduleSubModule: 'Model.Measurements'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelAnnotationObjectLinkDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationCameraDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationMarkerDto', moduleSubModule: 'Model.Annotation'}
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('modelMeasurementDataService').selectAfterNavigation(item, triggerField);
					}
				}
			);
		}]);

})(angular);



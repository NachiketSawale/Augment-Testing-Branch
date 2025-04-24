/**
 * Created by jim on 7/5/2017.
 */
(function (angular) {
	'use strict';

	var moduleName='documents.project';
	var defectMainModule = angular.module(moduleName);

	// jshint -W072
	defectMainModule.factory('testServiceA',
		['documentsProjectDocumentModuleContext',
			function (documentsProjectDocumentModuleContext) {

				var service = {};
				service.testA=function(){
					var configA1=documentsProjectDocumentModuleContext.getConfig();
					console.log(configA1);
					var objA= {
						moduleName: 'moduleNameB',
						parentService: 'parentServiceB',
						columnConfig: 'columnConfigB',
						title: 'titleB'
					};
					documentsProjectDocumentModuleContext.setConfig(objA);
					console.log(configA1);
					// var configA2=documentsProjectDocumentModuleContext.getConfig();
					// console.log(configA2);

				};


				return service;
			}]);
})(angular);

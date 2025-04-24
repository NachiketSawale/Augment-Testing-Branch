/**
 * Created by Rolf Eisenhut
 */
/* global console:false */
(function () {
	'use strict';
	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * uomService is the data service for all uom data functions.
	 */
	angular.module(moduleName).service('platformSchemaServiceTest', ['platformSchemaService', '$timeout',
		function (schemaService, $timeout) {

			/**
			 * @ngdoc function
			 * @name fixture
			 * @function
			 * @methodOf platform:platformSchemaService
			 * @description read a schema to a dto class from cache or backend service
			 */
			function fixtures() {

				// schemaService.initialize();

				var schemaPromise = schemaService.getSchema({typeName: 'UoMSynonymDto', moduleSubModule: 'Cloud.UoM', assemblyName: null});
				schemaPromise.then(function (data) {
					console.log('schemaPromise() returned', data);
					schemaService.cacheInfo();
				}, function (reason) {
					console.log('schemaPromise() failed', reason);
				});

				var mySchemaList = [
					{typeName: 'UoMDto', moduleSubModule: 'Cloud.UoM', assemblyName: null},
					{typeName: 'UoMSynonymDto', moduleSubModule: 'Cloud.UoM', assemblyName: null},
					{typeName: 'RIB.Visual.Platform.Common.TranslateOtherLanguageDto', moduleSubModule: null, assemblyName: 'RIB.Visual.Platform.Common'}
				];
				console.time('StartPromiseSchemas');
				var schemasPromise = schemaService.getSchemas(mySchemaList);
				schemasPromise.then(function (data) {
					console.timeEnd('StartPromiseSchemas');
					console.log('schemasPromise() returned', data);
					schemaService.cacheInfo();

					console.time('StartPromise2Schemas 2');
					var schemasPromise2 = schemaService.getSchemas(mySchemaList);
					schemasPromise2.then(function (data) {
						console.timeEnd('StartPromise2Schemas 2');
						console.log('schemasPromise2() returned', data);
						schemaService.cacheInfo();
					});

				}, function (reason) {
					console.log('schemasPromise() failed', reason);
				});

				$timeout(function () {
					console.log('check read from cache');
					console.time('checkreadcache');
					schemaService.getSchema({typeName: 'UoMSynonymDto', moduleSubModule: 'Cloud.UoM', assemblyName: null})
						.then(function (schema) {
							console.timeEnd('checkreadcache');
							console.log(schema);
						});

				}, 2000);
				schemaService.cacheInfo();
			}

			this.fixtures = function () {
				fixtures();
			};

		}]);
})();

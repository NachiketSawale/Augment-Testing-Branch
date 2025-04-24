/**
 * Created by lnt on 12/27/2018.
 */
(function (angular) {
	'use strict';
	/* globals globals, _ */
	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainFormulaUpdateDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * qtoMainFormulaUpdateDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('qtoMainFormulaUpdateDialogService', [
		'$q', '$translate', 'platformModalService', 'platformDataServiceFactory',
		function ($q, $translate,  platformModalService, platformDataServiceFactory) {

			var service = {
				showDialog: showDialog,
				dataService: null
			};

			// show the dialog
			function showDialog(itemsPredefine) {
				var defer = $q.defer();

				service.dataService = createDataService();  // create a data server for the dialog controller

				var defaultOptions = {
					headerText: $translate.instant('qto.main.updateFormula.title'),
					templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-formula-update-dialog.html',
					backdrop: false,
					width: 'max',
					maxWidth: '1000px',
					// columns: [],                                // grid columns
					gridData: [],                               // grid data
					uuid: '39e55f17910246f4b46A0ddeed42403b',   // grid id (uuid)
					items: itemsPredefine
				};

				platformModalService.showDialog(defaultOptions).then(function (result) {
					defer.resolve(result);
				});

				// get the service
				function createDataService() {
					var serviceOption = {
						module: angular.module('qto.main'),
						serviceName: 'qtoFormulaUpdateService',
						entitySelection: {},
						presenter: {list: {}}
					};

					var container = platformDataServiceFactory.createNewComplete(serviceOption);
					var dataService = container.service;
					var data = container.data;


					dataService.setList = function (items) {
						data.itemList.length = 0;
						_.forEach(items, function (item) {
							data.itemList.push(item);
						});
						data.itemList = data.itemList.length ? _.uniqBy(data.itemList, 'Id') : [];
						data.listLoaded.fire();
					};

					return dataService;
				}
				return defer.promise;
			}

			return service;
		}
	]);
})(angular);


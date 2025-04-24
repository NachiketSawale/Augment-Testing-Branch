/**
 * Created by Jack on 9/14/2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonMaterialsPortalDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * basics Common Materials Portal Dialog Service
	 */
	/* jshint -W072 */
	angular.module('basics.common').factory('basicsCommonMaterialsPortalDialogService', [
		'$q', '$translate', 'platformModalService', 'platformDataServiceFactory', 'platformTranslateService', 'platformCreateUuid', 'globals', '_',
		function ($q, $translate, platformModalService, platformDataServiceFactory, platformTranslateService, platformCreateUuid, globals, _) {

			const service = {
				showDialog: showDialog,
				dataService: null
			};

			platformTranslateService.registerModule('basics.common');

			function showDialog(customOptions) {
				const defer = $q.defer();

				service.dataService = createDataService();  // create a data server for the dialog controller

				const defaultOptions = {
					headerText: $translate.instant('basics.common.wizardDialog.headerText'),
					templateUrl: globals.appBaseUrl + 'basics.common/partials/materials-portal-dialog.html',
					backdrop: false,
					width: 'max',
					maxWidth: '1000px',
					columns: [],                                // grid columns
					gridData: [],                               // grid data
					uuid: '2647AABAD21D41AEB94A35C61DAFD1B1',   // grid id (uuid)
					requestId: platformCreateUuid(),            // request id (guid)
					inquiryDataFn: null,                        // show bizPartner portal window to get bp as bidder
					requestDataFn: null                         // get the selected and saved bp
				};

				const tempOptions = {};
				angular.extend(tempOptions, defaultOptions, customOptions);

				platformModalService.showDialog(tempOptions).then(function (result) {
					defer.resolve(result);
				});

				function createDataService() {
					const serviceOption = {
						module: angular.module('basics.common'),
						serviceName: 'basicsCommonMaterialsPortalDialogService',
						entitySelection: {},
						presenter: {list: {}}
					};

					const container = platformDataServiceFactory.createNewComplete(serviceOption);
					const dataService = container.service;
					const data = container.data;

					dataService.setList = function (items) {
						data.itemList.length = 0;
						_.forEach(items, function (item) {
							data.itemList.push(item);
						});

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
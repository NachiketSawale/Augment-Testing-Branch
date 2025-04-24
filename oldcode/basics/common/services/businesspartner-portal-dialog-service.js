/**
 * Created by roberson.luo on 8/25/2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonBusinesspartnerPortalDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * businesspartner portal dialog service
	 */
	/* jshint -W072 */
	angular.module('basics.common').factory('basicsCommonBusinesspartnerPortalDialogService', [
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
					headerText: $translate.instant('basics.common.wizardDialog.title.businesspartnerPortal'),
					templateUrl: globals.appBaseUrl + 'basics.common/partials/businesspartner-portal-dialog.html',
					backdrop: false,
					width: 'max',
					maxWidth: '1000px',
					columns: [],                                // grid columns
					gridData: [],                               // grid data
					uuid: 'F1B9C24970D7414FBAA7535BAF15D6CD',   // grid id (uuid)
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
						serviceName: 'basicsCommonBusinesspartnerPortalDialogService',
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
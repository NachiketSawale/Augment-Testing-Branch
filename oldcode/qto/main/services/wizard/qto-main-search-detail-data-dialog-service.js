/**
 * Created by lnt on 10/27/2017.
 */
(function (angular) {
	'use strict';
	/* globals globals, _ */
	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainSearchDataDetailDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * qtoMainSearchDataDetailDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('qtoMainSearchDataDetailDialogService', [
		'$q', '$translate', '$injector', 'PlatformMessenger', 'platformModalService', 'platformDataServiceFactory', 'platformTranslateService', 'platformCreateUuid',
		function ($q, $translate, $injector,PlatformMessenger,  platformModalService, platformDataServiceFactory, platformTranslateService, platformCreateUuid) {

			var service = {
				showDialog: showDialog,
				dataService: null
			};

			// show the dialog
			function showDialog(customOptions) {
				var defer = $q.defer();

				service.dataService = createDataService();  // create a data server for the dialog controller

				var defaultOptions = {
					headerText: $translate.instant('qto.main.wizard.wizardDialog.copyQtoDetail'),
					templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-search-data-detail-dialog.html',
					backdrop: false,
					width: 'max',
					maxWidth: '1000px',
					columns: [],                                // grid columns
					gridData: [],                               // grid data
					uuid: '8048006a8c7d46f59574b7bdde3fd71c',   // grid id (uuid)
					requestId: platformCreateUuid(),            // request id (guid)
					inquiryDataFn: null,                        // show qto main quantity takeoff window to search and copy quantity takeoff
					requestDataFn: null                         // get the selected and saved quantity takeoff
				};

				var tempOptions = {};
				angular.extend(tempOptions, defaultOptions, customOptions);

				platformModalService.showDialog(tempOptions).then(function (result) {
					defer.resolve(result);
				});

				// get the service
				function createDataService() {
					var serviceOption = {
						module: angular.module('qto.main'),
						serviceName: 'qtoSearchDataDetailService',
						entitySelection: {},
						presenter: {list: {}}
					};

					var container = platformDataServiceFactory.createNewComplete(serviceOption);
					var dataService = container.service;
					var data = container.data;

					dataService.setList = function (items) {
						data.itemList.length = 0;
						_.forEach(items, function (item) {
							setSerchDetailDataFormCopyConfig(item);
							data.itemList.push(item);
						});
						data.itemList = data.itemList.length ? _.uniqBy(data.itemList, 'Id') : [];
						let qtoMianCopyQtoLineService = $injector.get('qtoMainSearchDetailDialogValidationService');
						angular.forEach(data.itemList, function (item) {
							let result = qtoMianCopyQtoLineService.validateBoqItemIsSameUom(item, item.BoqItemFk, 'BoqItemFk');
							if (result.valid) {
								qtoMianCopyQtoLineService.validateBoqItemFk(item, item.BoqItemFk, 'BoqItemFk', true);
							}
						});

						data.listLoaded.fire();
					};
					function setSerchDetailDataFormCopyConfig(item) {
						let qtoMainDetailService = $injector.get('qtoMainDetailService');
						let copyConfigItem = qtoMainDetailService.copyConfigItem;
						if(qtoMainDetailService.isShowQtoDetailCopyConfig && copyConfigItem){
							if(!copyConfigItem.isIsLocation){
								item.PrjLocationFk = null;
							}
							if(!copyConfigItem.IsType){
								item.QtoTypeFk = null;
							}
							if(!copyConfigItem.IsAssetMaster){
								item.AssetMasterFk = null;
							}
						}
					}
					dataService.onQtoDetailBoqItemChange = new PlatformMessenger();
					// validate the items to set the ok button status
					dataService.getValidation2Items = function () {
						let isValidate = false;
						for (let i = 0; i < data.itemList.length; i++) {
							let item = data.itemList[i];
							if (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.BoqItemFk) {
								isValidate = true;
								break;
							}
						}

						dataService.onQtoDetailBoqItemChange.fire(isValidate);
					};

					return dataService;
				}

				return defer.promise;
			}

			return service;
		}
	]);
})(angular);

/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var basicsTaxCodeModule = angular.module('basics.taxcode');

	basicsTaxCodeModule.factory('basicsTaxCodeMatrixService', ['$injector', 'platformDataServiceFactory', 'basicsTaxCodeMainService','ServiceDataProcessDatesExtension',

		function ($injector, platformDataServiceFactory, parentService,DatesProcessor) {
			var basicsTaxCodeServiceOption = {
				flatLeafItem: {
					module: basicsTaxCodeModule,
					serviceName: 'basicsTaxCodeMatrixService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/', endCreate: 'createnew' },
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/', endUpdate: 'updatetcm'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/', endRead: 'listtcm'},
					httpDelete: {route: globals.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/', endDelete: 'deletetcm'},
					entityRole: {
						leaf: {
							itemName: 'TaxCodeMatrix',
							parentService: parentService
						}
					},
					translation: {
						uid: 'basicsTaxCodeMatrixService',
						title: 'basics.taxcode.entityTaxCodeMatrixTitle',
						columns: [{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						},{
							header: 'cloud.common.entityComment',
							field: 'CommentTranslateInfo'
						}]
					},
					presenter: {
						list: {
							handleCreateSucceeded: function initCreationData(newData) {
								var selectedItem = parentService.getSelected();
								if (selectedItem) {
									newData.MdcTaxCodeFk = selectedItem.Id;
								}
							}
						}
					},
					dataProcessor: [
						new DatesProcessor(['ValidFrom', 'ValidTo'])
					],
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsTaxCodeServiceOption);
			var service = serviceContainer.service;


			return service;

		}]);
})(angular);

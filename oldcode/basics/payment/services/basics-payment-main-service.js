(function (angular) {
	/* global globals */
	/* global angular */
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsPaymentMainService
	 * @function
	 *
	 * @description
	 * basicsPaymentMainService is the data service for all Payment related functionality.
	 */
	var moduleName= 'basics.payment';
	var paymentModule = angular.module(moduleName);
	paymentModule.factory('basicsPaymentMainService', ['_','platformDataServiceFactory','platformPermissionService','basicsPaymentMainValidationProcessor',

		function (_, platformDataServiceFactory, platformPermissionService, basicsPaymentMainValidationProcessor) {
			var factoryOptions = {
				flatRootItem: {
					module: paymentModule,
					serviceName: 'basicsPaymentMainService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/payment/', endRead: 'listfiltered', usePostForRead: true
					},
					translation: {
						uid: 'basicsPaymentMainService',
						title: 'basics.payment.listPaymentTitle',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' },
							{ header: 'basics.payment.PrintDescriptionInfo', field: 'PrintDescriptionInfo' },
							{ header: 'basics.payment.PrintTextDescriptionInfo', field: 'PrintTextDescriptionInfo', maxLength: 255 }],
						dtoScheme: { typeName: 'PaymentTermDto', moduleSubModule: 'Basics.Payment' }
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						root: {itemName: 'Payment', moduleName: 'cloud.desktop.moduleDisplayNamePayment',
							handleUpdateDone: function (updateData, response, data) {
								_.forEach(response.EffectedPayment, function (item) {
									var oldItem = _.find(data.itemList, {Id: item.Id});
									if (oldItem) {
										angular.extend(oldItem, item);
									}
								});
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};


			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = basicsPaymentMainValidationProcessor;
			var service= serviceContainer.service;

			//validation event
			service.mergeInDefaultValues = function mergeInDefaultValues(changedContries) {
				_.forEach(changedContries, function(payment) {
					var oldValue = _.find(serviceContainer.data.itemList, { Id: payment.Id } );
					oldValue.IsDefault = payment.IsDefault;
					serviceContainer.data.itemModified.fire(null, oldValue);
				});
			};


			if (platformPermissionService.hasRead('24790afafd35416595ef14527d0ba021')) {
				service.load();
			}
			return service;

		}]);
})(angular);

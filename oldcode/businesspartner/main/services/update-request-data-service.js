/**
 * Created by luy on 6/20/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainUpdateRequestDataService
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 *
	 * @description Provide bank data service
	 */
	angular.module(moduleName).factory('businesspartnerMainUpdateRequestDataService',
		['$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService', 'platformRuntimeDataService', 'globals',
			/* jshint -W072 */
			function ($http, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService, platformRuntimeDataService, globals) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainUpdateRequestDataService',
						entityRole: {leaf: {itemName: 'BpdUpdateRequest', parentService: businesspartnerMainHeaderDataService}},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/updaterequest/', endRead: 'list'},
						presenter: {list: {incorporateDataRead: incorporateDataRead}}
					}
				};
				var readonlyFields = ['Updatesource', 'Updatetable', 'Updatecolumn', 'ObjectFk', 'ObjectFkDescription', 'ObjectFkNew', 'OldValue', 'NewValue', 'NewValueDescription'];
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				var bpStatusFk = 'AccessRightDescriptorFk';

				serviceContainer.service.canUpdateRequest = function () {
					if (serviceContainer.data.itemList.length <= 0 || businesspartnerMainHeaderDataService.getItemStatus().IsReadonly) {
						return false;
					} else {
						return true;
					}
				};

				serviceContainer.service.UpdateRequests = function () {
					var item = businesspartnerMainHeaderDataService.getSelected();
					if (item) {

						$http.post(globals.webApiBaseUrl + 'businesspartner/main/updaterequest/update?mainItemId=' + item.Id).then(function (request) {
							var currentList = [];
							if (request.data) {
								currentList = request.data;
							}

							updateList(currentList);
							serviceContainer.service.gridRefresh();
						});
					}
				};

				return serviceContainer.service;

				function incorporateDataRead(readData, data) {
					var item = businesspartnerMainHeaderDataService.getSelected();
					if (item) {
						var isEditName = businesspartnerMainHeaderDataService.isEditName(item.BusinessPartnerStatusFk);
						if ((!isEditName) || !businesspartnerMainHeaderDataService.isBpStatusHasRight(item, bpStatusFk, 'statusWithEidtRight')) {
							setReadonly(readData, true);
						}
					}
					basicsLookupdataLookupDescriptorService.attachData(readData);

					return data.handleReadSucceeded(readData, data);
				}

				function setReadonly(items, status) {
					var fields = getReadonlyFields(readonlyFields, status);
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, fields);
					});
				}

				function getReadonlyFields(fields, status) {
					var readonlyFields = ['Updatesource', 'Updatetable', 'Updatecolumn', 'ObjectFk', 'ObjectFkDescription', 'ObjectFkNew', 'OldValue', 'NewValue', 'NewValueDescription'];
					if (status === true) {
						readonlyFields.push('Isaccepted');
						readonlyFields.push('CommentText');
					}

					_.forEach(fields, function (field) {
						readonlyFields.push({field: field, readonly: status});
					});
					return readonlyFields;
				}

				function updateList(items) {
					serviceContainer.data.itemList.length = 0;
					_.forEach(items, function (item) {
						serviceContainer.data.itemList.push(item);
					});

					serviceContainer.data.listLoaded.fire();
				}
			}]
	);
})(angular);
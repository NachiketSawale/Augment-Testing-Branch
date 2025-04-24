/**
 * Created by chi on 2018/4/3.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonAddressDialogHandler', basicsCommonAddressDialogHandler);

	basicsCommonAddressDialogHandler.$inject = ['$q', '$http', '$timeout', '_', 'platformModalService', 'basicsCommonMapKeyService', 'basicsCommonAddressDialogCommonService', 'globals'];

	function basicsCommonAddressDialogHandler($q, $http, $timeout, _, platformModalService, basicsCommonMapKeyService, basicsCommonAddressDialogCommonService, globals) {
		let recordState = basicsCommonAddressDialogCommonService.recordState;

		return {
			handler: handler
		};

		// ///////////////////////////////
		function handler($scope, validationService, httpService) {
			let currentStateId = $scope.currentItem ? $scope.currentItem.StateFk : null;
			let updateOptions = httpService.updateOptions($scope, 'basics/common/address/getformattedaddresswithaddrtemplate', (request, res) => {
				const searchFields = ['City', 'County']; // JIRA DEV-7953, DEV-22806, Maybe all the fields related to address should be including in search.
				let searchAddress = res.data.Address;
				if (searchAddress && !$scope.currentItem.isShowMapForRadiusSearch) {
					searchFields.forEach(field => {
						const fieldValue = request[field];
						if (fieldValue && searchAddress.indexOf(fieldValue) === -1) {
							searchAddress = searchAddress + ',' + fieldValue;
						}
					});
				}

				_.extend(res.data, {
					// JIRA DEV-7953, DEV-22806, This field is use only for trigger search action, will not be used to search the addresses.
					SearchAddress: searchAddress
				});
				return res;
			});

			let setReadonly = function (value) {
				$scope.setReadonly($scope.currentItem, [
					{field: 'Street', readonly: !!value},
					{field: 'ZipCode', readonly: !!value},
					{field: 'City', readonly: !!value},
					{field: 'County', readonly: !!value},
					{field: 'CountryFk', readonly: !!value},
					{field: 'StateFk', readonly: !!value},
					// {field:'Latitude',readonly: !!value},
					// {field:'Longitude',readonly: !!value},
					{field: 'Address', readonly: !value}
				]);
			};

			let unwatchZipCode = $scope.$watch('currentItem.ZipCode', updateOptions.updateFmt);
			let unwatchCity = $scope.$watch('currentItem.City', updateOptions.updateFmt);
			let unwatchStreet = $scope.$watch('currentItem.Street', updateOptions.updateFmt);
			let unwatchCounty = $scope.$watch('currentItem.County', updateOptions.updateFmt);
			let unwatchLatitude = $scope.$watch('currentItem.Latitude', updateOptions.updateData);
			let unwatchLongitude = $scope.$watch('currentItem.Longitude', updateOptions.updateData);
			let unwatchSupplement = $scope.$watch('currentItem.Supplement', updateOptions.updateData);
			let unwatchStateFk = $scope.$watch('currentItem.StateFk', updateOptions.updateFmt);

			// watch property change and update address format
			let unwatchCountryFk = $scope.$watch('currentItem.CountryFk', function (newVal, oldValue) {
				let isStateVisible = recordState(newVal);
				$scope.setVisible($scope.currentItem, [{field: 'StateFk', visible: isStateVisible}]);

				if (newVal !== oldValue) {
					setDefaultState(newVal, isStateVisible).then(
						function () {
							updateOptions.updateFmt(newVal, oldValue);
						}
					);
				} else {
					currentStateId = $scope.currentItem.StateFk;
					updateOptions.updateFmt(newVal, oldValue);
				}
			});
			let unwatchAddress = $scope.$watch('currentItem.Address', function (newVal, oldValue) {
				if (!angular.equals(newVal, oldValue) && $scope.currentItem.AddressModified) {
					updateOptions.updateFmt(newVal, oldValue);
				}
			});
			let unwatchAddressModified = $scope.$watch('currentItem.AddressModified', function (value) {
				setReadonly(value);
				if (!value) {
					updateOptions.updateFmt(arguments[0], arguments[1]);
				}
				updateOptions.updateData(arguments[0], arguments[1]);
			});

			let okBtn = null;
			let unwatchMapMessage = $scope.$watch('currentItem._messageName', function editOkBtn(newValue, oldValue) {
				if(isLocationSearchDialog) {
					if (newValue) {
						if (!okBtn) {
							okBtn = $scope.buttons.find(x => x.context$tr$.includes('ok'));
						}
						if (okBtn) {
							const disable = newValue !== 'searchCompleted';
							okBtn.disabled = () => {
								return disable;
							}
						}
					}
				}
			});

			$timeout(function () {
				let isStateVisible = recordState($scope.currentItem.CountryFk);
				$scope.setVisible($scope.currentItem, [{field: 'StateFk', visible: isStateVisible}]);
				setReadonly($scope.currentItem.AddressModified);

				if (currentStateId === null) {
					setDefaultState($scope.currentItem.CountryFk, isStateVisible).then(
						function () {
							updateOptions.updateFmt($scope.currentItem.CountryFk, 0);
						}
					);
				}
			}, 500);

			$scope.showMap = basicsCommonMapKeyService.mapOptions.showByDefault;

			/* $scope.buttons.push({
				context$tr$:'basics.common.settings',
				execute:function() {
					platformModalService.showDialog({
						templateUrl: 'basics.common/templates/dialog-map-settings.html'
					});
				}
			}); */

			const isLocationSearchDialog = $scope.formOptions.configure.rows.length > 0 && $scope.formOptions.configure.rows.find(row => row.options && row.options.isLocationSearchDialog);

			if (!isLocationSearchDialog) {
				$scope.buttons.push({
					context$tr$: 'cloud.common.addressDialogMap',
					execute: function () {
						$scope.showMap = !$scope.showMap;
					}
				});
			}

			$scope.beforeOk = function (item, setLocalStorage) {
				setLocalStorage({CountryFk: item.CountryFk});
				updateOptions.updateItemFormat();
			};
			$scope.$on('$destroy', function () {
				$scope.$close();
				unwatchZipCode();
				unwatchCity();
				unwatchStreet();
				unwatchCounty();
				unwatchStateFk();
				unwatchCountryFk();
				unwatchAddress();
				unwatchAddressModified();
				unwatchLatitude();
				unwatchLongitude();
				unwatchSupplement();
				unwatchMapMessage();
			});

			function setDefaultState(newVal, isStateVisible) {
				let defer = $q.defer();

				if (!isStateVisible) {
					$scope.currentItem.StateFk = null;
					defer.resolve();
				} else {
					$http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=state&filtervalue=(CountryFk=' + newVal + ')'
					}).then(
						function (response) {
							let items = response.data;
							if (items && items.length > 0) {
								items = _.filter(items, function (item) {
									return item.CountryFk === newVal;
								});

								if (items && items.length > 0) {
									items = items.sort(function (a, b) {
										return a.Sorting - b.Sorting;
									});
									$scope.currentItem.StateFk = items[0].Id;
								}
							}
							defer.resolve();
						}
					);
				}

				return defer.promise;
			}
		}
	}
})(angular);
/**
 * Created by reimer on 16.04.2015.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.characteristic';

	// angular.module(moduleName).run(['$templateCache', function ($templateCache) {
	//	$templateCache.loadTemplateFile('basics.characteristic/templates/basics-characteristic-code-popup.html');
	// }]);

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicCodeLookup
	 * @function
	 *
	 * @description
	 * lookup for characteristic code combo with popup
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('basicsCharacteristicDataCodeLookup',
		['basicsCharacteristicCodeLookupService',
			'$q',
			'platformModalService',
			'BasicsLookupdataLookupDirectiveDefinition',
			'$templateCache',
			'$injector',
			'$translate',
			'basicsLookupdataLookupFilterService',
			'basicsCharacteristicPopupGroupService',
			function (basicsCharacteristicCodeLookupService,
				$q,
				platformModalService,
				BasicsLookupdataLookupDirectiveDefinition,
				$templateCache,
				$injector,
				$translate,
				basicsLookupdataLookupFilterService,
				basicsCharacteristicPopupGroupService) {

				var lookupOptions = {};

				var defaults = {
					lookupType: 'basicsCharacteristicCodeLookup',
					valueMember: 'Id',
					// displayMember: 'Code',
					displayMember: 'Code',
					uuid: 'af78a8c028c246f898e8a3922b25f536',
					dialogUuid: '6f87889353df42498439d22be6b785b2',
					columns: [
						// { id: 'id', field: 'Id', name: 'Id', width: 100 },
						{id: 'code', field: 'Code', name: 'Code', formatter: 'code', width: 80, name$tr$: 'cloud.common.entityCode'},
						{id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription'}
					],
					width: 500,
					height: 200,
					// onDataRefresh: function ($scope) {   --> see controller
					// basicsCharacteristicCodeLookupService.refresh($scope.getSectionId());
					// $scope.options.sectionId);
					// }
					// filterKey: 'basicsCharacteristicDataCodeLookupFilter',
					// filter: function (item) {   --> does not work?
					// console.log('hurra');
					// },
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {

					controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
						angular.extend(lookupOptions, $scope.options);

						// region module vars
						var _sectionId = $scope.lookupOptions.sectionId;
						var _removeUsed = $scope.lookupOptions.removeUsed || false;
						var _characteristicDataService = $scope.lookupOptions.characteristicDataService;
						var _needButtons = ($scope.lookupOptions.needButtons !== null && angular.isDefined($scope.lookupOptions.needButtons)) ? $scope.lookupOptions.needButtons : true;
						// endregion

						// var filter = {
						//	key: 'basicsCharacteristicDataCodeLookupFilter',
						//	serverSide: false,
						//	fn: function (item) {
						//		// return item.sectionId === $scope.getSectionId();
						//		return true;
						//	}
						// };
						//
						// if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						//	basicsLookupdataLookupFilterService.registerFilter(filter);
						// }

						var setupLookup = function () {

							// setup context for popup window
							basicsCharacteristicCodeLookupService.sectionId = _sectionId;
							basicsCharacteristicCodeLookupService.removeUsed = _removeUsed;
							basicsCharacteristicCodeLookupService.characteristicDataService = _characteristicDataService;

							var deffered = $q.defer();
							var groups = basicsCharacteristicPopupGroupService.loadData(_sectionId);
							var codes = basicsCharacteristicCodeLookupService.getListForLookup(_sectionId, _removeUsed, _characteristicDataService);
							$q.all([groups, codes]).then(function (data) {
								deffered.resolve(data[1]);
							});

							return deffered.promise;

						};

						// setup data provider
						$scope.lookupOptions.dataProvider.getList = function () {
							return setupLookup();
						};

						$scope.lookupOptions.dataProvider.getItemByKey = function (value) {
							return basicsCharacteristicCodeLookupService.loadItemsAndGetById(_sectionId, value);
						};

						$scope.lookupOptions.dataProvider.getSearchList = function (filterString, displayMember, scope, setting) { // jshint ignore:line
							return basicsCharacteristicCodeLookupService.getListForLookup(_sectionId, _removeUsed, _characteristicDataService);
						};

						$scope.lookupOptions.onDataRefresh = function (scope) {

							basicsCharacteristicCodeLookupService.refresh(_sectionId).then(function () {
								setupLookup().then(function (data) {
									scope.updateData(data);
								});
							});

						};

						var template = null;

						var init = function () {
							$templateCache.loadTemplateFile('basics.characteristic/templates/basics-characteristic-code-popup.html').then(function () {
								// sectionId will be passed by basicsCharacteristicCodeLookupService setter!
								// pass the sectionId to the popup controller
								// template = $templateCache.get('basics-characteristic-code-popup.html').replace('$$sectionId$$', $scope.getSectionId());
								template = $templateCache.get('basics-characteristic-code-popup.html');
							});

						};
						init();

						var onOpenPopupClicked = function () {

							var modalOptions = {
								// templateUrl: globals.appBaseUrl + 'basics.characteristic/templates/basics-characteristic-code-popup.html',
								template: template,
								headerText: $translate.instant('basics.characteristic.header.codeLookup'),
								backdrop: false,
								windowClass: 'form-modal-dialog',
								value: {selectedId: -1}  // object that will be returned
							};

							setupLookup().then(function () {

								platformModalService.showDialog(modalOptions
								).then(function (result) {
									if (result && result.value.selectedId !== -1 && result.value.selectedIds.length === 1) {
										if (_characteristicDataService.fireItemValueUpdate) {
											fireCharacteristicItemChange($scope.entity.CharacteristicFk, result.value.selectedId);
										}

										// $scope.entity.CharacteristicFk = result.value.selectedId;  // characteristic id!
										if ($scope.$parent.setCharacteristicId) {
											$scope.$parent.setCharacteristicId(result.value.selectedId);
										} else {
											$scope.entity.CharacteristicFk = result.value.selectedId;  // characteristic id!
										}
									} else if (result && result.value.selectedIds.length > 1) {
										// Multiple selection
										var charsFks = angular.copy(result.value.selectedIds);

										// Merge first charFk
										fireCharacteristicItemChange($scope.entity.CharacteristicFk, _.first(charsFks));

										// Remove first one which will be updated directly in the selected $scope.entity
										charsFks.shift();

										_characteristicDataService.createItemsAndAssignData(null, charsFks);
									}
								});
							});
						};

						function fireCharacteristicItemChange(CharacteristicFk, selectedId) {
							if (CharacteristicFk === 0) {
								_characteristicDataService.getItemByCharacteristicFk(selectedId).then(function (data) {
									$scope.entity.CharacteristicEntity = data;
									$scope.entity.CharacteristicGroupFk = data.CharacteristicGroupFk;
									$scope.entity.CharacteristicTypeFk = data.CharacteristicTypeFk;
									$scope.entity.CharacteristicFk = selectedId;
									$scope.entity.isValueChange = false;
									_characteristicDataService.fireItemValueUpdate($scope.entity);
								});
							} else {
								_characteristicDataService.getItemByCharacteristicFk(CharacteristicFk).then(function (data) {
									$scope.entity.OldCharacteristicEntity = data;
									_characteristicDataService.getItemByCharacteristicFk(selectedId).then(function (item) {
										$scope.entity.CharacteristicEntity = item;
										$scope.entity.CharacteristicGroupFk = item.CharacteristicGroupFk;
										$scope.entity.CharacteristicTypeFk = item.CharacteristicTypeFk;
										$scope.entity.CharacteristicFk = selectedId;
										$scope.entity.isValueChange = false;
										_characteristicDataService.fireItemValueUpdate($scope.entity);
									});
								});
							}
						}

						$scope.$watch('$parent.sectionId', function (newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								// basicsCharacteristicCodeLookupService.getListForLookup(newVal, $scope.getRemoveUnused());
								setupLookup().then(function (data) {
									if ($scope.lookupOptions.setData) {
										$scope.lookupOptions.setData(data);
									}
								});

							}
						});

						var buttons = [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-lookup',
								execute: onOpenPopupClicked,
								canExecute: function () {
									return true;
								}
							}
						];
						if (_needButtons) {
							$.extend($scope.lookupOptions, {
								buttons: buttons
							});
						}
					}]
				});

				// return directive;

			}
		]);
})(angular);
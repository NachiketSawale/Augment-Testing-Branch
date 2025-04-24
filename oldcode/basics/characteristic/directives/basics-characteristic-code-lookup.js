/**
 * Created by reimer on 05.04.2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicCodeLookup
	 * @function
	 *
	 * @description
	 * lookup for characteristic code combo with popup
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('basicsCharacteristicCodeLookup',
		['basicsCharacteristicCodeLookupService',
			'$q',
			'_',
			'platformModalService',
			'BasicsLookupdataLookupDirectiveDefinition',
			'$templateCache',
			'$injector',
			'basicsLookupdataLookupFilterService',
			'basicsCharacteristicPopupGroupService',
			'basicsCharacteristicMainService',
			'basicsCharacteristicCharacteristicService',
			function (basicsCharacteristicCodeLookupService,
				$q,
				_,
				platformModalService,
				BasicsLookupdataLookupDirectiveDefinition,
				$templateCache,
				$injector,
				basicsLookupdataLookupFilterService,
				basicsCharacteristicPopupGroupService,
				basicsCharacteristicMainService,
				parentService) {

				var lookupOptions = {};

				var defaults = {
					lookupType: 'basicsCharacteristicCodeLookup',
					valueMember: 'Id',
					// displayMember: 'Code',
					displayMember: 'Code',
					uuid: 'af78a8c028c246f898e8a3922b25f536',
					dialogUuid: 'ed958bf07ac342dbb471d65f3fad7cc9',
					columns: [
						// { id: 'id', field: 'Id', name: 'Id', width: 100 },
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							width: 80,
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'desc',
							field: 'DescriptionInfo.Translated',
							name: 'Description',
							width: 150,
							name$tr$: 'cloud.common.entityDescription'
						},
					],
					width: 500,
					height: 200,
					// onDataRefresh: function ($scope) {   --> see controller
					//	basicsCharacteristicCodeLookupService.refresh($scope.getSectionId()); // $scope.options.sectionId);
					// }
					// filterKey: 'basicsCharacteristicDataCodeLookupFilter',
					// filter: function (item) {   --> does not work?
					//		console.log('hurra');
					// },
				};

				function getList() {
					var entity = basicsCharacteristicMainService.getSelected(); // group
					var groupId = (entity !== null) ? entity.Id : null;

					var parentEntity = parentService.getSelected(); // characteristic
					var parentId = (parentEntity !== null) ? parentEntity.Id : null;

					return basicsCharacteristicCodeLookupService.getListByGroup(groupId, parentId);

				}

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {

					dataProvider: {

						getList: getList,

						getItemByKey: function (value) {

							return basicsCharacteristicCodeLookupService.getById(value);

						},

						getSearchList: getList
					},
					/* jshint -W098 */
					controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
						angular.extend(lookupOptions, $scope.options);
						// region module vars
						let sectionId = $scope.lookupOptions.sectionId;
						let removeUsed = $scope.lookupOptions.removeUsed || false;
						let characteristicDataService = $scope.lookupOptions.characteristicDataService;
						let mainService = $scope.lookupOptions.mainService;
						let contextId = null;
						if (mainService) {
							contextId = $injector.get(mainService).getSelected().Id;
						}

						let setupLookup = function () {
							basicsCharacteristicCodeLookupService.sectionId = sectionId;
							basicsCharacteristicCodeLookupService.removeUsed = removeUsed;
							basicsCharacteristicCodeLookupService.characteristicDataService = characteristicDataService;
							basicsCharacteristicCodeLookupService.mainService = mainService;
							var deffered = $q.defer();

							// get by context for selected entity if mainService is given
							if (sectionId && mainService && contextId) {
								let characteristics = basicsCharacteristicCodeLookupService.loadDataByContextId(sectionId, contextId);
								$q.all([characteristics]).then(function (data) {
									let resultList = data[0];
									let characteristics = [];
									_.forEach(resultList, function (result) {
										characteristics.push(result.CharacteristicEntity);
									});
									deffered.resolve(characteristics);
								});
								// default by sectionId => returns all characteristics that belongs to the given sectionId
							} else if (sectionId) {
								let codes = basicsCharacteristicCodeLookupService.getListForLookup(sectionId, removeUsed, characteristicDataService);
								$q.all([codes]).then(function (data) {
									deffered.resolve(data[0]);
								});
							}
							return deffered.promise;
						};

						// setup data provider
						$scope.lookupOptions.dataProvider.getList = function () {
							return setupLookup();
						};

						$scope.lookupOptions.dataProvider.getItemByKey = function (value) {
							return basicsCharacteristicCodeLookupService.loadItemsAndGetById(sectionId, value);
						};

						$scope.lookupOptions.onDataRefresh = function (scope) {
							basicsCharacteristicCodeLookupService.refresh(sectionId).then(function () {
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

						// no code popup
						// 	var onOpenPopupClicked = function () {
						//
						// 		var modalOptions = {
						// 			// templateUrl: globals.appBaseUrl + 'basics.characteristic/templates/basics-characteristic-code-popup.html',
						// 			template: template,
						// 			backdrop: false,
						// 			windowClass: 'form-modal-dialog',
						// 			value: { selectedId: -1 }  // object that will be returned
						// 		};
						//
						// 		platformModalService.showDialog(modalOptions).then(
						// 			function (result) {
						// 					if (result && result.value.selectedId !== -1) {
						// 						// $scope.entity.CharacteristicFk = result.value.selectedId;  // characteristic id!
						// 						// if ($scope.$parent.setCharacteristicId) {
						// 						// 	$scope.$parent.setCharacteristicId(result.value.selectedId);
						// 						// }
						// 						// else {
						// 						// 	$scope.entity.CharacteristicFk = result.value.selectedId;  // characteristic id!
						// 						// }
						// 						$scope.entity.CharacteristicFk = result.value.selectedId;  // characteristic id!
						// 					}
						// 				}
						// 		);
						//
						// 	};
						//
						// 	// $scope.$watch('$parent.sectionId', function(newVal, oldVal) {
						// 	// 	if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
						// 	// 		// basicsCharacteristicCodeLookupService.getListForLookup(newVal, $scope.getRemoveUnused());
						// 	// 		setupLookup().then(function(data) {
						// 	// 			if ($scope.lookupOptions.setData) {
						// 	// 				$scope.lookupOptions.setData(data);
						// 	// 			}
						// 	// 		});
						// 	//
						// 	// 	}
						// 	// });
						//
						// 	var buttons = [
						// 		{
						// 			img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-lookup',
						// 			execute: onOpenPopupClicked,
						// 			canExecute: function () {
						// 				return true;
						// 			}
						// 		}
						// 	];
						// 	$.extend($scope.lookupOptions, {
						// 		buttons: buttons
						// 	});

					}]
				});

			}
		]);
})(angular);
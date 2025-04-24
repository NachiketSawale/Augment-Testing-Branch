(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	/**
	 * @ngdoc directive
	 * @name basicsCommomChangeStatusEditor:
	 * @element div
	 * @restrict A
	 * @description Editor for all the status change
	 */
	angular.module(moduleName).directive('basicsCommomChangeStatusEditor',
		['$http', '$q', 'basicsCommonChangeStatusService', '$timeout', 'platformObjectHelper', 'globals', '_', '$', '$injector',
			function ($http, $q, basicsCommonChangeStatusService, $timeout, platformObjectHelper, globals, _, $, $injector) {
				function changeStatusEditorController($scope) {

					$scope.ifReadOnlyTrue = false; // variable for Next button visibility

					const sliderControl = $('#slider-vertical');

					function goToStatusByIndex(index) {
						$timeout(function () {
							sliderControl.slider('value', index);
						}); // jshint ignore:line
					}

					/**
					 * @ngdoc function
					 * @name goUpStatus
					 * @function
					 * @methodOf changeStatusEditorController
					 * @description Go up one step for the available status
					 */
					$scope.goUpStatus = function () {
						const index = sliderControl.slider('value');
						for (let i = index + 1; i < $scope.entities.length; i++) {
							if ($scope.entities[i].available) {
								goToStatusByIndex(i);
								return;
							}
						}
					};


					/**
					 * @ngdoc function
					 * @name goDownStatus
					 * @function
					 * @methodOf changeStatusEditorController
					 * @description Go down one step for the available status
					 */
					$scope.goDownStatus = function () {
						const index = sliderControl.slider('value');
						let readOnlyFound = false; // Flag to track if a 'Readonly Access' entity is found
					
						for (let i = index - 1; i >= 0; i--) {
							if ($scope.entities[i].available) {

								if ($scope.entities[i].Id === 1000238) 
								{
									readOnlyFound = true; // Set the flag to true if 'Readonly Access' entity is found
								}
								goToStatusByIndex(i); // Move the slider to the found index
								break; // Exit the loop once an available entity is found
							}
						}
					
						// Update the visibility of the "Next" button based on whether 'Readonly Access' entity is found
						$scope.ifReadOnlyTrue = readOnlyFound;
					};
					
					

					/**
					 * @ngdoc function
					 * @name onClickStatus
					 * @function
					 * @methodOf changeStatusEditorController
					 * @description Set the status by direct click
					 * @param {Object}  status  the status object go to directly
					 */
					$scope.onClickStatus = function (status) {
						if (status.available) {
							let readOnlyFound = false; // Flag to track if a 'Readonly Access' entity is found
					
							if (status.Id === 1000238) {
								readOnlyFound = true; // Set the flag to true if 'Readonly Access' status is encountered
							}
					
							$scope.ifReadOnlyTrue = readOnlyFound; // Update the visibility of the "Next" button
					
							goToStatusByIndex($scope.entities.indexOf(status)); // Move to the clicked status
						}
					};
					
					

					$scope.rowDoubleClick = function (status) {
						if (status.available) {
							let readOnlyFound = false;
							if (status.Id === 1000238)
							{
								readOnlyFound = true; 
							}

							$scope.ifReadOnlyTrue = readOnlyFound; 

							goToStatusByIndex($scope.entities.indexOf(status));
							$scope.modalOptions.ok();
						}
					};

					/**
					 * @ngdoc function
					 * @name getStatusDescription
					 * @function
					 * @methodOf changeStatusEditorController
					 * @description return the status description from current status data
					 * @param {Object}  status  status data
					 * @returns {String}
					 */
					$scope.getStatusDescription = function (status) {
						return platformObjectHelper.getValue(status, $scope.options.statusDisplayField);

					};

					function watchStatusChange() {
						$scope.$watch('options.showAvailableStatusFlg', function (newValue, oldValue) {
							if (!_.isUndefined(newValue) && newValue !== oldValue) {
								if (newValue) {
									$scope.entities = _.filter($scope.allEntities, function (item) {
										return item.available === true;
									});
								} else {
									$scope.entities = $scope.allEntities;
								}
								const len = $scope.entities.length - 1;
								const value = _.findIndex($scope.entities, { Id: $scope.options.toStatusId });
								setSlider({ max: len, value: value });
							}
						});
					}

					/**
					 * @ngdoc
					 * @name sliderSlide
					 * @description call function when changing the slide control
					 */
					function sliderSlide(event, ui) {
						if (!$scope.entities[ui.value].available) {
							event.preventDefault();
						}
					}

					/**
					 * @ngdoc
					 * @name sliderValueChanged
					 * @description call function when changed the slide control
					 */
					function sliderValueChanged(event, ui) {
						const status = $scope.entities[ui.value];

						$scope.options.toStatusId = status.Id;
						$scope.options.statusItem = status;
						// this use to refresh the ui binding.
						// if remove it, when changed the slider, the select item will not update real time.
						$('#change-status-editor').click();

					}

					/**
					 * @ngdoc function
					 * @name setTitle
					 * @function
					 * @methodOf changeStatusEditorController
					 * @description Set the title of the editor
					 */
					function setTitle() {
						$scope.title = '';
						if ($scope.options.getDisplay && angular.isFunction($scope.options.getDisplay)) {
							$scope.title = $scope.options.getDisplay($scope.options.entities);
						} else {
							const titles = [];
							_.forEach($scope.options.entities, function (entity) {
								const code = platformObjectHelper.getValue(entity, $scope.options.codeField || '');
								const description = platformObjectHelper.getValue(entity, $scope.options.descField || '');
								let title;
								if (code) {
									title = code;
								}
								if (description) {
									if (code) {
										title = code + ' - ' + description;
									} else {
										title = description;
									}
								}
								if (!_.isNil(title)) {
									titles.push(title);
								}
							});
							if (!_.isNil(titles)) {

								if (titles.length > 3) {
									const shortTiles = titles.slice(0, 3);
									$scope.title = shortTiles.join(',') + '...';
								} else {
									$scope.title = titles.join(',');
								}

							}
						}
					}

					const statusRequest = [basicsCommonChangeStatusService.getStatusList($scope.options)];

					statusRequest.push(basicsCommonChangeStatusService.getAvailableStatus($scope.options));


					$q.all(statusRequest)
						.then(function (values) {

							const status = values[0];
							if (_.isNil(status)) {
								return;
							}
							const _status = angular.copy(status);
							const allStatus = _.sortBy(_status, ['Sorting', 'sorting', 'Id']);

							let availableStatus = values[1] || [];
							if ($scope.options.dataService && angular.isFunction($scope.options.dataService.getAvailableStatusCustom)) {
								availableStatus = $scope.options.dataService.getAvailableStatusCustom($scope.options, availableStatus);
							}
							availableStatus.push($scope.options.fromStatusId);
							availableStatus.forEach(function (id) {
								const entity = _.find(allStatus, { Id: id });
								if (!_.isNil(entity)) {
									entity.available = true;
								}
							});
							if (allStatus[0].hasOwnProperty('BackGroundColor')) {
								if (allStatus[0].BackGroundColor !== 0) {
									$scope.options.isColorBackGround = true;
									for (let i = 0; i < allStatus.length; i++) {
										if (!_.isNil(allStatus[i].BackGroundColor)) {
											allStatus[i].BackGroundColor = _.padStart(allStatus[i].BackGroundColor.toString(16), 7, '#000000');
											allStatus[i].colorText = '--icon-color-1:' + allStatus[i].BackGroundColor + ';--icon-color-2:' + allStatus[i].BackGroundColor + ';--icon-color-3: ' + allStatus[i].BackGroundColor + ';--icon-color-4: ' + allStatus[i].BackGroundColor + ';--icon-color-5: ' + allStatus[i].BackGroundColor + ';--icon-color-6: ' + allStatus[i].BackGroundColor;
										}
										allStatus[i].svgHref = globals.appBaseUrl + 'cloud.style/content/images/status-icons.svg#' + $injector.get('platformStatusIconService').select(allStatus[i]).substr($injector.get('platformStatusIconService').select(allStatus[i]).indexOf(' ') + 1);
									}
								}
							}
							$scope.allEntities = allStatus;

							$scope.entities = $scope.options.showAvailableStatusFlg ? _.filter(allStatus, function (item) {
								return item.available === true;
							}) : allStatus;

							$scope.options.toStatusId = _.findIndex($scope.entities, {
								Id: $scope.options.toStatusId,
								available: true
							}) === -1 ? $scope.options.fromStatusId : $scope.options.toStatusId;

							const len = $scope.entities.length;
							const value = _.findIndex($scope.entities, { Id: $scope.options.toStatusId });
							sliderControl.slider({
								orientation: 'vertical',
								min: 0,
								max: len - 1,
								value: value,
								animate: true,
								slide: sliderSlide,// call function when changing the slide control
								change: sliderValueChanged// call function when changed the slide control
							});

							setSlider();

							watchStatusChange();

						});

					setTitle();

					function setSlider(opt) {
						setTimeout(function () {
							if (!_.isNil(opt)) {
								sliderControl.slider('option', { 'max': opt.max, 'value': opt.value });
							}

							let totalHeight = 0;
							const $changeStatusDetailItem = $('.change-status-detail-item');
							$.each($changeStatusDetailItem, function (i, item) {
								totalHeight += $(item).height() + 6;
							});
							sliderControl.css('height', (totalHeight - 30) + 'px');
							// fixed the issue: #106059, Status Change - Focus/Scroll to current status
							const selLi = $('.change-status-detail-item-select').parent('li');
							const idx = $changeStatusDetailItem.index(selLi);
							let currentHeight = 0;
							$.each($changeStatusDetailItem, function (i, item) {
								if (i > idx) {
									return false;
								}
								currentHeight += $(item).height() + 6;
							});
							const sectinModalBody = $('section.modal-body');
							const title = $('.change-status-editor-title');
							const zoomImg = $('.zoom-img');
							const currentTotalHeight = currentHeight + parseInt(sectinModalBody.css('padding-top').replace('px', '')) * 2 + title[0].offsetHeight + zoomImg[0].offsetHeight;
							if (currentTotalHeight > sectinModalBody[0].offsetHeight) {
								sectinModalBody[0].scrollTop = currentTotalHeight - sectinModalBody[0].offsetHeight;
							} else {
								sectinModalBody[0].scrollTop = 0;
							}
						}, 0);

					}

				}

				return {
					restrict: 'A',
					templateUrl: globals.appBaseUrl + 'basics.common/templates/changestatus-editor.html',
					controller: ['$scope', changeStatusEditorController]
				};

			}]);
})(angular);
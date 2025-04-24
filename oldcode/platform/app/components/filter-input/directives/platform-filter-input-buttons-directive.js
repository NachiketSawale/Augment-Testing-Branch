/* global globals, moment */

(function () {
	'use strict';

	angular.module('platform').directive('platformFilterInputButtonsDirective', ['$timeout', '$templateCache', '$sanitize',
		function ($timeout, $templateCache, $sanitize) {


			const controller = ['$scope', function ($scope) {
			}];

			function linkFn($scope, $elem) {
				const uuid = $scope.$parent.getContainerUUID ? $scope.$parent.getContainerUUID() : '';
				const scopeRef = $scope;
				const elemRef = $elem;
				const filterBtnElems = $('.' + uuid).find(elemRef).find('.filterButton');
				const prevBtnElem = $('.' + uuid).find(elemRef).find('.filterButton.filterButtonPrev')[0];
				const nextBtnElem = $('.' + uuid).find(elemRef).find('.filterButton.filterButtonNext')[0];
				prevBtnElem.disabled = true;
				nextBtnElem.disabled = true;

				let filteredAssignments = [], selectedAssignment = {};

				setButtonsOnClickEvents(prevBtnElem, nextBtnElem);
				setButtonsFormat();

				const showFilterEventListener = $scope.$on('showFilterPanel', handleShowFilterPanel);
				const assignmentFilterChangedEventListener = $scope.$on('assignmentFilterChanged', handleAssignmentFilterChanged);

				function setButtonsOnClickEvents(prevBtn, nextBtn) {
					prevBtn.onclick = (e) => {
						selectPrevAssignment();
					};

					nextBtn.onclick = (e) => {
						selectNextAssignment();
					};
				}

				function handleAssignmentFilterChanged(event, newSelectedAssignment, newFilteredAssignment) {
					if(_.isArray(newFilteredAssignment) && newFilteredAssignment.length > 0) {
						filteredAssignments = newFilteredAssignment;
						selectedAssignment = newSelectedAssignment;
						updateFilterButtonsState();
					} else {
						prevBtnElem.disabled = true;
						nextBtnElem.disabled = true;
					}
				}


				function updateFilterButtonsState() {
					prevBtnElem.disabled = filteredAssignments.indexOf(selectedAssignment) === 0;
					nextBtnElem.disabled = selectedAssignment === filteredAssignments.at(-1);
				}


				function selectPrevAssignment() {
					if(!selectedAssignment.selectedFlag) {
						if(!_.isUndefined(scopeRef.$parent)){
							selectedAssignment = scopeRef.$parent.assignmentConfig.dataService.getSelected();
						}
					}
					if (filteredAssignments && selectedAssignment) {
						const indexOfSelected = filteredAssignments.indexOf(selectedAssignment);
						if (indexOfSelected > 0) {
							selectedAssignment = filteredAssignments[indexOfSelected - 1];
							scopeRef.$emit('selectAssignmentOnFilterChanged', selectedAssignment, elemRef);
						}
					}
					updateFilterButtonsState();
				}

				function selectNextAssignment() {
					if(!selectedAssignment.selectedFlag) {
						if(!_.isUndefined(scopeRef.$parent)){
							selectedAssignment = scopeRef.$parent.assignmentConfig.dataService.getSelected();
						}
					}
					if (filteredAssignments && selectedAssignment) {
						const indexOfSelected = filteredAssignments.indexOf(selectedAssignment);
						if (indexOfSelected < filteredAssignments.length - 1) {
							selectedAssignment  = filteredAssignments[indexOfSelected + 1];
							scopeRef.$emit('selectAssignmentOnFilterChanged', selectedAssignment, elemRef);
						}
					}
					updateFilterButtonsState();
				}

				function setButtonsFormat() {
					const styleStr = 'width: 28px; height:28px; --icon-main-color: var(--company-color); display: none';
					prevBtnElem.style.cssText = nextBtnElem.style.cssText = styleStr;
				}

				function handleShowFilterPanel(e, show) {
					prevBtnElem.style.display = nextBtnElem.style.display = show ? 'block' : 'none';
				}


				// un-register on destroy
				$scope.$on('$destroy', function () {
					assignmentFilterChangedEventListener(); // un-register the listener
					showFilterEventListener();
				});
			}

			return {
				restrict: 'EA',
				scope: {
					ngModel: '=',
					options: '='
				},
				templateUrl:  globals.appBaseUrl + 'app/components/filter-input/templates/platform-filter-input-buttons-template.html',
				controller: controller,
				link: linkFn
			};
		}
	]
	);
})();
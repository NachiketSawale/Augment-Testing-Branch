(function (angular) {
	'use strict';


	angular.module('qto.formula').controller('qtoFormulaScriptController',
		['$scope', 'qtoFormulaDataService', '$timeout','$translate',
			function ($scope, qtoFormulaDataService, $timeout,$translate) {

				$scope.options = {
					keyWords: [],
					events: [
						{name: 'changes', func: onCheckScript},
						{name: 'blur', func: onLostFocus}
					]
				};

				$scope.currentItem = null;
				$scope.isShown = false;

				/**
				 * set data to error
				 * @param isShow Show the error ui or not
				 * @param messageCol
				 * @param message
				 * @param type
				 */
				function setInfo(isShow, messageCol, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: messageCol,
						message: message,
						type: type
					};
				}

				$scope.showInfo = function (message) {
					setInfo(true, 1, message, 3);
				};

				$scope.hideInfo = function () {
					setInfo(false, 1, '', 0);
				};

				function onCheckScript(){
					var script = qtoFormulaDataService.getSelected().CalculationFormula;

					qtoFormulaDataService.parseScript(script).then(function (result) {
						if (result.IsSuccess) {
							$scope.hideInfo();
						}
						else {
							$scope.showInfo(result.ErrorInfo);
						}
					});
				}

				function onLostFocus(){
					qtoFormulaDataService.markCurrentItemAsModified();

				}

				function onChangeEditStatus(){
					var selectItem = qtoFormulaDataService.getSelected();
					$scope.isShown2 = false;
					if (selectItem !== null) {
						$scope.isShown = selectItem.QtoFormulaTypeFk ===3;
						$scope.isShown2 =  selectItem.QtoFormulaTypeFk !==3;
					}
					else{
						$scope.isShown = false;
						$scope.isShown2 = true;
					}

					if($scope.isShown === true){
						$timeout(function(){ // avoid the digest error
							$scope.$digest();
							$scope.currentItem = selectItem;
						});
					}else {
						$scope.isShown2 = true;
						$scope.overlayInfo = $translate.instant('qto.formula.scriptDefinitionText');
					}
				}

				qtoFormulaDataService.registerSelectionChanged(onChangeEditStatus);
				qtoFormulaDataService.changeSciptEditStatus.register(onChangeEditStatus);

				qtoFormulaDataService.getKeywords().then(function (keywords) {
					$scope.options.keyWords = keywords;
					onChangeEditStatus();
				});

				$scope.$on('$destroy', function () {
					qtoFormulaDataService.registerSelectionChanged(onChangeEditStatus);
					qtoFormulaDataService.changeSciptEditStatus.unregister(onChangeEditStatus);
				});
			}]);
})(angular);
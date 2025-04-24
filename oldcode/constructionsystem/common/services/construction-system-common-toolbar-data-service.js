/**
 * Created by chk on 10/13/2016.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */
	/* global CodeMirror,_ */
	var moduleName = 'constructionsystem.common';

	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemCommonToolBarService',
		['platformGridAPI','basicsCommonScriptEditorService',function (platformGridAPI,basicsCommonScriptEditorService) {
			var setToolBarItems = function ($scope, dataService) {
				var toolBarItems = [
					{
						id: 't1',
						sort: 110,
						caption: 'constructionsystem.scriptToolBar.error',
						type: 'check',
						value: dataService.isShowError,
						iconClass: 'tlb-icons ico-error',
						fn: dataService.getFilter('isShowError')
					},
					{
						id: 't2',
						sort: 111,
						caption: 'constructionsystem.scriptToolBar.warning',
						type: 'check',
						value: dataService.isShowWarning,
						iconClass: 'tlb-icons ico-warning',
						fn: dataService.getFilter('isShowWarning')
					},
					{
						id: 't3',
						sort: 112,
						caption: 'constructionsystem.scriptToolBar.info',
						type: 'check',
						value: dataService.isShowInfo,
						iconClass: 'tlb-icons ico-info',
						fn: dataService.getFilter('isShowInfo')
					},
					{
						id: 't4',
						sort: 113,
						caption: 'constructionsystem.scriptToolBar.filter',
						type: 'check',
						value: dataService.isFilterByInstance,
						iconClass: 'tlb-icons ico-filter',
						fn: dataService.getFilter('isFilterByInstance')
					},
					{
						id: 't5',
						sort: 114,
						caption: 'constructionsystem.common.caption.showCalculationOutput',
						type: 'check',
						value: dataService.isFilterByCalculation,
						iconClass: 'tlb-icons ico-result-calculation-show',
						fn: dataService.getFilter('isFilterByCalculation', function () {
							if(dataService.isFilterByCalculation) {
								dataService.isFilterByInstance = true;
								toolBarItems[3].value = true;
							}
						})
					}
				];

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolBarItems
				});

				var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				$scope.tools.items.splice(createBtnIdx, 1);

				function updateOutputResult(value){
					platformGridAPI.items.data($scope.gridId, _.isArray(value) && value.length === 0 ? [] : dataService.getList());
				}

				dataService.outPutResultChanged.register(updateOutputResult);

				function navToScript(){
					var selectedItem = dataService.getSelected();
					var scriptId = 'construction.system.master.script';
					var cm = basicsCommonScriptEditorService.getCm(scriptId);

					if (cm && selectedItem.Line > 0) {
						cm.setCursor(CodeMirror.Pos(selectedItem.Line - 1, selectedItem.Column));
						cm.focus();
					}
				}

				platformGridAPI.events.register($scope.gridId,'onDblClick',navToScript);

				$scope.$on('$destroy',function(){
					dataService.outPutResultChanged.unregister(updateOutputResult);
					platformGridAPI.events.unregister($scope.gridId,'onDblClick',navToScript);
				});
			};

			return {
				setToolBarItems: setToolBarItems
			};
		}]);

})(angular);
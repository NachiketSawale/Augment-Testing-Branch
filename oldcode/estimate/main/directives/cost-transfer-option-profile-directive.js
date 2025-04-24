/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let modulename = 'estimate.main';
	angular.module(modulename).directive('costTransferOptionProfile',['_','$injector', '$compile', 'platformModalService', '$translate', 'platformObjectHelper',
		function (_,$injector, $compile, platformModalService, $translate, platformObjectHelper) {
			return{
				restrict: 'A',
				scope: false,
				link: function(scope, elem, attrs){

					let options = (attrs.options ? scope.$eval(attrs.options) : {}) || {};
					let template = '<div class="input-group">@@buttonHtml@@</div>';

					let buttonHtml = '<span class="input-group-btn">' +
                        '<button class="btn btn-default control-icons ico-input-lookup input-sm" style="width:30px;height:26px;" data-ng-click="showDialog($event)" data-ng-disabled="disable()"></button>' +
                        '</span>';

					template = template.replace('@@buttonHtml@@', buttonHtml);

					scope.showDialog = showDialog;
					if (angular.isFunction(options.disable)){
                        scope.disable = options.disable;
                    }

					let content = $compile(template)(scope);

					elem.replaceWith(content);
					// //////////////////////////
					function showDialog(){

						let dlgOptions = {};
						dlgOptions.templateUrl = globals.appBaseUrl + 'estimate.main/templates/wizard/cost-transfer-option-profile-dialog.html';
						dlgOptions.backdrop = false;
						dlgOptions.height = '900px';
						dlgOptions.width = '1300px';
						dlgOptions.resizeable = true;
						dlgOptions.gridId = 'B3689C9341E84F749749783020CFC99A';
						dlgOptions.data = angular.copy(platformObjectHelper.getValue(scope, attrs.model || attrs.ngModel));
						dlgOptions.headerTextKey = options.headerTextKey || $translate.instant('basics.common.fieldSelector.uniqueFields.costTransferOptDialogTitle');
						dlgOptions.parentScope = scope.$parent;
						platformModalService.showDialog(dlgOptions).then(function (result) {
							if (result && result.isOk && result.data) {
								platformObjectHelper.setValue(scope, attrs.model || attrs.ngModel, result.data);
								platformObjectHelper.setValue(scope, 'entity.boqPackageAssignmentEntity.IsDirectCost', result.isDirectCost);
								platformObjectHelper.setValue(scope, 'entity.boqPackageAssignmentEntity.IsIndirectCost', result.isIndirectCost);
								platformObjectHelper.setValue(scope, 'entity.boqPackageAssignmentEntity.isMarkUpCost', result.isMarkUpCost);
							}

						});
					}
				}
			};
		}
	]);

})(angular);

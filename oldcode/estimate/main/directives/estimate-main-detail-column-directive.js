/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let modulename = 'estimate.main';
	angular.module(modulename).directive('estimateMainDetailColumnDirective',['_','$http', '$compile', '$translate','$injector',
		'basicsCommonStringFormatService','estimateMainSystemVariablesHelperService',
		function (_, $http, $compile, $translate, $injector
			,stringFormatService, systemVariablesService)   {
			return{
				restrict: 'AE',
				scope: false,
				link: function(scope, elem, attrs){

					let inputId = 'available-system-value-n-variables-input';
					let popupWinID = 'available-system-value-n-variables-popup-window';
					let tableId = 'available-system-value-n-variables-table';

					// let options = (attrs.options ? scope.$eval(attrs.options) : {}) || {};
					let template = '<div class="input-group lookup-container grid-container ng-scope">' +
						'<input type="text" id="'+inputId+'"  data-ng-model="' + (attrs.model || attrs.ngModel) + '" data-entity="entity" data-options="options" ng-click="clickEvent($event)" autocomplete="off">@@buttonHtml@@' +
						'</div>';

					let buttonHtml = '<button class="block-image tlb-icons ico-menu navigator_3620" title="Select " style="position: relative; margin: 2px 3px 0 0" data-ng-click="showDialog($event)"></button>';

					template = template.replace('@@buttonHtml@@', buttonHtml);

					scope.showDialog = showDialog;

					scope.clickEvent = function (event){
						event.stopPropagation();
					};

					let content = $compile(template)(scope);

					elem.replaceWith(content);


					function closeWin(){
						let div = document.getElementById(popupWinID);
						if(div){
							document.body.removeChild(div);
						}
						document.removeEventListener('click', closeWin);
						let input = document.getElementById(inputId);
						if(input){
							input.removeEventListener('keyup', reRenderTable);
						}
					}

					let defaultDatas = systemVariablesService.getList();
					let allVariables = [];

					function clickVarEvent(code){
						scope[attrs.model || attrs.ngModel] = code;
						closeWin();
					}

					function showDialog(e){
						e.stopPropagation();

						if(document.getElementById(popupWinID)){
							closeWin();
							return;
						}

						document.addEventListener('click', closeWin);

						let newDiv = document.createElement('div');
						newDiv.id = popupWinID;
						newDiv.style.position = 'absolute';
						newDiv.style.padding = '0px';
						newDiv.style.width = '500px';
						newDiv.style.height = '300px';
						newDiv.style.border = 'solid #ccc 1px';
						newDiv.style.backgroundColor = 'white';
						newDiv.style.zIndex = '9999';
						newDiv.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.1)';
						newDiv.style.display = 'none';
						newDiv.style.overflow = 'auto';
						let innerHTML =
							'<div class="modal-wrapper"  style="width:100%; height: 100%">' +
							'  <div class="flex-box flex-column flex-element filler subview-content" style="height: 100%; width: 100%;position:relative;">' +
							'     <div style="padding-bottom: 4px">'+ $translate.instant('estimate.main.selectionOfSystemValNVar') +'</div>' +
							// '     <platform-Grid data="variableGridData"></platform-Grid>' +
							'<table style="width: 100%; border-collapse: collapse; font-size:12px" id="'+tableId+'">' +
							'  <tr>'+
							'     <th style="border: 1px solid #dcdcdc; width: 20px; border-bottom: 3px solid #ababab; background-color: #fff"></th>'+
							'     <th style="border: 1px solid #dcdcdc; padding: 4px; border-bottom: 3px solid #dcdcdc">'+$translate.instant('estimate.main.type')+'</th>'+
							'     <th style="border: 1px solid #dcdcdc; padding: 4px; border-bottom: 3px solid #dcdcdc">'+$translate.instant('cloud.common.entityCode')+'</th>'+
							'     <th style="border: 1px solid #dcdcdc; padding: 4px; border-bottom: 3px solid #dcdcdc">'+$translate.instant('cloud.common.entityDescription')+'</th>'+
							'  </tr>';
						let index = 1;
						_.forEach(defaultDatas, function(item){
							let rolStyle = '';
							if(index % 2 !== 0){
								rolStyle = 'background-color: #f5f5f5';
							}

							innerHTML +=
								'  <tr style=" '+rolStyle+'" class="'+index+'">'+
								createTdsHtml(item) +
								'  </tr>';
							index++;
						});

						innerHTML +=
							'</table>'+
							'     <div data-cloud-common-overlay data-loading="isLoading"></div>' +
							'  </div>' +
							'</div>';
						newDiv.innerHTML = innerHTML;
						newDiv.addEventListener('click', (event)=>{event.stopPropagation();});
						allVariables = [];
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getlineitemparameter', {
							Dto: {
								EstHeaderFk: scope.entity.EstHeaderFk,
								Id: scope.entity.EstLineItemFk,
								ProjectFk: $injector.get('estimateMainService').getProjectId()
							},
							ParamLevel: 3,
							IsVistorResult: true
						}).then(function (res){
							if(res && res.data){
								var table = document.getElementById(tableId);
								_.forEach(res.data, function(item){
									let newItem = {
										VarType: '',
										Code: item.Code,
										Description: item.DescriptionInfo.Translated||'',
									};
									let tr = document.createElement('tr');
									tr.className = index + '';
									tr.style.backgroundColor = index % 2 !== 0 ? '#f5f5f5' : '';
									tr.innerHTML = createTdsHtml(newItem);
									table.appendChild(tr);

									allVariables.push(newItem);

									index++;
								});
							}
						});

						document.body.appendChild(newDiv);

						let tableNode = document.getElementById(tableId);
						tableNode.addEventListener('click', (event)=>{
							let target = event.target;
							while (target && target.nodeName !== 'TR') {
								target = target.parentNode;
							}

							if(target && target.cells[0].nodeName !== 'TH'){
								let cells = target.cells;
								inputBox.value = stringFormatService.appendVariables(inputBox.value, cells[2].innerText, inputBox.selectionStart, inputBox.selectionEnd);
								clickVarEvent(inputBox.value);
							}
						});

						tableNode.addEventListener('mouseover', event =>{
							let target = event.target;
							while (target && target.nodeName !== 'TR') {
								target = target.parentNode;
							}
							if(target && target.cells[0].nodeName !== 'TH'){
								target.style.backgroundColor = '#bbcddb'; // #ebe5ff
							}
						});

						tableNode.addEventListener('mouseout', event =>{
							let target = event.target;
							while (target && target.nodeName !== 'TR') {
								target = target.parentNode;
							}

							if(target && target.cells[0].nodeName !== 'TH'){
								target.style.backgroundColor = (target.className-0) % 2 !== 0 ? '#f5f5f5' : '';
							}
						});

						let popupDiv = document.getElementById(popupWinID);
						let inputBox = document.getElementById(inputId);
						popupDiv.style.display = '';

						const rect = inputBox.getBoundingClientRect();
						const windowWidth = window.innerWidth;
						const windowHeight = window.innerHeight;
						popupDiv.style.left = `${rect.left - 1}px`;
						popupDiv.style.top = `${rect.top + rect.height + 1}px`;

						let popupRect = popupDiv.getBoundingClientRect();
						if (popupRect.right > windowWidth - 80) {
							popupDiv.style.left = `${rect.left - (popupRect.right - windowWidth + 80) - 10}px`;
						}

						// if the popup window exceed the bottom of the screen, then move it toward to top;
						if (popupDiv.getBoundingClientRect().bottom > windowHeight) {
							popupDiv.style.top = `${rect.top - popupRect.height}px`;
						}

						inputBox.addEventListener('keyup', reRenderTable);
					}

					function reRenderTable(){
						let inputBox = document.getElementById(inputId);
						let tableNode = document.getElementById(tableId);
						let formula = inputBox.value || '';

						let variables = stringFormatService.getSelectionVariables(formula, inputBox.selectionStart, inputBox.selectionEnd);
						variables = variables || '';

						while (tableNode.rows.length > 1) {
							tableNode.deleteRow(1);
						}

						let i = 1;
						const allItems = [...defaultDatas, ...allVariables];
						_.forEach(allItems, function (item) {
							if(variables === ''
								|| item.Code.toLowerCase().indexOf(variables.toLowerCase()) >= 0){
								tableNode.appendChild(createTrHtml(item, i++));
							}
						});
					}

					function createTrHtml(item, index){
						let tr = document.createElement('tr');
						tr.className = index + '';
						tr.style.backgroundColor = index % 2 !== 0 ? '#f5f5f5' : '';
						tr.innerHTML = createTdsHtml(item);
						return tr;
					}

					function createTdsHtml(item){
						return '     <td style="border: 1px solid #dcdcdc; width: 20px; background-color: #fff"></td>'+
							'     <td style="border: 1px solid #dcdcdc; padding: 5px">'+item.VarType+'</td>'+
							'     <td style="border: 1px solid #dcdcdc; padding: 5px">'+item.Code+'</td>'+
							'     <td style="border: 1px solid #dcdcdc; padding: 5px">'+item.Description+'</td>';
					}

					scope.$on('$destroy', function() {

					});
				}
			};
		}
	]);

})(angular);

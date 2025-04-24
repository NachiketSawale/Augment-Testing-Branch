/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	/* global globals $ */
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).factory('controllingConfigVersionCompareDetailDialogUiService',
		['_', 'platformTranslateService', 'platformModalService','$timeout', 'controllingConfigVersionCompareDetailDialogDataService',
			function (_, platformTranslateService, platformModalService, $timeout, dataService) {
				let gridColumns = [
					{ id: 'referenceColumn', field: 'ReferenceColumn', name: 'ReferenceColumn', width: '100px',  toolTip: 'Reference Column', name$tr$: 'controlling.configuration.referenceColumn',
						formatter: 'lookup',
						formatterOptions: {
							valueMember: 'Id',
							displayMember: 'Code',
							dataServiceName: 'controllingConfigColumnFormulaLookupService',
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'controlling-config-column-formula-lookup'
						},
						validator: function (entity, value){
							return !!value;
						}
					},
					{ id: 'descriptionACol', field: 'DescriptionAInfo', name: 'DescriptionAInfo', width: '120px', toolTip: 'Description', editor:'translation',  maxLength:252, formatter: 'translation', name$tr$: 'controlling.configuration.userLabelA'},
					{ id: 'descriptionBCol', field: 'DescriptionBInfo', name: 'DescriptionBInfo', width: '120px', toolTip: 'Description', editor:'translation',  maxLength:252, formatter: 'translation', name$tr$: 'controlling.configuration.userLabelB'},
					{ id: 'descriptionDiffCol', field: 'DescriptionDiffInfo', name: 'DescriptionDiffInfo', width: '140px', toolTip: 'Description', editor:'translation',  maxLength:252, formatter: 'translation', name$tr$: 'controlling.configuration.userLabelDiff'},
					{ id: 'formattingACol', field: 'LabelAFormat', name: 'LabelAFormat', width: '130px', toolTip: 'Description',  maxLength:2000, name$tr$: 'controlling.configuration.formatingA',
						formatter: formatter
					},
					{ id: 'formattingBCol', field: 'LabelBFormat', name: 'LabelBFormat', width: '130px', toolTip: 'Description',  maxLength:2000,  name$tr$: 'controlling.configuration.formatingB',
						formatter: formatter
					},
					{ id: 'formattingDiffCol', field: 'LabelDiffFormat', name: 'LabelDiffFormat', width: '130px', toolTip: 'Description',  maxLength:2000,  name$tr$: 'controlling.configuration.formatingDiff',
						formatter: formatter
					}
				];

				function formatter(row, cell, value, columnDef, dataContext, printPage) {
					if(printPage){
						return value;
					}

					let divClassId = _.uniqueId('navigator_'),
						btnSpanClassId = _.uniqueId('navigator_'),
						clearButClassId = _.uniqueId('navigator_'),
						openButClassId = _.uniqueId('navigator_');

					let displayStyle = dataService.readonly ? 'none;' : '';

					let htm ='<div class="input-group lookup-container grid-container ng-scope '+divClassId+'">';
					htm += '<input readonly="readonly" type="text" class="input-group-content ng-pristine ng-valid ng-empty ng-touched">\n' +
						'    <span class="input-group-btn '+btnSpanClassId+'">\n' +
						'         <button class="btn btn-default control-icons ico-input-delete '+clearButClassId+'" data-ng-click="clearValue()" style="display: '+displayStyle+'"> </button>\n' +
						'         <button class="btn btn-default  '+openButClassId+'" data-ng-click="showDialog()">\n' +
						'             <div data-ng-class="getEditIcon()" class="control-icons ico-input-lookup lookup-ico-dialog"></div>\n' +
						'         </button>\n' +
						'    </span>';
					htm += '</div>';

					$timeout(function () {
						let inputs = $('.'+divClassId+' input');
						if(inputs && inputs.length > 0){
							inputs[0].value = value;
						}
					});

					// handleMouseOver(divClassId, btnSpanClassId);
					// handleMouseOut(divClassId, btnSpanClassId);
					handleOpenClick(openButClassId, function () {
						let entity = dataContext;

						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'controlling.configuration/templates/comparison-format-config.html',
							backdrop: false,
							width: '640px',
							resizeable: true,
							conditionalFormat: entity ? entity[columnDef.field] : ''
						}).then(function (result) {
							if (result.isOK) {
								entity[columnDef.field] = result.data;
								dataService.gridRefresh();
							}
						});
					});
					handleOpenClick(clearButClassId, function () {

						dataContext[columnDef.field] = '';
						dataService.gridRefresh();
					});

					return htm;
				}

				function handleOpenClick(classId, func) {
					let timeoutId = setTimeout(function () {
						$('.' + classId).click(function (e) {
							e.stopPropagation();
							func(e);
						});
						clearTimeout(timeoutId);
					},0);
				}

				platformTranslateService.translateGridConfig(gridColumns);

				let service = {};

				service.getStandardConfigForListView = function () {
					return {
						columns: gridColumns
					};
				};

				service.getDtoScheme = function () {
					return {};
				};

				return service;
			}]);
})(angular);
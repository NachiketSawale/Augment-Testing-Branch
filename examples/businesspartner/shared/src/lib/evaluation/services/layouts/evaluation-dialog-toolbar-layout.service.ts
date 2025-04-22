/*
 * Copyright(c) RIB Software GmbH
*/

import {IMenuItemsList, ItemType} from '@libs/ui/common';
import {EntityContainerCommand} from '@libs/ui/business-base';
import {EvaluationCommonService} from '../evaluation-common.service';
import {inject} from '@angular/core';
import {MODULE_INFO} from '../../model/entity-info/module-info.model';

export class EvaluationDialogToolbarLayoutService {
	protected commonService: EvaluationCommonService = inject(EvaluationCommonService);
	public get groupViewTools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					id: 'd1',
					type: ItemType.Divider,
					sort: 55
				},
				{
					id: 'treeGridAccordion',
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.toolbarCollapse'},
					iconClass: ' action tlb-icons ico-tree-level-expand',
					type: ItemType.DropdownBtn,
					list: {
						showImages: true,
						showTitles: true,
						cssClass: 'dropdown-menu-right popup-menu overflow',
						items: [
							{
								caption: {key: 'Level1'},
								id: '1',
								type: ItemType.Item,
								iconClass: 'tlb-icons ico-tree-level1',
								fn: (info) => {
									this.commonService.onGroupViewLevel1Event.emit(info);
								}
							},
							{
								caption: {key: 'Collapse'},
								id: 'collapse',
								type: ItemType.Item,
								iconClass: 'tlb-icons ico-tree-level-collapse',
								fn: (info) => {
									this.commonService.onGroupViewCollapseEvent.emit(info);
								}
							},
							{
								caption: {key: 'Expand'},
								id: 'expand',
								type: ItemType.Item,
								iconClass: 'tlb-icons ico-tree-level-expand',
								fn: (info) => {
									this.commonService.onGroupViewExpandEvent.emit(info);
								}
							}
						]
					},
					sort: 58
				},
				{
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.toolbarCollapse'},
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-collapse',
					id: 'collapsenode',
					fn: (info) => {
						this.commonService.onGroupViewCollapseNodeEvent.emit(info);
					},
					sort: 60,
					type: ItemType.Item,
				},
				{
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.toolbarExpand'},
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-expand',
					id: 'expandnode',
					fn: (info) => {
						this.commonService.onGroupViewExpandNodeEvent.emit(info);
					},
					sort: 70,
					type: ItemType.Item,
				},
				{
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.toolbarCollapseAll'},
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-collapse-all',
					id: EntityContainerCommand.CollapseAll,
					fn: () => {
						//containerLink.collapseAll();
						throw new Error('This method is not implemented');
					},
					sort: 80,
					type: ItemType.Item,
				},
				{
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.toolbarExpandAll'},
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-expand-all',
					id: EntityContainerCommand.ExpandAll,
					fn: () => {

						throw new Error('This method is not implemented');
					},
					sort: 90,
					type: ItemType.Item,
				},
				{
					id: 'd2',
					type: ItemType.Divider,
					sort: 100
				},
				{
					id: 't108',
					sort: 108,
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.print'},
					iconClass: 'tlb-icons ico-print-preview',
					type: ItemType.Item,
					fn: () => {
					},
					hideItem: false,
				},
				{
					id: 't1000',
					sort: 110,
					caption: this.commonService.getTranslateText('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
					},
					fn: (info) => {
						this.commonService.onGroupViewUpdateCalculation.emit(info);
					}
				},
				{
					caption: {
						key: 'cloud.common.taskBarSearch',
						text: 'Search',
					},
					hideItem: false,
					iconClass: 'tlb-icons ico-search-all',
					id: 'gridSearchAll',
					sort: 150,
					type: ItemType.Check,
					value: false,
					isSet: true,
				},
				{
					caption: {
						key: MODULE_INFO.cloudCommonModuleName + '.taskBarColumnFilter',
					},
					hideItem: false,
					iconClass: 'tlb-icons ico-search-column',
					id: 'gridSearchColumn',
					sort: 160,
					type: ItemType.Check,
				},
				{
					id: 't199',
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportClipboard'},
					sort: 199,
					type: ItemType.DropdownBtn,
					groupId: 'dropdown-btn-t199',
					cssClass: 'tlb-icons ico-clipboard',
					list: {
						showImages: false,
						showTitles: true,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 't100',
								sort: 100,
								type: ItemType.Check,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportArea'},
								fn: () => {
								},
								value: false,
							},
							{
								id: 't200',
								sort: 200,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportCopy'},
								fn: () => {
								},
								type: ItemType.Item,
							},
							{
								id: 't300',
								sort: 300,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportPaste'},
								fn: () => {
								},
								type: ItemType.Item,
							},
							{
								id: 'dCopyPaste',
								sort: 400,
								type: ItemType.Divider,
							},
							{
								id: 't400',
								sort: 500,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportWithHeader'},
								fn: () => {
								},
								type: ItemType.Check,
							},
						],
					},
					iconClass: 'tlb-icons ico-clipboard',

					hideItem: false,
				},
				{
					id: 't201',
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.gridSettings'},
					sort: 200,
					type: ItemType.DropdownBtn,
					cssClass: 'tlb-icons ico-settings',
					list: {
						showImages: false,
						showTitles: true,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 'autofitTableWidth',
								sort: 300,
								caption: MODULE_INFO.cloudCommonModuleName + '.autofitTableWidth',
								type: ItemType.Item,
								fn: function () {
									//containerLink.collapseAll();
									throw new Error('This method is not implemented');
								}
							},
							{
								id: 't111',
								sort: 112,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.gridlayout'},
								permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0',
								type: ItemType.Item,
							},
							{
								id: 'settingsDivider',
								type: ItemType.Divider,
								sort: 400
							},
							{
								id: 't256',
								sort: 200,
								caption: {key: 'platform.grid.showHorizontalLevelFormatting'},
								type: ItemType.Check,
								fn: function () {
									//containerLink.collapseAll();
									throw new Error('This method is not implemented');
								}
							},
							{
								id: 't257',
								sort: 200,
								caption: {key: 'platform.grid.showVerticalLevelFormatting'},
								type: ItemType.Check,
								fn: function () {
									//containerLink.collapseAll();
									throw new Error('This method is not implemented');
								}
							},
							{
								id: 't255',
								sort: 200,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.markReadonlyCells'},
								type: ItemType.Check,
								value: true,
							},
						],
					},
					iconClass: 'tlb-icons ico-settings',

					hideItem: false,
				},
			]
		} as IMenuItemsList;
	}

	public get documentViewTools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					id: 'create',
					sort: 0,
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.taskBarNewRecord'},
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-new',
					disabled: false,
					fn: info => {
						this.commonService.onDocumentViewCreateDocEvent.emit(info);
					},
					hideItem: false,
				},
				{
					id: 'delete',
					sort: 10,
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.taskBarDeleteRecord'},
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-delete',
					disabled: true,
					fn: () => {
					},
					hideItem: false,
				}, {
					id: 't12',
					sort: 10,
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.taskBarGrouping'},
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-group-columns',
					fn: () => {
					},
					hideItem: false,
				}, {
					id: 't108',
					sort: 108,
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.print'},
					iconClass: 'tlb-icons ico-print-preview',
					type: ItemType.Item,
					fn: () => {
					},
					hideItem: false,
				}, {
					caption: {
						key: MODULE_INFO.cloudCommonModuleName + '.taskBarSearch',
						text: 'Search',
					},
					hideItem: false,
					iconClass: 'tlb-icons ico-search-all',
					id: 'gridSearchAll',
					sort: 150,
					type: ItemType.Check,
					value: false,
					isSet: true,
				},
				{
					caption: {
						key: MODULE_INFO.cloudCommonModuleName + '.taskBarColumnFilter',
					},
					hideItem: false,
					iconClass: 'tlb-icons ico-search-column',
					id: 'gridSearchColumn',
					sort: 160,
					type: ItemType.Check,
				},
				{
					id: 't199',
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportClipboard'},
					sort: 199,
					type: ItemType.DropdownBtn,
					groupId: 'dropdown-btn-t199',
					cssClass: 'tlb-icons ico-clipboard',
					list: {
						showImages: false,
						showTitles: true,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 't100',
								sort: 100,
								type: ItemType.Check,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportArea'},
								fn: () => {
								},
								value: false,
							},
							{
								id: 't200',
								sort: 200,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportCopy'},
								fn: () => {
								},
								type: ItemType.Item,
							},
							{
								id: 't300',
								sort: 300,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportPaste'},
								fn: () => {
								},
								type: ItemType.Item,
							},
							{
								id: 'dCopyPaste',
								sort: 400,
								type: ItemType.Divider,
							},
							{
								id: 't400',
								sort: 500,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.exportWithHeader'},
								fn: () => {
								},
								type: ItemType.Check,
							},
						],
					},
					iconClass: 'tlb-icons ico-clipboard',
					hideItem: false,
				},
				{
					id: 't201',
					caption: {key: MODULE_INFO.cloudCommonModuleName + '.gridSettings'},
					sort: 200,
					type: ItemType.DropdownBtn,
					cssClass: 'tlb-icons ico-settings',
					list: {
						showImages: false,
						showTitles: true,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 'autofitTableWidth',
								sort: 300,
								caption: MODULE_INFO.cloudCommonModuleName + '.autofitTableWidth',
								type: ItemType.Item,
								fn: function () {
									//containerLink.collapseAll();
									throw new Error('This method is not implemented');
								}
							},
							{
								id: 't111',
								sort: 112,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.gridlayout'},
								permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0',
								type: ItemType.Item,
							},
							{
								id: 'settingsDivider',
								type: ItemType.Divider,
								sort: 400
							},
							{
								id: 't255',
								sort: 200,
								caption: {key: MODULE_INFO.cloudCommonModuleName + '.markReadonlyCells'},
								type: ItemType.Check,
								value: true,
							},
						],
					},
					iconClass: 'tlb-icons ico-settings',
					hideItem: false,
				},
				{
					id: 'upload',
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.upload.button.uploadCaption'},
					disabled: () => {
						return true;
					},
					iconClass: 'tlb-icons ico-upload',
					fn: () => {
					},
					sort: 1,
					type: ItemType.Item,
					hideItem: false,
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.upload.button.uploadAndCreateDocument'},
					disabled: () => {
						return false;
					},
					iconClass: 'tlb-icons ico-upload-create',
					id: 'multipleupload',
					fn: (info) => {
						this.commonService.onDocumentViewUpdateAndCreateDocEvent.emit(info);
					},
					sort: 2,
					type: ItemType.Item,
					hideItem: false,
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.upload.button.downloadCaption'},
					disabled: () => {
						return true;
					},
					iconClass: 'tlb-icons ico-download',
					id: 'download',
					fn: () => {
					},
					sort: 3,
					type: ItemType.Item,
					hideItem: false,
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.upload.button.downloadPdfCaption'},
					disabled: () => {
						return true;
					},
					iconClass: 'tlb-icons ico-download-markers',
					id: 'downloadPdf',
					fn: () => {
					},
					sort: 4,
					type: ItemType.Item,
					hideItem: false
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.upload.button.cancelUploadCaption'},
					disabled: () => {
						return true;
					},
					iconClass: 'tlb-icons ico-upload-cancel',
					id: 'cancelUpload',
					fn: () => {
					},
					sort: 5,
					type: ItemType.Item,
					hideItem: false,
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.preview.button.previewCaption'},
					disabled: () => {
						return true;
					},
					iconClass: 'tlb-icons ico-preview-form',
					id: 'preview',
					fn: async () => {
					},
					sort: 6,
					type: ItemType.Item,
					hideItem: false,
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.previewProgram.caption'},
					disabled: false,
					iconClass: 'tlb-icons ico-container-config',
					id: 'previewProgram',
					fn: () => {
					},
					sort: 7,
					type: ItemType.Item,
					hideItem: false,
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.previewEidtOfficeDocument'},
					disabled: () => {
						return true;
					},
					iconClass: 'tlb-icons ico-draw',
					id: 'edit',
					fn: () => {
					},
					sort: 8,
					type: ItemType.Item,
					hideItem: false,
				},
				{
					caption: {key: MODULE_INFO.basicsCommonModuleName + '.synchronize.button.synchronizeCaption'},
					disabled: () => {
						return true;
					},
					iconClass: 'tlb-icons ico-reset',
					id: 'synchronize',
					fn: () => {
					},
					sort: 9,
					type: ItemType.Item,
					hideItem: false,
				}
			]
		};
	}

	public get clerkCommonViewTools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					id: 'isEvaluation',
					iconClass: 'control-icons ico-active',
					type: ItemType.Check,
					caption: {
						text: 'businesspartner.main.screenEvaluationClerkDataOnOffButtonText',
					},
					value: false,
					fn: (info) => {
						this.commonService.onClerkCommonIsEvaluationEvent.emit(info);
					},
					disabled: false,
					hideItem: false,
				},
				{
					id: 'copy',
					iconClass: 'tlb-icons ico-copy',
					type: ItemType.Item,
					caption: {
						text: 'cloud.common.toolbarCopy',
					},
					fn: (info) => {
						//todo
					},
					disabled: true,
					hideItem: false,
				},
				{
					id: 'paste',
					caption: {
						text: 'cloud.common.toolbarPaste',
					},
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-copy-paste',
					disabled: function () {
						return true;
					},
					fn: function () {
						//todo
					},
					hideItem: false,
				},
				{
					id: 'create',
					sort: 0,
					caption: {key: 'cloud.common.taskBarNewRecord'},
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-new',
					disabled: false,
					fn: () => {
						throw new Error('This method is not implemented');
					},
					hideItem: false,
				},
				{
					id: 'delete',
					sort: 10,
					caption: {key: 'cloud.common.taskBarDeleteRecord'},
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-delete',
					disabled: true,
					fn: () => {
					},
					hideItem: false,
				},
				{
					id: 't12',
					sort: 10,
					caption: {key: 'cloud.common.taskBarGrouping'},
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-group-columns',
					fn: () => {
					},
					hideItem: false,
				},
				{
					id: 't108',
					sort: 108,
					caption: {key: 'cloud.common.print'},
					iconClass: 'tlb-icons ico-print-preview',
					type: ItemType.Item,
					fn: () => {
					},
					hideItem: false,
				},
				{
					caption: {
						key: 'cloud.common.taskBarSearch',
						text: 'Search',
					},
					hideItem: false,
					iconClass: 'tlb-icons ico-search-all',
					id: 'gridSearchAll',
					sort: 150,
					type: ItemType.Check,
					value: false,
					isSet: true,
				},
				{
					caption: {
						key: 'cloud.common.taskBarColumnFilter',
					},
					hideItem: false,
					iconClass: 'tlb-icons ico-search-column',
					id: 'gridSearchColumn',
					sort: 160,
					type: ItemType.Check,
				},
				{
					id: 't199',
					caption: {key: 'cloud.common.exportClipboard'},
					sort: 199,
					type: ItemType.DropdownBtn,
					groupId: 'dropdown-btn-t199',
					cssClass: 'tlb-icons ico-clipboard',
					list: {
						showImages: false,
						showTitles: true,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 't100',
								sort: 100,
								type: ItemType.Check,
								caption: {key: 'cloud.common.exportArea'},
								fn: () => {
								},
								value: false,
							},
							{
								id: 't200',
								sort: 200,
								caption: {key: 'cloud.common.exportCopy'},
								fn: () => {
								},
								type: ItemType.Item,
							},
							{
								id: 't300',
								sort: 300,
								caption: {key: 'cloud.common.exportPaste'},
								fn: () => {
								},
								type: ItemType.Item,
							},
							{
								id: 'dCopyPaste',
								sort: 400,
								type: ItemType.Divider,
							},
							{
								id: 't400',
								sort: 500,
								caption: {key: 'cloud.common.exportWithHeader'},
								fn: () => {
								},
								type: ItemType.Check,
							},
						],
					},
					iconClass: 'tlb-icons ico-clipboard',
					hideItem: false,
				},
			],
		} as IMenuItemsList;
	}
}

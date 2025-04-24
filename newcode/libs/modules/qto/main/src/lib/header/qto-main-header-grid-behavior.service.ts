/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { QtoMainHeaderGridDataService } from './qto-main-header-grid-data.service';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { ISearchPayload, PlatformConfigurationService } from '@libs/platform/common';
import { InsertPosition, ItemType, UiCommonFormDialogService, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import { QtoHeaderCreateDialogService } from './create-header-dialog/qto-header-create-dialog.service';

/**
 * qto header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class QtoMainHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IQtoMainHeaderGridEntity>, IQtoMainHeaderGridEntity> {

	private dataService: QtoMainHeaderGridDataService;
	private subscriptions: Subscription[] = [];

	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true
	};

	protected readonly createDialogService: QtoHeaderCreateDialogService;

	private translateService = inject(PlatformTranslateService);
	private configurationService = inject(PlatformConfigurationService);
	public formDialogService = inject(UiCommonFormDialogService);
	public lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	protected http = inject(HttpClient);

	public constructor() {
		this.dataService = inject(QtoMainHeaderGridDataService);
		this.createDialogService = inject(QtoHeaderCreateDialogService);
	}

	public onCreate(containerLink: IGridContainerLink<IQtoMainHeaderGridEntity>): void {
		//region events

		const selectionChanged = this.dataService.selectionChanged$.subscribe(selection => {
			this.selectionChangedCallBack(selection[0]);
		});
		this.subscriptions.push(selectionChanged);

		const rubricCatagoryReadOnly = this.dataService.setRubricCatagoryReadOnly.subscribe(() => {
			const qtoHeader = this.dataService.getSelectedEntity();
			if (qtoHeader) {
				this.dataService.readonlyProcessor.process(qtoHeader);
			}
		});
		this.subscriptions.push(rubricCatagoryReadOnly);

		//endregion

		//region toolbars

		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				caption: { key : 'cloud.common.documentProperties' },
				hideItem: false,
				iconClass: 'tlb-icons ico-settings-doc',
				id: 'qtoHeaderDocumentProperties',
				fn: () => {
					this.dataService.delete(this.dataService.getSelection());
				},
				sort: 450,
				permission: '#c',
				type: ItemType.Item
			}
		], EntityContainerCommand.Settings);

		containerLink.uiAddOns.toolbar.addItemsAtId({
			type: ItemType.Sublist,
			list: {
				items: [
					{
						caption: {key: 'cloud.common.taskBarNewRecord'},
						iconClass: 'tlb-icons ico-rec-new',
						id: EntityContainerCommand.CreateRecord,
						disabled: ctx => {
							return false;
						},
						fn:  () => {
							this.createDialogService.createQtoHeader();
						},
						sort: 0,
						permission: '#c',
						type: ItemType.Item,
					}
				]
			},
			sort: 0
		}, EntityContainerCommand.CreateRecord, InsertPosition.Instead);

		//TODO: missing => qtoHeaderDocumentProperties -lnt

		//endregion
	}

	private selectionChangedCallBack(selected: IQtoMainHeaderGridEntity){
		//TODO: missing => setSelectEdHeader filter service not ready -lnt
	}

	public onDestroy(containerLink: IGridContainerLink<IQtoMainHeaderGridEntity>): void {
		this.subscriptions.forEach(sub => {
			sub.unsubscribe();
		});
	}
}
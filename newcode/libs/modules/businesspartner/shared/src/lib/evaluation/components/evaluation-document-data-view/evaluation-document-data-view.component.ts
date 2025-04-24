/*
 * Copyright(c) RIB Software GmbH
*/

import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {EvaluationDataViewBaseService} from '../../services/evaluation-data-view-base.service';
import {EvaluationDocumentDataLayoutService} from '../../services/layouts/evaluation-document-data-layout.service';
import {CellChangeEvent, IMenuItemsList} from '@libs/ui/common';
import {EvaluationDocumentDataService} from '../../services/evaluation-document-data.service';
import { EvaluationToolbarList, EvaluationToolbarListToken, IEvaluationDocumentDataResponseEntity, IEvaluationDocumentEntity } from '@libs/businesspartner/interfaces';

@Component({
	selector: 'businesspartner-shared-evaluation-document-data-view',
	templateUrl: './evaluation-document-data-view.component.html',
	styleUrl: './evaluation-document-data-view.component.scss',
})
export class BusinesspartnerSharedEvaluationDocumentDataViewComponent extends EvaluationDataViewBaseService<IEvaluationDocumentEntity> {
	@ViewChild('docDataViewDiv')
	public docDataViewDiv!: ElementRef;

	private readonly layoutService: EvaluationDocumentDataLayoutService = inject(EvaluationDocumentDataLayoutService);
	private readonly evaluationDocumentDataService: EvaluationDocumentDataService = inject(EvaluationDocumentDataService);
	private readonly toolbarList = inject<EvaluationToolbarList>(EvaluationToolbarListToken);

	private readonly isUploading = false;
	private readonly isImporting = false;

	public extractZipOrNot: boolean = false;

	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.gridConfig = {
			idProperty: 'Id',
			uuid: 'f09cac2e641d4813b861190813f4e95a',
			columns: [...this.layoutService.columns, ...this.getHistoryColumn()],
			items: [],
		};

		this.commonService.onEvaluationSchemaChanged.subscribe(next => {
			if (next) {
				this.evaluationDocumentDataService.evaluationSchemaChangedHandler(next).then((result) => {
					const value = result as unknown as IEvaluationDocumentDataResponseEntity;
					this.refreshGridItems(value ? value.Main : []);
				});
			}
		});

		this.commonService.onDocumentViewGridRefreshEvent.subscribe(value => {
			this.refreshGridItems(value);
		});
	}

	private refreshGridItems(result: IEvaluationDocumentEntity[] | null) {
		if (result && result.length > 0) {
			this.gridConfig = {
				...this.gridConfig,
				items: [...result]
			};
		} else {
			this.gridConfig.items = [];
		}
	}

	public ngAfterViewInit(): void {
		this.element = this.docDataViewDiv.nativeElement;
		super.afterViewInit();
	}

	/**
	 * Is loading
	 */
	public get isLoading() {
		return this.isUploading || this.isImporting;
	}

	public override initEvent() {
		this.commonService.onDocumentViewCreateDocEvent.subscribe(info => {
			this.evaluationDocumentDataService.create().then(result => {
				//
			});
		});

		this.commonService.onDocumentViewUpdateAndCreateDocEvent.subscribe(info => {
			this.evaluationDocumentDataService.uploadAndCreateDocs();
		});
	}

	public get tools(): IMenuItemsList {
		const menuItems = this.toolbarList.documentViewTools as unknown as IMenuItemsList;
		return menuItems;
	}

	public onCellModified(cell: CellChangeEvent<IEvaluationDocumentEntity>) {
		this.evaluationDocumentDataService.markItemAsModified(cell.item);
	}

	public onSelectionChanged(selected: IEvaluationDocumentEntity[]) {
		if (selected && selected.length > 0) {
			this.evaluationDocumentDataService.selected = selected[0];
		} else {
			this.evaluationDocumentDataService.selected = null;
		}
	}

	public onExtractZipChange() {
		this.evaluationDocumentDataService.extractZipOrNot = this.extractZipOrNot;
	}
}

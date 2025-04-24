/*
 * Copyright(c) RIB Software GmbH
*/
import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {EvaluationGroupDataLayoutService} from '../../services/layouts/evaluation-group-data-layout.service';
import {EvaluationDataViewBaseService} from '../../services/evaluation-data-view-base.service';
import {EvaluationGroupDataService} from '../../services/evaluation-group-data.service';
import {EvaluationDetailService} from '../../services/evaluation-detail.service';
import {IMenuItemsList} from '@libs/ui/common';
import { EvaluationToolbarList, EvaluationToolbarListToken, IEvaluationGroupDataEntity, IEvaluationGroupDataResponseEntity } from '@libs/businesspartner/interfaces';

@Component({
	selector: 'businesspartner-shared-evaluation-group-data-view',
	templateUrl: './evaluation-group-data-view.component.html',
	styleUrl: './evaluation-group-data-view.component.scss',
})
export class BusinesspartnerSharedEvaluationGroupDataViewComponent extends EvaluationDataViewBaseService<IEvaluationGroupDataEntity> implements AfterViewInit, OnInit {
	@ViewChild('groupDataViewDiv')
	public groupDataViewDiv!: ElementRef;

	private readonly layoutService: EvaluationGroupDataLayoutService = inject(EvaluationGroupDataLayoutService);
	private readonly groupDataService: EvaluationGroupDataService = inject(EvaluationGroupDataService);
	private readonly evaluationDetailService: EvaluationDetailService = inject(EvaluationDetailService);
	private readonly toolbarList = inject<EvaluationToolbarList>(EvaluationToolbarListToken);

	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.gridConfig = {
			idProperty: 'Id',
			uuid: '6784b688752143c189b7406d53cebd41',
			columns: [...this.layoutService.columns, ...this.getHistoryColumn()],
			skipPermissionCheck: true,
			items: [],
			treeConfiguration: {
				parent: () => {
					return null;
				},
				children: entity => {
					return entity.ChildrenItem ? entity.ChildrenItem : [];
				}
			}
		};

		this.commonService.onEvaluationSchemaChanged.subscribe(next => {
			if (next) {
				this.groupDataService.evaluationSchemaChangedHandler(next).then((result) => {
					const value = result as IEvaluationGroupDataResponseEntity;
					this.refreshGridItems(value.dtos || []);
				});
			}
		});

		this.commonService.onGroupViewGridRefreshEvent.subscribe(data => {
			this.refreshGridItems(data);
		});
	}

	private refreshGridItems(result: IEvaluationGroupDataEntity[] | null) {
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
		this.element = this.groupDataViewDiv.nativeElement;
		super.afterViewInit();
	}

	public onSelectionchange(selection: IEvaluationGroupDataEntity[]) {
		this.groupDataService.selected = null;
		if (selection && selection.length > 0) {
			this.groupDataService.selected = selection[0];
		}
		this.commonService.onGroupViewSelectionChanged.emit(this.groupDataService.selected);
	}

	public get tools(): IMenuItemsList {
		const menuItems = this.toolbarList.groupViewTools as unknown as IMenuItemsList;
		return menuItems;
	}

	public override initEvent() {
		this.commonService.onGroupViewLevel1Event.subscribe(info => {
			//
		});

		this.commonService.onGroupViewCollapseEvent.subscribe(info => {
			//
		});

		this.commonService.onGroupViewExpandEvent.subscribe(info => {
			//
		});

		this.commonService.onGroupViewCollapseNodeEvent.subscribe(info => {
			//
		});

		this.commonService.onGroupViewExpandNodeEvent.subscribe(info => {
			//
		});

		this.commonService.onGroupViewUpdateCalculation.subscribe(info => {
			this.groupDataService.recalculateAll('');
		});
	}
}

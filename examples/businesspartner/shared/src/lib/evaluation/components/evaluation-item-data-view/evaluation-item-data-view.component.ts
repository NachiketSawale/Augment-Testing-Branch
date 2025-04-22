/*
 * Copyright(c) RIB Software GmbH
*/

import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {EvaluationDataViewBaseService} from '../../services/evaluation-data-view-base.service';
import {EvaluationItemDataLayoutService} from '../../services/layouts/evaluation-item-data-layout.service';
import {EvaluationGroupDataService} from '../../services/evaluation-group-data.service';
import {EvaluationItemDataService} from '../../services/evaluation-item-data.service';
import {IFieldValueChangeInfo} from '@libs/ui/common';
import {forEach} from 'lodash';
import { IEvaluationItemDataEntity, IEvaluationItemDataGetListResponseEntity } from '@libs/businesspartner/interfaces';

@Component({
	selector: 'businesspartner-shared-evaluation-item-data-view',
	templateUrl: './evaluation-item-data-view.component.html',
	styleUrl: './evaluation-item-data-view.component.scss',
})
export class BusinesspartnerSharedEvaluationItemDataViewComponent extends EvaluationDataViewBaseService<IEvaluationItemDataEntity> implements AfterViewInit, OnInit {
	@ViewChild('itemDataViewDiv')
	public itemDataViewDiv!: ElementRef;

	private readonly layoutService: EvaluationItemDataLayoutService = inject(EvaluationItemDataLayoutService);
	private readonly evaluationGroupDataService: EvaluationGroupDataService = inject(EvaluationGroupDataService);
	private readonly evaluationItemDataService: EvaluationItemDataService = inject(EvaluationItemDataService);

	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.gridConfig = {
			idProperty: 'Id',
			uuid: 'b0f91870d5804749be358015d372b8f0',
			skipPermissionCheck: true,
			columns: [...this.layoutService.columns, ...this.getHistoryColumn()],
			items: [],
		};

		this.commonService.onGroupViewSelectionChanged.subscribe(value => {
			if (value) {
				this.evaluationItemDataService.load({id: 0}).then((result) => {
					if (result) {
						this.refreshGridItems(result as IEvaluationItemDataGetListResponseEntity);
					}
				});
			} else {
				this.refreshGridItems(null);
			}
		});

		this.commonService.onItemViewGridRefreshEvent.subscribe(value => {
			this.refreshGridItems(value);
		});
	}

	private refreshGridItems(result: IEvaluationItemDataGetListResponseEntity | null) {
		if (result?.dtos && result.dtos.length > 0) {
			this.gridConfig = {
				...this.gridConfig,
				items: [...result.dtos]
			};
		} else {
			this.gridConfig.items = [];
		}
	}

	public ngAfterViewInit(): void {
		this.element = this.itemDataViewDiv.nativeElement;
		super.afterViewInit();
	}

	public override initEvent() {
		//
	}

	public onSelectionChanged(selected: IEvaluationItemDataEntity[]) {
		if (selected && selected.length > 0) {
			this.evaluationItemDataService.selected = selected[0];
		} else {
			this.evaluationItemDataService.selected = null;
		}
	}

	public onValueChanged(info: IFieldValueChangeInfo<IEvaluationItemDataEntity>) {
		const currentParentItem = this.evaluationGroupDataService.selected;
		const list = this.evaluationItemDataService.getItemList();
		const dtos = list.dtos;
		const entity = info.entity;

		if (currentParentItem && !currentParentItem.IsMultiSelect && info.field.id === 'isticked' && info.newValue && dtos) {
			forEach(dtos, (item) => {
				if (item.Id !== entity.Id && item.IsTicked) {
					item.IsTicked = false;
					this.evaluationItemDataService.markItemAsModified(item);
				}
			});
		}

		this.refreshGridItems(list);

		let totalPoints = 0;
		forEach(dtos, item => {
			if (item.IsTicked) {
				totalPoints += item.Points;
			}
		});

		if (currentParentItem && currentParentItem.Points !== totalPoints) {
			this.evaluationItemDataService.pointsChangedMessage.emit({points: totalPoints});
		}
	}
}

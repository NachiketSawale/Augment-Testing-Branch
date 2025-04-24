/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';

@Injectable({ providedIn: 'root' })

/**
 * EstimateProjectHeaderLookupService this service provides generic lookup for line items
 */
export class EstimateProjectHeaderLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IEstHeaderEntity, TEntity> {
	protected readonly estimateMainContextService = inject(EstimateMainContextService);
	public constructor() {
		super('estimatemainheader', {
			uuid: 'B59CC74C8B55490E9E5D9E80DA10B32F',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'estimate.main.estimateCode'
						},
						visible: true,
						sortable: false,
						width: 120,
						readonly: true
					},
					{
						id: 'desc',
						model: 'DescriptionInfo',
						type: FieldType.Description,
						label: {
							text: 'Description',
							key: 'estimate.main.estimateDescription'
						},
						visible: true,
						sortable: false,
						width: 120,
						readonly: true
					},
				],
				skipPermissionCheck: true,
			},
			dialogOptions: {
				headerText: {
					text: 'estimate.main.estimateTitle'
				}
			},
			showDialog: true
		});
	}

	/**
	 * @brief Retrieves the selected estimate header item as a list.
	 * @returns {Observable<IEstHeaderEntity[]>} An observable that emits a list
	 * containing the selected estimate header item, or an empty list if no item is selected.
	 */
	public override getList(): Observable<IEstHeaderEntity[]> {
		const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem();
		const list: IEstHeaderEntity[] = [];
		if (estHeader) {
			list.push(estHeader);
		}
		return of(list);
	}

	/**
	 * @brief Retrieves the selected estimate header item by key.
	 * @returns {Observable<IEstHeaderEntity>} An observable that emits the selected
	 * estimate header item, or an empty IEstHeaderEntity object if no item is selected.
	 */
	public override getItemByKey(): Observable<IEstHeaderEntity> {
		const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem();
		if (estHeader) {
			return of(estHeader);
		} else {
			return of({} as IEstHeaderEntity);
		}
	}
}

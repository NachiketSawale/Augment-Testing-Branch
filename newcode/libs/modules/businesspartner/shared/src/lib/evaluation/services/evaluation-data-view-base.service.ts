/*
 * Copyright(c) RIB Software GmbH
*/

import {ColumnDef, FieldType, IGridConfiguration} from '@libs/ui/common';
import {filter} from 'lodash';
import {EvaluationCommonService} from './evaluation-common.service';
import {inject} from '@angular/core';
import {MODULE_INFO} from '../model/entity-info/module-info.model';

/*
	Since there is a blank in the left of row for custom component, it is caused by form-section div and form-column1 div
*/
export abstract class EvaluationDataViewBaseService<MT extends object> {
	public abstract initEvent(): void;

	private readonly className = 'class';

	protected element!: HTMLElement;
	protected gridConfig!: IGridConfiguration<MT>;

	protected commonService: EvaluationCommonService = inject(EvaluationCommonService);

	public constructor() {
		this.initEvent();
	}

	public afterViewInit(): void {
		//get form-section element
		const parentElement = this.element.parentElement!.parentElement!.parentElement!.parentElement;

		if (parentElement) {
			this.removeFormColumn1(parentElement);
			this.removeFormSection(parentElement);
		}
	}

	private removeFormSection(parent: HTMLElement) {
		const parentClass = parent.getAttribute(this.className);
		if (parentClass && parentClass === 'form-section') {
			parent.removeAttribute(this.className);
		}
	}

	private removeFormColumn1(parent: HTMLElement) {
		const formColumns1Child = filter(parent.children, (item: HTMLElement) => {
			const itemClass = item.getAttribute(this.className);
			return itemClass && itemClass === 'form-column1';
		});

		if (formColumns1Child && formColumns1Child.length > 0) {
			parent.removeChild(formColumns1Child[0] as Node);
		}
	}

	public getHistoryColumn() {
		return [
			{
				id: 'insertedat',
				model: 'InsertedAt',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityInsertedAt'
				},
				type: FieldType.DateTime,
				readonly: true,
				visible: false
			},
			{
				id: 'insertedby',
				model: 'InsertedBy',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityInsertedBy'
				},
				type: FieldType.Text,
				readonly: true,
				visible: false
			},
			{
				id: 'updatedat',
				model: 'UpdatedAt',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityUpdatedAt'
				},
				type: FieldType.DateTime,
				readonly: true,
				visible: false
			},
			{
				id: 'updatedby',
				model: 'UpdatedBy',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityUpdatedBy'
				},
				type: FieldType.Text,
				readonly: true,
				visible: false
			},
		] as ColumnDef<MT>[];
	}
}

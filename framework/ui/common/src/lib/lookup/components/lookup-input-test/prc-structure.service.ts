/*
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import {Injectable} from '@angular/core';

import {IDescriptionInfo} from '@libs/platform/common';

import {UiCommonLookupTypeDataService} from '../../services/lookup-type-data.service';
import {UiCommonLookupBtn} from '../../model/lookup-btn';
import {FieldType} from '../../../model/fields';

/**
 * Procurement structure entity for testing
 */
export class PrcStructureEntity {
    public get Description() {
		if(this.DescriptionInfo) {
			return this.DescriptionInfo.Translated;
		}
		return '';
	}

	public Code?: string;

	public DescriptionInfo?: IDescriptionInfo;

	public constructor(public Id: number) {

	}
}

/**
 * Procurement structure lookup service for testing
 */
@Injectable()
export class UiCommonLookupPrcStructureService extends UiCommonLookupTypeDataService<PrcStructureEntity, object> {
	public constructor() {
		const testBtn = new UiCommonLookupBtn('test', 'test', () => {
			// test function
			console.log('work');
		});

		testBtn.shownOnReadonly = true;

		super('prcstructure', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			isClientSearch: false,
			readonly: false,
			showClearButton: true,
			buttons: [testBtn],
			inputSearchMembers: ['DescriptionInfo.Description'],
			gridConfig: {
				uuid: '9633a99dcc624899959bb6e5df7456e4',
				columns: [
					{id: 'code', model: 'Code', type: FieldType.Description, label: {text: 'Code'}, sortable: true, visible: true, readonly: true},
					{id: 'desc', model: 'Description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true}
				]
			},
			showGrid: true,
			canListAll: false
		});

		this.paging.enabled = true;
		this.paging.pageCount = 20;
	}

	public override mapEntity(item: unknown): PrcStructureEntity {
		const entity = new PrcStructureEntity((item as { Id: number }).Id);
		_.extend(entity, item);
		return entity;
	}
}
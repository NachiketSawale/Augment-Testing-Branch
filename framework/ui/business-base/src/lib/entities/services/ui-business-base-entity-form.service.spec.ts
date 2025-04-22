/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { Translatable } from '@libs/platform/common';
import { EntityDomainType } from '@libs/platform/data-access';
import {
	IFormConfig,
	FieldType
} from '@libs/ui/common';
import { UiBusinessBaseEntityFormService } from './ui-business-base-entity-form.service';
import { ENTITY_DEFAULT_GROUP_ID } from '../model/default-entity-ids.model';
import { COMMON_ENTITY_LABELS } from '../model/common-entity-labels.model';

describe('EntityFormService', () => {
	let service: UiBusinessBaseEntityFormService;

	const defaultGroupTranslation = (function getDefaultGroupTranslation (): Translatable {
		const tls = COMMON_ENTITY_LABELS.labels[ENTITY_DEFAULT_GROUP_ID];
		if (!tls) {
			throw new Error('Could not find default entity group label.');
		}
		return tls;
	})();

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UiBusinessBaseEntityFormService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	class SampleEntity {
		public firstName?: string;

		public lastName?: string;

		public age?: number;
	}

	it('should generate an empty form for empty input', () => {
		const formConfig = service.generateEntityFormConfig<SampleEntity>({
			schema: 'sample-entity',
			properties: {}
		});

		const expectedFormConfig: IFormConfig<SampleEntity> = {
			formId: 'sample-entity',
			groups: [{
				groupId: ENTITY_DEFAULT_GROUP_ID,
				open: true,
				visible: true,
				header: defaultGroupTranslation
			}],
			rows: [],
			showGrouping: true
		};

		expect(formConfig).toEqual(expectedFormConfig);
	});

	it('should generate a form with a default group', () => {
		const formConfig = service.generateEntityFormConfig<SampleEntity>({
			schema: 'sample-entity',
			properties: {
				firstName: {
					domain: EntityDomainType.Description,
					mandatory: true,
					maxlen: 30
				},
				lastName: {
					domain: EntityDomainType.Description,
					mandatory: true
				},
				age: {
					domain: EntityDomainType.Integer,
					mandatory: false
				}
			}
		});

		const expectedFormConfig: IFormConfig<SampleEntity> = {
			formId: 'sample-entity',
			groups: [{
				groupId: ENTITY_DEFAULT_GROUP_ID,
				open: true,
				visible: true,
				header: defaultGroupTranslation
			}],
			rows: [{
				groupId: ENTITY_DEFAULT_GROUP_ID,
				id: 'firstName',
				required: true,
				maxLength: 30,
				type: FieldType.Description,
				model: 'firstName',
				label: { text: '[firstName]' },
				tooltip: undefined,
				readonly: false,
				visible: true
			}, {
				groupId: ENTITY_DEFAULT_GROUP_ID,
				id: 'lastName',
				required: true,
				type: FieldType.Description,
				model: 'lastName',
				label: { text: '[lastName]' },
				tooltip: undefined,
				maxLength: undefined,
				readonly: false,
				visible: true
			}, {
				groupId: ENTITY_DEFAULT_GROUP_ID,
				id: 'age',
				required: false,
				type: FieldType.Integer,
				model: 'age',
				label: { text: '[age]' },
				tooltip: undefined,
				readonly: false,
				visible: true
			}],
			showGrouping: true
		};

		expect(formConfig).toEqual(expectedFormConfig);
	});

	it('should generate a form with custom groups', () => {
		const formConfig = service.generateEntityFormConfig<SampleEntity>({
			schema: 'sample-entity',
			properties: {
				firstName: {
					domain: EntityDomainType.Description,
					mandatory: true,
					maxlen: 30
				},
				lastName: {
					domain: EntityDomainType.Description,
					mandatory: true
				},
				age: {
					domain: EntityDomainType.Integer,
					mandatory: false
				}
			}
		}, {
			groups: [{
				gid: 'name',
				attributes: ['firstName', 'lastName']
			}, {
				gid: 'more',
				attributes: ['age']
			}]
		});

		const expectedFormConfig: IFormConfig<SampleEntity> = {
			formId: 'sample-entity',
			groups: [{
				groupId: 'name',
				open: true,
				visible: true,
				header: undefined
			}, {
				groupId: 'more',
				open: true,
				visible: true,
				header: undefined
			}],
			rows: [{
				groupId: 'name',
				id: 'firstName',
				required: true,
				maxLength: 30,
				type: FieldType.Description,
				model: 'firstName',
				label: { text: '[firstName]' },
				tooltip: undefined,
				readonly: false,
				visible: true
			}, {
				groupId: 'name',
				id: 'lastName',
				required: true,
				type: FieldType.Description,
				model: 'lastName',
				label: { text: '[lastName]' },
				tooltip: undefined,
				maxLength: undefined,
				readonly: false,
				visible: true
			}, {
				groupId: 'more',
				id: 'age',
				required: false,
				type: FieldType.Integer,
				model: 'age',
				label: { text: '[age]' },
				tooltip: undefined,
				readonly: false,
				visible: true
			}],
			showGrouping: true
		};

		expect(formConfig).toEqual(expectedFormConfig);
	});
});

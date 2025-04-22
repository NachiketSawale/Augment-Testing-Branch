/*
 * Copyright(c) RIB Software GmbH
 */

import { InitializationContext } from '@libs/platform/common';
import { GenericWizardLayoutConfigPrepSettings } from '../../models/types/generic-wizard-layout-configuration-prep.type';
import { GenericWizardLayoutConfigurationService } from './generic-wizard-layout-configuration.service';
import { INCLUDED_FIELD } from '../../models/constants/generic-wizard-included-field.constant';

/**
 * A test entity type with three properties.
 */
type TestEntity = {
    test1: boolean;
    test2: string;
    test3: string;
};

describe('GenericWizardLayoutConfigurationService', () => {
	let service: GenericWizardLayoutConfigurationService;

	beforeEach(() => {
		service = new GenericWizardLayoutConfigurationService();
	});

	it('should prepare layout configuration with async layoutConfig', async () => {
		const layoutConfigPrepSettings: GenericWizardLayoutConfigPrepSettings<TestEntity> = {
            layoutConfig: async (ctx) => ({ groups: [{ attributes: ['test1', 'test2', 'test3'], gid: 'base-group' }] }),
			layoutAttributes: [{ id: 'test1', isPinned: false, isReadonly: true, sorting: 1 }, {id: 'test2', isPinned: false, isReadonly: true, sorting: 2}],
			ctx: {} as InitializationContext,
			isGridContainer: false,
			transientFields: []
		};

		const result = await service.prepareLayoutConfiguration(layoutConfigPrepSettings);

		expect(result).toEqual({
			groups: [{
                additionalAttributes: undefined,
                attributes: ['test1', 'test2'],
                gid: 'base-group'
            }],
			transientFields: [],
			suppressHistoryGroup: true
		});
	});

	it('should prepare layout configuration with sync layoutConfig', async () => {
		const layoutConfigPrepSettings: GenericWizardLayoutConfigPrepSettings<TestEntity> = {
			layoutConfig: { groups: [{ attributes: ['test1', 'test2', 'test3'], gid: 'base-group' }], transientFields: [] },
			layoutAttributes: [{ id: 'test1', isPinned: false, isReadonly: true, sorting: 1 }, {id: 'test2', isPinned: false, isReadonly: true, sorting: 2}],
			ctx: {} as InitializationContext,
			isGridContainer: false,
			transientFields: []
		};

		const result = await service.prepareLayoutConfiguration(layoutConfigPrepSettings);

		expect(result).toEqual({
			groups: [{
                additionalAttributes: undefined,
                attributes: ['test1', 'test2'],
                gid: 'base-group'
            }],
			transientFields: [],
			suppressHistoryGroup: true
		});
	});

	it('should include INCLUDED_FIELD in transientFields if isGridContainer is true', async () => {
		const layoutConfigPrepSettings: GenericWizardLayoutConfigPrepSettings<TestEntity> = {
			layoutConfig: { groups: [], transientFields: [] },
			layoutAttributes: [{ id: 'test1', isPinned: false, isReadonly: true, sorting: 1 }, {id: 'test2', isPinned: false, isReadonly: true, sorting: 2}],
			ctx: {} as InitializationContext,
			isGridContainer: true,
			transientFields: []
		};

		const result = await service.prepareLayoutConfiguration(layoutConfigPrepSettings);

        expect(result.groups).toBeDefined();
        
        if(result.groups) {
            expect(result.groups[0].attributes).toContain(INCLUDED_FIELD.id);
        }
		expect(result.transientFields).toContain(INCLUDED_FIELD);
	});

	it('should filter out attributes not in layoutAttributes', async () => {
		const layoutConfigPrepSettings: GenericWizardLayoutConfigPrepSettings<TestEntity> = {
			layoutConfig: {
				groups: [
					{ gid: 'group1', attributes: ['test1', 'test2'], additionalAttributes: [] }
				],
				transientFields: [{id: 'test4'}]
			},
			layoutAttributes: [{ id: 'test1', isPinned: false, isReadonly: true, sorting: 1 }],
			ctx: {} as InitializationContext,
			isGridContainer: false
		};

		const result = await service.prepareLayoutConfiguration(layoutConfigPrepSettings);

        expect(result.groups).toBeDefined();
        if(result.groups) {
            expect(result.groups[0].attributes).toEqual(['test1']);
        }
	});

	it('should remove empty groups', async () => {
		const layoutConfigPrepSettings: GenericWizardLayoutConfigPrepSettings<TestEntity> = {
			layoutConfig: {
				groups: [
					{ gid: 'group1', attributes: ['test1', 'test2'], additionalAttributes: [] }
				],
				transientFields: []
			},
			layoutAttributes: [],
			ctx: {} as InitializationContext,
			isGridContainer: false,
			transientFields: []
		};

		const result = await service.prepareLayoutConfiguration(layoutConfigPrepSettings);
        expect(result.groups).toBeDefined();
        if(result.groups) {
            expect(result.groups.length).toBe(0);
        }
	});
});
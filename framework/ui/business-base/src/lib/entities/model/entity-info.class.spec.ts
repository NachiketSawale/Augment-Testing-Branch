/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EntityDomainType, IEntitySchema, IEntitySelection } from '@libs/platform/data-access';
import { EntityInfo } from './entity-info.class';
import { ENTITY_DEFAULT_GROUP_ID, ENTITY_HISTORY_GROUP_ID } from './default-entity-ids.model';

interface IExampleEntity {
	Name: string;
	Age: number;
	Assignment: string;
	InsertedAt: Date;
	InsertedBy: number;
	UpdatedAt?: Date;
	UpdatedBy?: number;
	Version: number;
}

const EXAMPLE_ENTITY_SCHEMA: IEntitySchema<IExampleEntity> = {
	schema: 'Test',
	properties: {
		Name: {domain: EntityDomainType.Description, mandatory: true},
		Age: {domain: EntityDomainType.Integer, mandatory: true},
		InsertedAt: {domain: EntityDomainType.Date, mandatory: true},
		InsertedBy: {domain: EntityDomainType.Integer, mandatory: true},
		UpdatedAt: {domain: EntityDomainType.Date, mandatory: false},
		UpdatedBy: {domain: EntityDomainType.Integer, mandatory: false},
		Version: {domain: EntityDomainType.Integer, mandatory: true}
	}
};

describe('EntityInfo', () => {

	beforeEach(async () => {
		await TestBed.configureTestingModule({});
	});

	it('should list its fields without a layout configuration', async () => {
		const injector = TestBed.inject(Injector);

		const entityInfo = EntityInfo.create({
			permissionUuid: '1034521ce1654edc8027ddd925cfe44e',
			dataService: <IEntitySelection<IExampleEntity>>{},
			entitySchema: EXAMPLE_ENTITY_SCHEMA
		});

		const fields = await entityInfo.getDefaultFieldIds(injector);

		expect(fields).toHaveLength(2);
		expect(fields).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					groupId: ENTITY_DEFAULT_GROUP_ID,
					fieldIds: expect.arrayContaining(['Name', 'Age'])
				}),
				expect.objectContaining({
					groupId: ENTITY_HISTORY_GROUP_ID,
					fieldIds: expect.arrayContaining(['Version', 'UpdatedAt', 'UpdatedBy', 'InsertedAt', 'InsertedBy'])
				})
			])
		);
	});

	it('should list its fields with a layout configuration', async () => {
		const injector = TestBed.inject(Injector);

		const entityInfo = EntityInfo.create({
			permissionUuid: '1034521ce1654edc8027ddd925cfe44e',
			dataService: <IEntitySelection<IExampleEntity>>{},
			entitySchema: EXAMPLE_ENTITY_SCHEMA,
			layoutConfiguration: {
				groups: [{
					gid: 'A',
					attributes: ['Name', 'Age', 'Address']
				}, {
					gid: 'B',
					attributes: ['Assignment']
				}]
			}
		});

		const fields = await entityInfo.getDefaultFieldIds(injector);

		expect(fields).toHaveLength(3);
		expect(fields).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					groupId: 'A',
					fieldIds: expect.arrayContaining(['Name', 'Age', 'Address'])
				}),
				expect.objectContaining({
					groupId: 'B',
					fieldIds: expect.arrayContaining(['Assignment'])
				}),
				expect.objectContaining({
					groupId: ENTITY_HISTORY_GROUP_ID,
					fieldIds: expect.arrayContaining(['Version', 'UpdatedAt', 'UpdatedBy', 'InsertedAt', 'InsertedBy'])
				})
			])
		);
	});

	it('should list its fields while respecting exclusions', async () => {
		const injector = TestBed.inject(Injector);

		const entityInfo = EntityInfo.create({
			permissionUuid: '1034521ce1654edc8027ddd925cfe44e',
			dataService: <IEntitySelection<IExampleEntity>>{},
			entitySchema: EXAMPLE_ENTITY_SCHEMA,
			layoutConfiguration: {
				suppressHistoryGroup: true,
				excludedAttributes: ['Age', 'UpdatedBy', 'UpdatedAt']
			}
		});

		const fields = await entityInfo.getDefaultFieldIds(injector);

		expect(fields).toHaveLength(1);
		expect(fields).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					groupId: ENTITY_DEFAULT_GROUP_ID,
					fieldIds: expect.arrayContaining(['Name', 'InsertedAt', 'InsertedBy', 'Version'])
				})
			])
		);
	});
});

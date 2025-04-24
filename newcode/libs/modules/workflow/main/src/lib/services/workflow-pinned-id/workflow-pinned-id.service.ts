/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ContextService, PlatformConfigurationService } from '@libs/platform/common';
import { WorkflowPinnedId } from '@libs/workflow/shared';
import { isEmpty } from 'lodash';

/**
 * Default expiry time for pinned ids(In days).
 */
const PINNED_ID_EXPIRY_TIME = 30;

/**
 * Default key to be used to save pinned ids into application context.
 */
const PINNED_ID_KEY = 'pinnedIds';

@Injectable({
	providedIn: 'root',
})
export class WorkflowPinnedIdService {

	private entityPinnedIdMap = new Map<string, Map<number, WorkflowPinnedId>>();
	private readonly platformConfigService = inject(PlatformConfigurationService);
	private readonly contextService = inject(ContextService);

	public constructor() {
		this.loadPinnedIdsFromApplicationContext();
	}

	private loadPinnedIdsFromApplicationContext() {
		const entityPinnedIdMap = this.contextService.getApplicationValue(PINNED_ID_KEY) as string;
		if (entityPinnedIdMap && !isEmpty(JSON.parse(entityPinnedIdMap, this.reviver))) {
			this.entityPinnedIdMap = JSON.parse(entityPinnedIdMap, this.reviver);
		} else {
			this.addMockEntriesToMap();
		}
	}

	private addMockEntriesToMap() {
		const modelObjPinnedIds = new Map<number, WorkflowPinnedId>();

		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + PINNED_ID_EXPIRY_TIME);

		modelObjPinnedIds.set(0, new WorkflowPinnedId({ id: 0, pKey1: 0, pKey2: 0, pKey3: 9 }, 'None', expiryDate));
		modelObjPinnedIds.set(1, new WorkflowPinnedId({ id: 1, pKey1: 1029252 }, 'pinned id 1', expiryDate));
		modelObjPinnedIds.set(2, new WorkflowPinnedId({ id: 2, pKey1: 1029252 }, 'pinned id 2', expiryDate));

		//Testing removal of expired values
		const expiryDate2 = new Date();
		expiryDate2.setDate(expiryDate2.getDate() - PINNED_ID_EXPIRY_TIME);
		modelObjPinnedIds.set(3, new WorkflowPinnedId({ id: 3, pKey1: 1029252 }, 'pinned id 3', expiryDate2));

		this.entityPinnedIdMap.set('ebe9edad9e034dcdba91c10c1c50d6e0', modelObjPinnedIds);
		this.setPinnedIdsToApplicationContextAndSave();
	}

	private replacer(key: string, value: object) {
		if (value instanceof Map) {
			return {
				dataType: 'Map',
				value: Array.from(value.entries())
			};
		} else {
			return value;
		}
	}

	private reviver(key: string, value: { dataType: string, value: [] }) {
		if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
			return new Map(value.value);
		}
		return value;
	}

	/**
	 * Gets all the pinned ids for the current selected entity
	 * @param entityId The entity configured for workflow template
	 * @returns Map<number, PinnedId>
	 */
	public getPinnedIdForEntity(entityId?: string): Map<number, WorkflowPinnedId> | undefined {
		if (!entityId) {
			return;
		}

		this.removeExpiredPinnedIds();
		return this.entityPinnedIdMap.get(entityId);
	}

	private removeExpiredPinnedIds() {
		const keys = [...this.entityPinnedIdMap.keys()];

		keys.forEach((key)=>{
			//Checking for each entity
			const pinnedIdsMap = this.entityPinnedIdMap.get(key);
			if (pinnedIdsMap) {
				//Checking each pinned id against entity
				const pinnedIdKeys = [...pinnedIdsMap.keys()];
				pinnedIdKeys.forEach((pinnedIdKey) => {
					if (pinnedIdsMap.get(pinnedIdKey)?.isExpired) {
						pinnedIdsMap.delete(pinnedIdKey);
					}
				});

				if (pinnedIdsMap.size === 0) {
					this.entityPinnedIdMap.delete(key);
				} else {
					this.entityPinnedIdMap.set(key, pinnedIdsMap);
				}
			}
		});

		this.setPinnedIdsToApplicationContextAndSave();
	}

	/**
	 * If pinned id is already available, updates the pinnedid. Otherwise, adds a new entry into the map.
	 * @param entityId The entity for which pinned ids are being added
	 * @param rowId The row index in sidebar
	 * @param pinnedId The selected id that has to be pinned with it's description
	 */
	public addPinnedIdForEntity(entityId: string, rowId: number, pinnedId: WorkflowPinnedId) {
		const entityPinnedIdMap = this.entityPinnedIdMap.get(entityId);
		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + PINNED_ID_EXPIRY_TIME);
		pinnedId.expiryDate = expiryDate;

		if (entityPinnedIdMap) { //Already exists
			entityPinnedIdMap.set(rowId, pinnedId);
		} else {
			const maxRowId = Math.max(...[...this.entityPinnedIdMap.keys()].map(Number)) + 1;
			this.entityPinnedIdMap.set(entityId, new Map([[maxRowId, pinnedId]]));
		}

		this.setPinnedIdsToApplicationContextAndSave();
	}

	/**
	 * Removes pinned id from map and local storage
	 * @param entityId The entity for which pinned ids are being removed
	 * @param rowId The row index in sidebar
	 * @returns void
	 */
	public removePinnedIdForEntity(entityId: string, rowId: number): void {
		const entityPinnedIdMap = this.entityPinnedIdMap.get(entityId);
		if (!entityPinnedIdMap) {
			return;
		}

		entityPinnedIdMap.delete(rowId);
		this.setPinnedIdsToApplicationContextAndSave();
	}

	private setPinnedIdsToApplicationContextAndSave() {
		if(!this.platformConfigService.loggedInUserId) {
			return;
		}
		this.contextService.setApplicationValue(PINNED_ID_KEY, JSON.stringify(this.entityPinnedIdMap, this.replacer), true);
		this.contextService.saveContextToLocalStorage(this.platformConfigService.loggedInUserId);
	}
}
/*
 * Copyright(c) RIB Software GmbH
 */
import { get } from 'lodash';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { CollectionHelper, ISearchResult, PlatformHttpService } from '@libs/platform/common';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';

export const BASICS_PROCUREMENT_STRUCTURE_DATA_TOKEN = new InjectionToken<BasicsProcurementStructureDataService>('basicsProcurementStructureDataToken');

/**
 * Procurement structure entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureDataService extends DataServiceHierarchicalRoot<IPrcStructureEntity, PrcStructureComplete> {
	private http = inject(PlatformHttpService);

	public constructor() {
		const options: IDataServiceOptions<IPrcStructureEntity> = {
			apiUrl: 'basics/procurementstructure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createstructure',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletestructure',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatestructure',
			},
			roleInfo: <IDataServiceRoleOptions<IPrcStructureEntity>>{
				role: ServiceRole.Root,
				itemName: 'ProcurementStructure',
			},
		};

		super(options);
	}

	/**
	 * Provides the payload data required for creating a new entity.
	 * @returns An object containing the creation payload. If no entity is selected or no parent is found,
	 *          returns an empty object. Otherwise, returns an object with the parent’s ID as `PKey1`.
	 */
	protected override provideCreatePayload(): object {
		const selected = this.getSelectedEntity();

		if (selected === null) {
			return {};
		}

		const parent = this.parentOf(selected);
		if (parent) {
			return {
				parent: parent,
				parentId: parent.Id
			};
		} else {
			return {};
		}
	}

	/**
	 * Provides the payload data required for creating a child entity.
	 * @returns An object containing the data necessary for creating a child entity, including:
	 *          - `parent`: Alias for `ParentProcurementStructure`.
	 *          - `parentId`: The ID of the selected parent Procurement Structure, if available.
	 */
	protected override provideCreateChildPayload(): object {
		const parent = this.getSelectedEntity();
		return {
			parent: parent,
			parentId: parent?.Id
		};
	}

	/**
	 * Processes the successful creation of a procurement structure entity.
	 * @param created The object representing the newly created procurement structure entity.
	 *
	 * @returns The `IPrcStructureEntity` that was created.
	 */
	protected override onCreateSucceeded(created: object): IPrcStructureEntity {
		return created as IPrcStructureEntity;
	}

	/**
	 * Retrieves the child cost code entities of a given procurement structure entity
	 * @param element The `IPrcStructureEntity` whose child procurement structures are to be retrieved.
	 * @returns An array of `IPrcStructureEntity` representing the child procurement structures.
	 */
	public override childrenOf(element: IPrcStructureEntity): IPrcStructureEntity[] {
		return element.ChildItems ?? [];
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IPrcStructureEntity> {
		const result = CollectionHelper.Flatten(get(loaded, 'Main')! as IPrcStructureEntity[], (parent) => {
			return parent.ChildItems ? parent.ChildItems : [];
		});

		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [],
			},
			dtos: result,
		};
	}

	/**
	 * create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IPrcStructureEntity | null): PrcStructureComplete {
		return new PrcStructureComplete(modified);
	}

	//TODO: Need to double check whether base class provide related feature or not.
	public upgradeStructure() {
		const selectedEntities = this.getSelection();

		//Only handle the case there is only one item selected
		if (selectedEntities.length === 1) {
			const selected = selectedEntities[0];

			const parent = this.parentOf(selected);
			if (!parent) {
				throw new Error('Promoting entity: Cannot find the parent of the selected entity');
			}

			selected.PrcStructureFk = parent.PrcStructureFk;

			if (parent.ChildItems) {
				//TODO: maybe should use the base class method to remove the selected item from array.
				CollectionHelper.RemoveFrom([selected], parent.ChildItems);
			}

			const newParnent = this.parentOf(parent);
			//If parent is not root, add the selected item as chile to parent's parent
			if (newParnent && newParnent.ChildItems) {
				newParnent.ChildItems.push(selected);
			}

			this.setModified([selected]);
		}
	}

	//TODO: remove this override when the base class implemented it
	public override parentOf(element: IPrcStructureEntity): IPrcStructureEntity | null {
		const parentId = element.PrcStructureFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent ? parent : null;
	}

	//TODO: Need to double check whether base class provide related feature or not.
	public downgradeStructure() {
		const selectedEntities = this.getSelection();

		//Only handle the case there is only one item selected
		if (selectedEntities.length === 1) {
			const selected = selectedEntities[0];

			const parent = this.parentOf(selected);
			let preChild: IPrcStructureEntity | null = null;

			if (parent && parent.ChildItems) {
				const selIndexInParent = parent.ChildItems.indexOf(selected);

				if (selIndexInParent > 1) {
					preChild = parent.ChildItems[selIndexInParent - 1];
					CollectionHelper.RemoveFrom([selected], parent.ChildItems);
				}
			} else {
				const roots = this.getList().filter((e) => {
					return e.PrcStructureFk === null;
				});
				const selIndexInParent = roots.indexOf(selected);
				if (selIndexInParent > 0) {
					preChild = roots[selIndexInParent - 1];
				}
			}

			if (preChild) {
				selected.PrcStructureFk = preChild.Id;

				if (!preChild.ChildItems) {
					preChild.ChildItems = [];
				}
				preChild.ChildItems!.push(selected);

				this.setModified([selected]);
			}
		}
	}

	public canUpgradeStructure(): boolean {
		const selectedEntities = this.getSelection();

		//Only handle the case there is only one item selected
		if (selectedEntities.length === 1) {
			const selected = selectedEntities[0];

			//the selected item is not the root.
			return selected.PrcStructureFk !== null;
		}

		return false;
	}

	public canDowngradeStructure(): boolean {
		const selectedEntities = this.getSelection();

		//Only handle the case there is only one item selected
		if (selectedEntities.length === 1) {
			const selected = selectedEntities[0];

			const parent = this.parentOf(selected);
			if (parent && parent.ChildItems) {
				return parent.ChildItems.indexOf(selected) > 1;
			} else {
				return (
					this.getList()
						.filter((e) => {
							return e.PrcStructureFk === null;
						})
						.indexOf(selected) > 0
				);
			}
		}

		return false;
	}

	public async deepCopy() {
		const selectedEntities = this.getSelection();
		if (selectedEntities.length === 1) {
			const response = await this.http.post<{ PrcStructure: IPrcStructureEntity }>('basics/procurementstructure/deepcopy', this.getSelectedEntity());
			if (response.PrcStructure) {
				//TODO: DEV-38827 need to double in the future, the code below not work in current framework.
				this.append(response.PrcStructure);
				if (this.onCreateSucceeded) {
					this.onCreateSucceeded(response.PrcStructure);
				}
				this.entitiesUpdated(response.PrcStructure);
				return this.goToLast();
			}
		}
		return;
	}

	public override getModificationsFromUpdate(complete: PrcStructureComplete): IPrcStructureEntity[] {
		if (complete.PrcStructure === null) {
			return [];
		}

		return complete.PrcStructure ? [complete.PrcStructure] : [];
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, EntityArrayProcessor, DataServiceHierarchicalRoot, IEntityList } from '@libs/platform/data-access';

import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { BasicsSiteGridComplete } from '../model/basics-site-grid-complete.class';
import { CollectionHelper, IIdentificationData } from '@libs/platform/common';

export const BASICS_SITE_GRID_DATA_TOKEN = new InjectionToken<BasicsSiteGridDataService>('basicsSiteGridDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsSiteGridDataService extends DataServiceHierarchicalRoot<BasicsSiteGridEntity, BasicsSiteGridComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsSiteGridEntity> = {
			apiUrl: 'basics/sitenew',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				prepareParam: (ident: IIdentificationData) => {
					return {MainItemId: ident.pKey1};
				},
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				prepareParam: ident => {
                    return { mainItemId : ident.pKey1!};
                },
				usePost : true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint:'update',
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},

			},
			deleteInfo: <IDataServiceEndPointOptions>{				
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},
				endPoint: 'multidelete',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<BasicsSiteGridEntity>>{
				role: ServiceRole.Root,
				itemName: 'Site',
			},
			entityActions: {createSupported: true, deleteSupported: true},
			processors: [new EntityArrayProcessor<BasicsSiteGridEntity>(['ChildItems'])],
		};

		super(options);
	}
	
	protected override provideCreateChildPayload(): object {
		const parentSiteType = this.getSelectedEntity();
		const parent = this.getSelection().length > 0 ? this.getSelection()[0] : null;
		let allItem : BasicsSiteGridEntity[];
		const sorting = 0;

		if(parent === null){
			allItem = this.getList();
		}else{
			allItem = this.childrenOf(parent);
		}

		if (allItem.length > 0) {
			allItem.sort(this.sortId);
		}

		const creationData = {
				MainItemId:  parentSiteType?.Id,
				SiteTypeFk : parentSiteType?.Id,
				Sorting: sorting,
				parent: parent
			};

			return creationData;
	}

	public override save(): Promise<void> {
		const selection = this.getSelection();
		if (selection.length > 0) {
			const selectedEntity = selection[0];
			return this.update(selectedEntity).then(() => {
				console.log('Entity updated successfully!');
			}).catch(error => {
				// Handle error if update fails
				console.error('Error updating entity:', error);
			});
		} else {
			// No entity selected for update
			return Promise.resolve();
		}
	}

	public override createUpdateEntity(modified: BasicsSiteGridEntity | null): BasicsSiteGridComplete {
		const complete = new BasicsSiteGridComplete();
		if (modified !== null) {
			complete.mainItemId = modified.Id;
			complete.Site = [modified];
		} else if (this.hasSelection()) { // fix issue that missing initializing MainItemId(MainItemId is 0) when only updating 
			complete.mainItemId = this.getSelection()[0].Id;
		}


		return complete;
	}


	public override getModificationsFromUpdate(complete: BasicsSiteGridComplete) {
		if (complete.Site === null) {
			complete.Site = [];
		}

		return complete.Site;
	}	

	
	protected override checkCreateIsAllowed(entities: BasicsSiteGridEntity[] | BasicsSiteGridEntity | null): boolean {
		return true;
	}


	protected takeOverUpdatedFromComplete(complete: BasicsSiteGridComplete, entityList: IEntityList<BasicsSiteGridEntity>) {
		if (complete && complete.Site && complete.Site.length > 0) {
			entityList.updateEntities(complete.Site);
		}
	}
	public override  parentOf(element: BasicsSiteGridEntity): BasicsSiteGridEntity | null {
		if(element.SiteFk === undefined){
			return null;
		}

		const parentId = element.SiteFk;
		const foundParent = this.flatList().find(parent => parent.Id === parentId);

		if(foundParent === undefined){
			return null;
		}

		return foundParent;

	}

	public override childrenOf(element: BasicsSiteGridEntity): BasicsSiteGridEntity[] {
		return element.ChildItems ?? [];
	}

	private sortId = function(a: BasicsSiteGridEntity, b: BasicsSiteGridEntity){
		return a.Sorting - b.Sorting;
	};
	public cutAction(selectedAction: BasicsSiteGridEntity) {
		const copiedAction = selectedAction;
		// let deleteRecord = copiedAction.filter( x => x.id);
		return copiedAction;
	}

	public canUpgrade(){
		const selectedEntities = this.getSelection();
		if(selectedEntities.length === 1){
				const selected = selectedEntities[0];
				const parent = this.parentOf(selected);
				if(!parent) {
					throw new Error('Unable to find parent entity..');
				}
				selected.SiteFk = parent.SiteFk;
				const newParent = this.parentOf(parent);

				//If parent is not root, add the selected item as child
				if(newParent && newParent.ChildItems) {
					newParent.ChildItems.push(selected);
				}
				this.setModified([selected]);

			}

	}
	public canDowngrade() {
		const selectedEntities = this.getSelection();
		if(selectedEntities.length === 1){
			const selected = selectedEntities[0];
			const parent = this.parentOf(selected);
			let preChild: BasicsSiteGridEntity | null = null;

			if(parent && parent.ChildItems) {
				const selIndexInParent = parent.ChildItems.indexOf(selected);
				if(selIndexInParent > 1){
					preChild = parent.ChildItems[selIndexInParent - 1];
                    CollectionHelper.RemoveFrom([selected], parent.ChildItems);
				}
			}else{
				const roots = this.getList().filter(e => {
                    return e.SiteFk === null;		
                });
				const selIndexInParent = roots.indexOf(selected);
				if(selIndexInParent > 0){
					preChild = roots[selIndexInParent - 1];

				}
			}
			if(preChild){
				selected.SiteFk = preChild.Id;
				if(!preChild.ChildItems){
					preChild.ChildItems = [];
				}
				preChild.ChildItems!.push(selected);
				this.setModified([selected]);
			}
		}
		
	}
}

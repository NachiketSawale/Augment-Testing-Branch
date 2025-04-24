import { CompleteIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import {
	DataServiceHierarchicalNode, IDataServiceOptions, IEntityModification,
	IEntitySelection
} from '@libs/platform/data-access';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import * as _ from 'lodash';
import { EstimateMainResourceType } from '../../common/enums/estimate-main-resource-type.enum';
import { inject } from '@angular/core';
import { EstimateMainResourceImageProcessor } from '../../line-item/services/estimate-resource-image-process.service';
import { EstimateMainGenerateSortingService } from '../../common/services/estimate-main-generate-sorting.service';
import { HttpClient } from '@angular/common/http';

/**
 * Abstract class for Assembly Resource Base Data Service
 *
 * @template T - Resource base entity type
 * @template U - Complete identification type for T
 * @template PT - Parent line item base entity type
 * @template PU - Complete identification type for PT
 */
export abstract class EstimateResourceBaseDataService<
	T extends IEstResourceEntity,
	U extends CompleteIdentification<T>,
	PT extends IEstLineItemEntity,
	PU extends CompleteIdentification<PT>
> extends DataServiceHierarchicalNode<T, U, PT, PU> {

	/** Parent data service reference */
	protected parentDataService: IEntitySelection<PT> & IEntityModification<PT>;
	protected readonly http = inject(HttpClient);
	protected readonly configurationService = inject(PlatformConfigurationService);
	protected readonly estimateMainResourceImageProcessor = inject(EstimateMainResourceImageProcessor);
	protected readonly estimateMainGenerateSortingService = inject(EstimateMainGenerateSortingService);

	/**
	 * Constructor
	 *
	 * @param parentDataService Parent data service reference
	 * @param options Options including the item name
	 */
	protected constructor(parentDataService: IEntitySelection<PT> & IEntityModification<PT>, options: IDataServiceOptions<T>) {
		super(options);
		this.parentDataService = parentDataService;
		this.processor.addProcessor(this.estimateMainResourceImageProcessor);
	}

	public override childrenOf(element: T): T[] {
		if(element && element.EstResources){
			return element.EstResources as T[];
		}
		element.EstResources = [];
		return element.EstResources as T[];
	}

	public override parentOf(element: T): T | null {
		if (element.EstResourceFk == null) {
			return null;
		}

		const parentId = element.EstResourceFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public getRootParent(element: T): T | null{
		let parent = this.parentOf(element);
		while (parent && parent.EstResourceFk){
			parent = this.parentOf(parent);
		}
		return parent;
	}

	public getAllChildren(entities: T[]){
		const retVal : IEstResourceEntity[] = [];
		const resources : IEstResourceEntity[] = [...entities];
		while (resources.length > 0){
			const first = resources.shift();
			if(first){
				retVal.push(first);
				if(first.EstResources && first.EstResources.length > 0){
					resources.push(...first.EstResources);
				}
			}
		}
		return retVal as T[];
	}

	public override delete(entities: T[]) {
		const resourcesToDelete = this.getAllChildren(entities);
		return super.delete(resourcesToDelete as T[]);
	}

	/**
	 * Get reference to the parent data service
	 *
	 * @returns Parent data service reference
	 */
	public getParentService(): IEntitySelection<PT> {
		return this.parentDataService;
	}

	protected isParentCompositeResource(resItem: T): boolean {
		const item = this.parentOf(resItem);
		if(item){
			if (item.EstAssemblyTypeFk) {
				return true;
			} else if (item.EstResourceFk) {
				return this.isParentCompositeResource(item);
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	protected isParentPlantTypeResource(resource:T) {
		return !this.checkIfTopParentIsPlantType(resource);
	}

	protected checkIfTopParentIsPlantType(resource: T): boolean{
		if (!resource || !resource.EstResourceFk) {
			return false;
		}
		const parent = this.parentOf(resource);
		if (!parent) {
			return false;
		}
		if (parent.EstResourceTypeFk === EstimateMainResourceType.Plant) {
			return true;
		}

		return this.checkIfTopParentIsPlantType(parent);
	}

	public setLineTypeReadOnly(items: T[]) {
		items.forEach((item) => {
			if (!_.isEmpty(item.Code)) {
				//TODO: <estimateMainResourceProcessor> missing
				//this.estimateMainResourceProcessor.setLineTypeReadOnly(item, true);
			}
			const children = this.childrenOf(item);
			if(children && children.length){
				this.setLineTypeReadOnly(children);
			}
		});
	}

	/**
	 * @name markResourceAsModified
	 * @methodOf EstimateMainResourceService
	 * @description Mark Resource, Root Parent and Children at all level as modified
	 * @param {object} res IEstResourceEntity selected resource item
	 */
	public markResourceAsModified(res: T) {
		if (res.EstResourceFk && res.EstResourceFk > 0) {
			// get parent item and mark as modified
			const rootParent = this.getRootParent(res);
			if (rootParent) {
				this.setModified(rootParent);
				this.markChildrenAsModified(rootParent); //Todo mark children modified at all level
			} else {
				this.setModified(res);
			}
		} else {
			this.setModified(res);
			if (res.HasChildren && res.EstResources && res.EstResources.length > 0) {
				// get all children and mark as modified
				this.markChildrenAsModified(res);
			}
		}
	}

	/**
	 * @name markItemsAsModified
	 * @methodOf EstimateMainResourceService
	 * @description Mark Children at all level as modified
	 * @param {object} items IEstResourceEntity[]
	 */
	public markItemsAsModified(items: T[]) {
		this.setModified(items);
		items.forEach(item =>{
			this.markChildrenAsModified(item);
		});
	}

	/**
	 * @name markChildrenAsModified
	 * @methodOf EstimateMainResourceService
	 * @description Mark Children at all level as modified
	 * @param {object} parent IEstResourceEntity
	 */
	public markChildrenAsModified(parent: T) {
		const children: T[] = this.getAllChildren([parent]);
		if (Array.isArray(children) && children.length > 0) {
			this.setModified(children);
		}
	}

	/**
	 * build tree Node info of resource
	 * @param resource
	 * @param items
	 * @param subItemToAssign
	 */
	public buildNodeInfo(resource: T, items: T[], subItemToAssign: T | null = null) {
		let selectedResourceLevel = resource && resource.nodeInfo && resource.nodeInfo.level ? resource.nodeInfo.level : 0;
		// move
		if (subItemToAssign) {
			if (subItemToAssign.nodeInfo) {
				subItemToAssign.nodeInfo.collapsed = false;
				subItemToAssign.nodeInfo.children = true;
			} else {
				subItemToAssign.nodeInfo = { level: 0, collapsed: false, children: true };
			}
			selectedResourceLevel = selectedResourceLevel + 1;
		}
		// revert step
		if (selectedResourceLevel && resource && resource.EstResourceTypeFk !== EstimateMainResourceType.SubItem) {
			selectedResourceLevel = selectedResourceLevel - 1;
		}
		this.setNodeInfo(items, selectedResourceLevel);
	}

	public setNodeInfo(items: T[], level: number) {
		items.forEach((item) => {
			const collapsed = level > 0;
			item.nodeInfo = { collapsed: collapsed, level: level, children: item.HasChildren };
			const children = this.childrenOf(item);
			if (children && children.length) {
				this.setNodeInfo(children, level + 1);
			}
		});
	}

	/**
	 * add assembly resource to entityList, and mark assembly resources as modified,
	 * @param items
	 * @param subItemToAssign
	 * @param itemLevelToAssign
	 * @param selectResource
	 */
	public setAssemblyResourcesTreeToContainerData(items: T[], subItemToAssign: T | null = null, itemLevelToAssign: T | null = null, selectResource: T | null = null) {
		items.forEach((item) => {
			if (selectResource && selectResource.Id === item.Id) { // resolve
				// we do not add this item to data.itemList, because by default it already was added.
				this.setModified(item);
			} else {
				// add parent resource to itemTree
				if (!_.isNumber(item.EstResourceFk)) {
					if (subItemToAssign) { // move
						item.EstResourceFk = subItemToAssign.Id;
						subItemToAssign.HasChildren = true;
						this.appendTo(item, subItemToAssign);
					} else if (itemLevelToAssign) { // copy
						const parent = _.find(this.getList(), { Id: itemLevelToAssign.EstResourceFk });
						if (parent) {
							this.appendTo(item, parent as T);
						} else {
							this.append(item);
						}
					} else {
						this.append(item);
					}
				} else {
					this.append(item);
				}
				this.setModified(item);
			}

			if (item.HasChildren && item.EstResources) {
				this.setAssemblyResourcesTreeToContainerData(item.EstResources as T[]);
			}
		});
	}

	/**
	 * set Currency1Fk and Currency2Fk from selected LineItem
	 * @param items
	 */
	public setResourceCurrencies(items: T[]) {
		items.forEach((res) => {
			this.setResourceCurrency(res);
			const children = this.childrenOf(res);
			if (children && children.length > 0) {
				this.setResourceCurrencies(children);
			}
		});
	}

	/**
	 * set Currency1Fk and Currency2Fk from selected LineItem
	 * @param res
	 */
	public setResourceCurrency(res: T){
		const selectedItem = this.getSelectedParent();
		if(selectedItem){
			res.Currency1Fk = selectedItem.Currency1Fk;
			res.Currency2Fk = selectedItem.Currency2Fk;
		}
	}
}
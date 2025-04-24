/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCostGroupLookupService } from '../../lookup-services/basics-cost-group-lookup.service';
import { ColumnDef, createLookup, FieldType, FieldValidationInfo } from '@libs/ui/common';
import { extend, forEach } from 'lodash';
import { ValidationResult } from '@libs/platform/data-access';
import { BasicsCostGroupComplete } from '../../costgroups/model/basics-cost-group-complete.class';
import { ICostGroupCatEntity } from '../../costgroups/model/entities/cost-group-cat-entity.interface';
import { IBasicMainItem2CostGroup } from '../interface/main-item-2-cost-group.interface';
import { IBasicsSharedDynamicColumnService } from '../interface/dynamic-column.interface';

export abstract class BasicSharedCostGroupDynamicColumnService<T extends object> implements IBasicsSharedDynamicColumnService<T> {
	protected readonly fieldTag = 'costgroup_';
	protected costGroupCat?:BasicsCostGroupComplete | null;
	protected mainItem2CostGroups?:IBasicMainItem2CostGroup[] | null;
	protected modifiedEntities:IBasicMainItem2CostGroup[] = [];
	protected deletedEntities:IBasicMainItem2CostGroup[] = [];
	protected idx = -1;

	/*
	* create dynamic column and append them to LineItem Grid
	*/
	public generateColumns(): ColumnDef<T>[]{
		if(!this.costGroupCat) {
			return [];
		}

		const result:ColumnDef<T>[] = [];
		if(this.costGroupCat.LicCostGroupCats && this.costGroupCat.LicCostGroupCats.length > 0){
			forEach(this.costGroupCat.LicCostGroupCats, item =>{
				result.push(this.createColumn(item, false));
			});
		}

		if(this.costGroupCat.PrjCostGroupCats && this.costGroupCat.PrjCostGroupCats.length > 0){
			forEach(this.costGroupCat.PrjCostGroupCats, item =>{
				result.push(this.createColumn(item, true));
			});
		}

		return result;
	}

	/*
	* set relative dynamic value to lineItem entity
	*/
	public appendValue2Entity  (entities: T[]): void{
		if(this.costGroupCat) {
			if (this.costGroupCat.LicCostGroupCats && this.costGroupCat.LicCostGroupCats.length > 0) {
				forEach(this.costGroupCat.LicCostGroupCats, item => {
					this.setDefaultColValue(item, entities);
				});
			}

			if (this.costGroupCat.PrjCostGroupCats && this.costGroupCat.PrjCostGroupCats.length > 0) {
				forEach(this.costGroupCat.PrjCostGroupCats, item => {
					this.setDefaultColValue(item, entities);
				});
			}
		}

		if(!this.mainItem2CostGroups || this.mainItem2CostGroups.length <= 0 || entities.length<=0){
			return;
		}

		forEach(this.mainItem2CostGroups, item=>{
			const entity = this.getMatchedEntity(entities, item); // find(entities, {Id: item.MainItemId, EstHeaderFk: item.RootItemId});
			if(entity){
				const obj: { [key: string]: number } = {};
				const key = this.fieldTag+item.CostGroupCatFk||'0';
				obj[key] = item.CostGroupFk || 0;
				extend(entity, obj);
			}
		});
	}

	public clearUpdatedData() {
		this.modifiedEntities = [];
		this.deletedEntities = [];
	}

	protected getCostGroupColumnName(item: ICostGroupCatEntity){
		const description = item.DescriptionInfo?.Translated || item.DescriptionInfo?.Description;
		return description ? item.Code + '(' + description + ')' : item.Code;
	}

	private createColumn(item:ICostGroupCatEntity, isProjCostGroup: boolean): ColumnDef<T>{
		return {
			id: (isProjCostGroup ? this.fieldTag + 'prj_' :this.fieldTag + 'lic_') + item.Code,
			model: this.fieldTag + item.Id,
			type: FieldType.Lookup,
			lookupOptions:createLookup({
				dataServiceToken:BasicsCostGroupLookupService,
				showClearButton: true,
				showDescription: true,
				serverSideFilter:{
					key:'cost-group-filter',
					execute: () => {
						return {
							costGroupType:(isProjCostGroup ? 1 : 0),
							catalogIds: [item.Id],
							projectId: (isProjCostGroup ? item.ProjectFk : 0)
						};
					}
				}
			}),
			sortOrder: item.Sorting,
			label: this.getCostGroupColumnName(item),
			sortable: true,
			visible: true,
			readonly: false,
			validator: info => this.validateColumn(info, item)
		};
	}

	// set default value to entity, otherwise it can't be edit in Grid
	private setDefaultColValue(item:ICostGroupCatEntity, entities: T[]){
		forEach(entities, entity=>{
			const obj: { [key: string]: number } = {};
			const key = this.fieldTag + item.Id;
			obj[key] = 0;
			extend(entity, obj);
		});
	}

	public abstract getMatchedEntity(entities: T[], item2CostGroup: IBasicMainItem2CostGroup): T | null

	public abstract validateColumn(info: FieldValidationInfo<T>, item:ICostGroupCatEntity):  ValidationResult;

	public abstract initialData(readData: object): void;

	public abstract provideUpdateData(updateData: object): void;
}
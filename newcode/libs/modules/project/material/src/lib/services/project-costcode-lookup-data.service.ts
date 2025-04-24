import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { BasicsSharedCostCodeTypeLookupService, BasicsSharedCurrencyLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeCostCodeTypeEntity, ICostCodeEntity } from '@libs/basics/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import { ProjectMaterialPortionHelperService } from './project-material-portion-helper.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProjectCostCodeLookupDataService<TEntity extends ICostCodeEntity> extends UiCommonLookupTypeDataService<ICostCodeEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor(private readonly helperService: ProjectMaterialPortionHelperService) {
		super('projectCostCode', {
			uuid: '3e1083adb320419d8aa7374be1856e3f',
			idProperty: 'Id',
			valueMember: 'OriginalId',
			displayMember: 'Code',
			gridConfig: {
				uuid: '3e1083adb320419d8aa7374be1856e3f',
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 70,
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedUomLookupService,
							displayMember: 'Unit',
							valueMember: 'Id',
						}),
						label: { text: 'Uom', key: 'cloud.common.entityUoM' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 50,
					},
					{
						id: 'Rate',
						model: 'Rate',
						type: FieldType.Money,
						label: { text: 'Market Rate', key: 'cloud.common.entityUnitRate' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 70,
					},
					{
						id: 'CurrencyFk',
						model: 'CurrencyFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedCurrencyLookupService,
						}),
						label: { text: 'Currency', key: 'cloud.common.entityCurrency' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 80,
					},
					{
						id: 'IsLabour',
						model: 'IsLabour',
						type: FieldType.Boolean,
						label: { text: 'Labour', key: 'basics.costcodes.isLabour' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'IsRate',
						model: 'IsRate',
						type: FieldType.Boolean,
						label: { text: 'Fix', key: 'basics.costcodes.isRate' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'FactorCosts',
						model: 'FactorCosts',
						type: FieldType.Factor,
						label: { text: 'FactorCosts', key: 'basics.costcodes.factorCosts' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'RealFactorCosts',
						model: 'RealFactorCosts',
						type: FieldType.Factor,
						label: { text: 'RealFactorCosts', key: 'basics.costcodes.realFactorCosts' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 120,
					},
					{
						id: 'FactorQuantity',
						model: 'FactorQuantity',
						type: FieldType.Factor,
						label: { text: 'FactorQuantity', key: 'basics.costcodes.factorQuantity' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'RealFactorQuantity',
						model: 'RealFactorQuantity',
						type: FieldType.Factor,
						label: { text: 'RealFactorQuantity', key: 'basics.costcodes.realFactorQuantity' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'CostCodeTypeFk',
						model: 'CostCodeTypeFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup<ICostCodeEntity, IBasicsCustomizeCostCodeTypeEntity>({
							dataServiceToken: BasicsSharedCostCodeTypeLookupService,
							showClearButton: true,
						}),
						label: { text: 'Type', key: 'basics.costcodes.costcodetype' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'DayWorkRate',
						model: 'DayWorkRate',
						type: FieldType.Money,
						label: { text: 'DayWorkRate', key: 'basics.costcodes.dayWorkRate' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
					{
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Remark,
						label: { text: 'Remark', key: 'cloud.common.entityRemark' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100,
					},
				],
			},
			showDescription: true,
			events: [
				{
					name: 'onSelectedItemChanged',
					handler: (e) => {
						if(e.context.lookupInput?.selectedItem && e.context.entity) {
							this.helperService.changeCostCode(e.context.entity);
						}
					},
				},
			],
			treeConfig: {
				parentMember: 'CostCodeParentFk',
				childMember: 'CostCodes',
			},
			showGrid: true,
			showDialog: true,
		});
	}

	public override getList(): Observable<ICostCodeEntity[]> {
		return this.getDataList();
	}

	public override getItemByKey(key: IIdentificationData): Observable<ICostCodeEntity> {
		return new Observable((observer) => {
			const cacheItem = this.cache.getItem(key);

			if (cacheItem) {
				observer.next(cacheItem);
			} else {
				this.getDataList().subscribe({
					next: (items) => {
						observer.next(items.find((e) => e.Id === key.id));
					},
				});
			}
		});
	}

	private getDataList(): Observable<ICostCodeEntity[]> {
		return new Observable((observer) => {
			if (this.cache.loaded) {
				observer.next(this.cache.list);
			} else {
				const material = this.helperService.getMaterialEntity();
				const options = {
					params: {
						projectId: material?.ProjectFk ?? -1,
						jobId: material?.LgmJobFk ?? 0,
					},
				};
				this.http.get(this.configService.webApiBaseUrl + 'project/costcodes/mdcprjcostcodesbyjob', options).subscribe((res) => {
					const items = res as ICostCodeEntity[];
					if (this.cache.enabled) {
						this.cache.setList(items);
					}
					observer.next(items);
				});
			}
		});
	}
}

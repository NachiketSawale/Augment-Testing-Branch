/* eslint-disable prefer-const */
import { Component, inject, OnInit } from '@angular/core';
import { UiExternalModule } from '@libs/ui/external';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { ColumnDef, FieldType, GridComponent, IFormConfig, IFormValueChangeInfo, IGridConfiguration, IGridTreeConfiguration, UiCommonModule } from '@libs/ui/common';
import { BoqBlobSpecificationComponent } from '../boq-main-blob-specification.component';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { BoqMainBoqTypes } from '../../model/boq-main-boq-constants';
import { PlatformTranslateService } from '@libs/platform/common';
import { PlatformHttpService } from '@libs/platform/common';

export interface ISourceBoqEntity {
	boqTypeId: number
	boqTypeName: string
}

type BoqTypeEntry = {
	id: number,
	description: string
};

@Component({
  selector: 'boq-main-source-boq-component',
  standalone: true,
	imports: [
		UiExternalModule, UiCommonModule, BoqBlobSpecificationComponent, GridComponent
	],
  templateUrl: './source-boq.component.html'
})
export class SourceBoqComponent<T extends object> extends EntityContainerBaseComponent<T> implements OnInit {

	protected configuration!: IGridConfiguration<IBoqItemEntity>;
	protected formConfiguration!: IFormConfig<ISourceBoqEntity>;
	protected formEntityRuntimeData: EntityRuntimeData<ISourceBoqEntity> = new EntityRuntimeData<ISourceBoqEntity>();
	protected filterSettings: ISourceBoqEntity;
	private translateService = inject(PlatformTranslateService);
	private http: PlatformHttpService = inject(PlatformHttpService);
	private loadedBoqItemsMap: Map<number, IBoqItemEntity> = new Map<number, IBoqItemEntity>();

	// Todo-BH: shift back to 'displayName' once FieldType.Select works properly
//	private defaultBoqTypeList: ISelectItem<BoqMainBoqTypes>[] = [
	private defaultBoqTypeList: BoqTypeEntry [] = [
		{id: BoqMainBoqTypes.Wic, description: this.translateService.instant('boq.main.wicBoq').text}, // Todo-BH: Is it really neccessary to use the 'text' property? When opening dropdown only with 'text' property I can see strings !!
		{id: BoqMainBoqTypes.Project, description: this.translateService.instant('boq.main.projectBoq').text},
		{id: BoqMainBoqTypes.Package, description: this.translateService.instant('boq.main.packageBoq').text},
		{id: BoqMainBoqTypes.Contract, description: this.translateService.instant('boq.main.contractBoq').text}
	];

	public constructor() {
		super();

		// TODO-BH: First test for a filter entity
		this.filterSettings = {
			boqTypeId: 1,
			boqTypeName: 'WIC BoQ'
		};

		this.formConfiguration = {
			formId: 'sourceBoqFilter',
			showGrouping: false,
			rows: [
				{
					groupId: 'default',
					id: 'boqType',
					label: 'BoQ Type',
					type: FieldType.InputSelect, // Todo-BH: Should be FieldType.Select, but its completion is currently pending
					model: 'boqTypeName',
					//					itemsSource: {
					options: {
						items: this.defaultBoqTypeList,
						inputDomain: 'Description'
					}
				}
			]
		};
	}

	private initializeGrid(items: IBoqItemEntity[]) {
		this.configuration = {
			uuid: 'b2cbe4e3f01e4522b91c5d2524f2212c',
			columns:
				[{
					id: 'BoqLineTypeFk',
					label: this.translateService.instant('boq.main.BoqLineTypeFk'),
					type: FieldType.Integer,
					model: 'BoqLineTypeFk',
					readonly: true,
					visible: true,
					width: 85
				},{
					id: 'Reference',
					label: this.translateService.instant('boq.main.Reference'),
					type: FieldType.Description,
					model: 'Reference',
					readonly: true,
					visible: true,
					width: 150
				},
				{
					id: 'BriefInfo',
					label: this.translateService.instant('boq.main.BriefInfo'),
					type: FieldType.Translation,
					model: 'BriefInfo.Translated',
					readonly: true,
					visible: true,
					width: 200
				}] as ColumnDef<IBoqItemEntity>[],
			items: items,
			treeConfiguration: {
				children: boqItem => boqItem.BoqItems ?? [],
				parent: (boqItem: IBoqItemEntity) => {
					let parentBoqItem: IBoqItemEntity | null = null;

					if(boqItem && boqItem.BoqItemFk !== undefined && boqItem.BoqItemFk !== null) {
						return this.getLoadedBoqItem(boqItem.BoqItemFk);
					}

					return parentBoqItem;
				}
			} as IGridTreeConfiguration<IBoqItemEntity>
		};
	}

	private loadSelectedSourceBoq(boqHeaderId: number) : void {
		this.http.get$( 'boq/main/boqitemsforlookup?boqHeaderId=' + boqHeaderId).subscribe(result => {
			// Todo-BH: As the tree grid also needs to nagivate the parent hierarchy we have to provide this information, too.
			// Todo-BH: As the backend doesn't provide this information reliably at the moment, we determine it ourselves.
			// Todo-BH: Using 'BoqItemParent' navigation property currently leads to problems with slick grid.

			// TODO-BOQ: eslint any (deactivated)
			/*
			let loadedBoqItems = (<any>result).dtos as IBoqItemEntity[];
			this.loadedBoqItemsMap.clear();
			if(loadedBoqItems && loadedBoqItems.length > 0) {
				let flattenedLoadedBoqItems = BoqItemTreeHelper.flatten(loadedBoqItems);
				flattenedLoadedBoqItems.forEach(boqItem => {
					if(boqItem && boqItem.Id !== undefined && boqItem.Id !== null) {
						this.loadedBoqItemsMap.set(boqItem.Id, boqItem);
					}
				});

				this.initializeGrid(loadedBoqItems);
			}
			*/
		});
	}

	private getLoadedBoqItem(boqItemId: number): IBoqItemEntity | undefined {
		return this.loadedBoqItemsMap.get(boqItemId);
	}

	/**
	 * Loads the data into the grid on component initialization
	 */
	public ngOnInit(): void {
		this.initializeGrid([]);
	}

	public selectionChanged(selectedItems: IBoqItemEntity[]){
		// Todo-Boq: Something meaningful can be done here. Currently nothing is done
		//if(selectedItems && selectedItems.length > 0){
		//	const selectedItem = selectedItems[0];
		//}
	}

	public valueChanged(changeInfo: IFormValueChangeInfo<ISourceBoqEntity>): void {

		if(changeInfo.oldValue !== changeInfo.newValue) {
			let type = this.defaultBoqTypeList.find(item => {
				return item.description === changeInfo.newValue;
			});
			let newTypeId = -1;
			if(type) {
				newTypeId = type.id;
			}

			// Todo-Boq: As there are no further filter settings at the moment we simply use known boqHeader ids to trigger the loading of two distinct boqs.
			if(newTypeId === BoqMainBoqTypes.Wic) {
				this.loadSelectedSourceBoq(1064654);
			} else if(newTypeId === BoqMainBoqTypes.Project) {
				this.loadSelectedSourceBoq(11322);
			}
		}
	}
}

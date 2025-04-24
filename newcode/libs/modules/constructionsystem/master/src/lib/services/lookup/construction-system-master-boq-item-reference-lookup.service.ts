import {
	FieldType,
	IGridConfiguration,
	ILookupSearchRequest,
	ILookupSearchResponse,
	IMenuItemsList,
	IParentChildLookupDialog,
	PARENT_CHILD_LOOKUP_DIALOG_TOKEN,
	UiCommonLookupReadonlyDataService,
	UiCommonParentChildLookupDialogComponent
} from '@libs/ui/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { IEntityContext, IIdentificationData, LazyInjectable, PlatformHttpService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { COS_COMMON_BOQ_ITEM_REFERENCE_LOOKUP } from '@libs/constructionsystem/interfaces';
import { IBoqHeaderLookupEntity } from '@libs/boq/main';


@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IParentChildLookupDialog>({
	token: COS_COMMON_BOQ_ITEM_REFERENCE_LOOKUP,
	useAngularInjection: true,
})
export class ConstructionSystemMasterBoqItemReferenceLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IBoqItemEntity, TEntity> implements IParentChildLookupDialog {

	public constructor(http : PlatformHttpService) {
		super({
			uuid: 'D00F9424446B45A5A1C932FAF83BABD4',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
			dialogComponent: UiCommonParentChildLookupDialogComponent,
			/**
			 * Specifies the view providers for the component.
			 * This configuration provides the `TokenConfigProvider` with the value `GLOBAL_PARAMETER_LOOKUP`.
			 */
			viewProviders: [{ provide: PARENT_CHILD_LOOKUP_DIALOG_TOKEN, useValue: COS_COMMON_BOQ_ITEM_REFERENCE_LOOKUP }],
			showDialog: false,
			dialogOptions: {
				resizeable: false,
				headerText: { key: 'constructionsystem.master.boqLookup' }
			},
			// todo popupOptions: {
			// 	width: 420,
			// 	height: 300,
			// 	template: $templateCache.get('grid-popup-lookup.html'),
			// 	footerTemplate: $templateCache.get('lookup-popup-footer.html'),
			// 	controller: 'basicsLookupdataGridPopupController',
			// 	showLastSize: true
			// },
			gridConfig: {
				columns: [],
			},
		});
	}

	public getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<IBoqItemEntity> {
		return new Observable<IBoqItemEntity>((observer) => {
			const entity = context?.entity as IBoqItemEntity;
			if (entity) {
				observer.next(entity);
			}
			observer.complete();
		});
	}

	public getList(context: IEntityContext<TEntity> | undefined): Observable<IBoqItemEntity[]> {
		throw new Error('Method not implemented.');
	}

	public getSearchList(request: ILookupSearchRequest, context: IEntityContext<TEntity> | undefined): Observable<ILookupSearchResponse<IBoqItemEntity>> {
		return new Observable((observer) => {
			observer.next();
			observer.complete();
		});
	}

	public getChildGridStructure(): IGridConfiguration<object> {
		const childGridStructure: IGridConfiguration<IBoqItemEntity> = {
			uuid: '6B6AE18FFA93453796C6FFA60718CB13',
			items: [],
			columns: [
				{
					id: 'reference',
					model: 'Reference',
					type: FieldType.Integer,
					label: { key: 'boq.main.Reference', text: 'Reference No.' },
					sortable: false,
					readonly: true,
					width: 120
				},
				{
					id: 'description',
					model: 'BriefInfo.Translated',
					type: FieldType.Description,
					label: { key: 'cloud.common.entityBrief', text: 'Brief' },
					sortable: false,
					readonly: true,
					width: 120
				},
				{
					id: 'wicnumber',
					model: 'WicNumber',
					type: FieldType.Code,
					label: { key: 'boq.main.WicNumber', text: 'WIC No.' },
					sortable: false,
					readonly: true,
					width: 100
				}
			],
			treeConfiguration: {
				parent: (entity: IBoqItemEntity) => entity.BoqItemParent ?? null,
				children: (entity: IBoqItemEntity) => entity.BoqItems ?? [],
				width: 70
			}
		};
		return childGridStructure as IGridConfiguration<object>;
	}

	public getParentGridStructure(): IGridConfiguration<object> {
		const parentGridStructure: IGridConfiguration<IBoqItemEntity> = {
			uuid: 'D00F9424446B45A5A1C932FAF83BABD4',
			columns: [
				{
					id: 'boqnumber',
					model: 'BoqNumber',
					type: FieldType.Code,
					label: { key: 'boq.main.boqHeaderSel', text: 'Boq Number' },
					readonly: true,
					sortable: false,
					width: 100
				},
				{
					id: 'description',
					model: 'Description',
					type: FieldType.Description,
					label: { key: 'cloud.common.entityDescription', text: 'Description' },
					readonly: true,
					sortable: false,
					width: 300
				}
			],
			items: [],
			iconClass: null,
			skipPermissionCheck: false,
			enableColumnReorder: false,
			enableCopyPasteExcel: false
		};
		return parentGridStructure as IGridConfiguration<object>;
	}

	public getSearchResult(inputParameter: string): Observable<object[]> {
		//todo
		throw new Error('Method not implemented.');
	}

	public getToolbarItems(): IMenuItemsList<void> | undefined {
		return undefined;
	}

	public loadChildrenGridItems(parentItem: IBoqItemEntity): Observable<IBoqItemEntity[]> {
		return new Observable<IBoqItemEntity[]>((observe) => {
			this.http.get<IBoqItemEntity[]>('boq/main/tree', {
				params: {
					headerId: parentItem.BoqHeaderFk,
					startId: 0,
					depth: 99,
					recalc: 1
				}
			}).subscribe(res=>{
				return observe.next(res);
			});
		});
	}

	public loadParentGridItems(): Observable<IBoqHeaderLookupEntity[]> {
		return new Observable<IBoqHeaderLookupEntity[]>((observe) => {
			this.http.post<IBoqHeaderLookupEntity[]>('boq/main/getboqheaderlookup', {
				params: {
					BoqType: 1
				}
			}).subscribe(res=>{
				return observe.next(res);
			});
		});
	}
}
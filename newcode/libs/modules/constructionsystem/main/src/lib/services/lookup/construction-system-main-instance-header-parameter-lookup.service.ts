import {
	createLookup,
	FieldType,
	IGridConfiguration,
	ILookupSearchRequest,
	ILookupSearchResponse,
	IMenuItemsList,
	IParentChildLookupDialog,
	LookupSearchResponse,
	PARENT_CHILD_LOOKUP_DIALOG_TOKEN,
	UiCommonLookupReadonlyDataService,
	UiCommonParentChildLookupDialogComponent,
} from '@libs/ui/common';
import { IInstanceHeaderParameterEntity } from '../../model/entities/instance-header-parameter-entity.interface';
import { IIdentificationData, LazyInjectable, ServiceLocator } from '@libs/platform/common';
import { Injectable } from '@angular/core';
import { ConstructionSystemSharedParameterLayoutHelperService, ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainGlobalParameterGroupDataService } from '../construction-system-main-global-parameter-group-data.service';
import { Observable } from 'rxjs';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from '../construction-system-main-instance-header-parameter-data.service';
import { ConstructionSystemMainGlobalParameterLookupService } from './construction-system-main-global-parameter-lookup.service';
import { INSTANCE_HEADER_PARAMETER_LOOKUP } from '@libs/constructionsystem/interfaces';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IParentChildLookupDialog>({
	token: INSTANCE_HEADER_PARAMETER_LOOKUP,
	useAngularInjection: true,
})
export class ConstructionSystemMainInstanceHeaderParameterLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IInstanceHeaderParameterEntity, TEntity> implements IParentChildLookupDialog {
	private readonly groupService = ServiceLocator.injector.get(ConstructionSystemMainGlobalParameterGroupDataService);
	private readonly instanceParameterHeaderService = ServiceLocator.injector.get(ConstructionSystemMainInstanceHeaderParameterDataService);
	private readonly constructionSystemSharedParameterLayoutHelperService = ServiceLocator.injector.get(ConstructionSystemSharedParameterLayoutHelperService<IInstanceHeaderParameterEntity>);

	public constructor() {
		super({
			uuid: 'd0527fdc44a7457596b25ebe1b366646',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			dialogComponent: UiCommonParentChildLookupDialogComponent,
			/**
			 * Specifies the view providers for the component.
			 * This configuration provides the `TokenConfigProvider` with the value `GLOBAL_PARAMETER_LOOKUP`.
			 */
			viewProviders: [{ provide: PARENT_CHILD_LOOKUP_DIALOG_TOKEN, useValue: INSTANCE_HEADER_PARAMETER_LOOKUP }],
			showDialog: false,
			gridConfig: {
				columns: [],
			},
		});
	}

	/**
	 * Retrieves the configuration for the parent grid structure.
	 * @returns The grid configuration object for the parent grid.
	 */
	public getParentGridStructure(): IGridConfiguration<object> {
		const parentGridStructure: IGridConfiguration<ICosGlobalParamGroupEntity> = {
			uuid: '37bda79edce344b1821a8cc9aa262ec2',
			items: [],
			enableCopyPasteExcel: true,
			columns: [
				{
					id: 'code',
					model: 'Code',
					type: FieldType.Code,
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode',
					},
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'description',
					model: 'DescriptionInfo',
					type: FieldType.Translation,
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription',
					},
					sortable: true,
					visible: true,
					readonly: true,
				},
			],
			treeConfiguration: {
				parent: (entity: ICosGlobalParamGroupEntity) => {
					if (entity.CosGlobalParamGroupFk === undefined) {
						return null;
					}
					const parentId = entity.CosGlobalParamGroupFk;
					const foundParent = this.groupService.flatList().find((candidate) => candidate.Id === parentId);
					if (foundParent === undefined) {
						return null;
					}
					return foundParent;
				},
				children: (entity: ICosGlobalParamGroupEntity) => entity.CosGlobalParamGroupChildren ?? [],
			},
		};

		return parentGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Retrieves the configuration for the child grid structure.
	 * @returns The grid configuration object for the child grid.
	 */
	public getChildGridStructure(): IGridConfiguration<object> {
		const childGridStructure: IGridConfiguration<IInstanceHeaderParameterEntity> = {
			uuid: '782fc238176c4413bf704033e08af83b',
			columns: [
				{
					id: 'UomValue',
					model: 'UomValue',
					type: FieldType.Description,
					grouping: {
						title: 'cloud.common.entityUoM',
						getter: 'Code',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'Uom', key: 'cloud.common.entityUoM' },
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'parameterValueVirtual',
					model: 'ParameterValueVirtual',
					label: { text: 'Variable Name', key: 'constructionsystem.master.entityVariableName' },
					sortable: true,
					visible: true,
					readonly: true,
					...this.constructionSystemSharedParameterLayoutHelperService.provideParameterValueOverload(),
				},
				{
					id: 'cosMasterParameterType',
					model: 'CosMasterParameterType',
					type: FieldType.Description,
					label: { text: 'Parameter Type', key: 'constructionsystem.master.entityParameterTypeFk' },
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'cosGlobalParamFk',
					model: 'CosGlobalParamFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMainGlobalParameterLookupService,
						displayMember: 'VariableName',
					}),
					label: { text: 'Variable Name', key: 'constructionsystem.master.entityVariableName' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80,
				},
			],
			items: [],
			iconClass: null,
			skipPermissionCheck: false,
			enableColumnReorder: false,
			enableCopyPasteExcel: false,
		};
		return childGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Retrieves the toolbar items for the UI.
	 * @returns An array of toolbar menu items or undefined if no items are available.
	 */
	public getToolbarItems(): IMenuItemsList<void> | undefined {
		return undefined;
	}

	public loadParentGridItems(): Observable<ICosGlobalParamGroupEntity[]> {
		return new Observable((observer) => {
			this.groupService.refreshAll().then(() => {
				observer.next(this.groupService.getList());
				observer.complete();
			});
		});
	}

	public loadChildrenGridItems(entities: ICosGlobalParamGroupEntity[]): Observable<IInstanceHeaderParameterEntity[]> {
		return new Observable<IInstanceHeaderParameterEntity[]>((observer) => {
			if (entities.length > 0) {
				this.instanceParameterHeaderService.filterData.cosGlobalParamGroupFk = entities[0].Id;
				this.instanceParameterHeaderService.refreshParameter(null, false).then((response) => {
					this.instanceParameterHeaderService.refreshAfter(response);
					observer.next(this.instanceParameterHeaderService.getList());
					observer.complete();
				});
			} else {
				observer.next([]);
				observer.complete();
			}
		});
	}

	/**
	 * seems useless in current case, so I put nothing here
	 * @param key
	 */
	public override getItemByKey(key: IIdentificationData): Observable<IInstanceHeaderParameterEntity> {
		return new Observable<IInstanceHeaderParameterEntity>((observer) => {
			observer.next();
			observer.complete();
		});
	}

	public override getList() {
		return new Observable<IInstanceHeaderParameterEntity[]>((observer) => {
			observer.next(this.instanceParameterHeaderService.getList());
			observer.complete();
		});
	}

	public getSearchResult(inputParameter: string): Observable<object[]> {
		return new Observable<object[]>((observer) => {
			this.instanceParameterHeaderService.filterData.SearchValue = inputParameter;
			this.instanceParameterHeaderService.refreshParameter(null, false).then((response) => {
				this.instanceParameterHeaderService.refreshAfter(response);
				observer.next(this.instanceParameterHeaderService.getList());
			});
		});
	}

	public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<IInstanceHeaderParameterEntity>> {
		return new Observable<ILookupSearchResponse<IInstanceHeaderParameterEntity>>((observer) => {
			const response = new LookupSearchResponse(this.instanceParameterHeaderService.getList());
			observer.next(response);
			observer.complete();
		});
	}
}

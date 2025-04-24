/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceHierarchicalLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';

/**
 * Contract CallOffs data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractCallOffsDataService extends DataServiceHierarchicalLeaf<IConHeaderEntity, IConHeaderEntity, ContractComplete> {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private parentService = inject(ProcurementContractHeaderDataService);
	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);

	public constructor(parentService: ProcurementContractHeaderDataService) {
		const options: IDataServiceOptions<IConHeaderEntity> = {
			apiUrl: 'procurement/contract/callOffs',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: ident => {
					const selection = parentService.getSelectedEntity();
					return {
						mainItemId: selection?.ConHeaderFk ? selection?.ConHeaderFk : selection?.Id
					};
				}
			},
			roleInfo: <IDataServiceRoleOptions<IConHeaderEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'CallOffs',
				parent: parentService
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const selection = this.parentService.getSelectedEntity();
		return {
			MainItemId: selection!.Id,
		};
	}
	protected override onLoadSucceeded(loaded: object): IConHeaderEntity[] {
		let entities = loaded as IConHeaderEntity[];
		entities = this.treeDataHelper.flatTreeArray(entities, e => e.ChildItems);
		return entities;
	}

	public override childrenOf(element: IConHeaderEntity): IConHeaderEntity[] {
		return element.ChildItems ?? [];
	}

	public override parentOf(element: IConHeaderEntity): IConHeaderEntity | null {
		if (element.ConHeaderFk == null) {
			return null;
		}
		const parentId = element.ConHeaderFk;
		const parent = this.flatList().find(c => c.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override canCreate(): boolean {
		const selection = this.parentService.getSelectedEntity();
		return !!selection && (!!selection.ProjectChangeFk || selection.IsFramework) && super.canCreate();
	}

	public override canDelete(): boolean {
		const selection = this.getSelectedEntity();
		return !!selection && !!selection.ConHeaderFk && super.canDelete();
	}

	public override delete(entities: IConHeaderEntity[] | IConHeaderEntity) {
		const selection = this.getSelectedEntity();
		if (selection && selection.ConHeaderFk) {
			this.http.post(this.configService.webApiBaseUrl + 'procurement/contract/callOffs/delete', selection).subscribe({
				next: () => {
					const callOffsList = this.getList();
					// Remove the selected entity from the callOffsList
					callOffsList.forEach(callOff => {
						if (callOff.Id === selection.ConHeaderFk && callOff.ChildItems) {
							callOff.ChildItems = callOff.ChildItems?.filter(item => item.Id !== selection.Id);
						}
					});
					this.setList(callOffsList);

					// remove parent record
					let parentList = this.parentService.getList();
					parentList = parentList.filter(c => c.Id !== selection.Id);
					parentList.forEach(item => {
						if (item.Id === selection.ConHeaderFk && item.ChildItems) {
							item.ChildItems = item.ChildItems?.filter(item => item.Id !== selection.Id);
						}
					});
					this.parentService.setList(parentList);
				}
			});
		}
	}

	
	public override isParentFn(parentKey: IConHeaderEntity, entity: IConHeaderEntity): boolean {
		return entity.ConHeaderFk === parentKey.ConHeaderFk;
	}
}

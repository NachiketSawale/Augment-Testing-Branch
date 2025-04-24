/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { CosMasterComplete, ICosAssemblyEntity } from '../model/models';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ServiceLocator } from '@libs/platform/common';
import { IEstAssemblyCatEntity, IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ConstructionSystemMasterEstAssemblyCatLookupService } from './lookup/construction-system-master-est-assemblycat-lookup.service';
import { ConstructionSystemMasterEstAssemblyLookupService } from './lookup/construction-system-master-est-assembly-lookup.service';
interface ICosMasterAssemblyResponse {
	EstAssemblyCat: IEstAssemblyCatEntity[];
	estassemblyfk: IEstLineItemEntity[];
	dtos: ICosAssemblyEntity[];
}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterAssemblyDataService extends DataServiceFlatLeaf<ICosAssemblyEntity, ICosHeaderEntity, CosMasterComplete> {
	public constructor(private readonly parentService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosAssemblyEntity> = {
			apiUrl: 'constructionsystem/master/assembly',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosAssemblyEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosAssembly',
				parent: parentService,
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
		};

		super(options);
		this.processor.addProcessor([this.processData()]);
	}

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosAssemblyEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to load the assembly assignment data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosMasterAssemblyResponse): ICosAssemblyEntity[] {
		if (loaded.EstAssemblyCat && loaded.EstAssemblyCat.length > 0) {
			const estAssemblyCatLookupService = ServiceLocator.injector.get(ConstructionSystemMasterEstAssemblyCatLookupService);
			estAssemblyCatLookupService.cache.setList(loaded.EstAssemblyCat);
		}
		if (loaded.estassemblyfk && loaded.estassemblyfk.length > 0) {
			const estAssemblyLookupService = ServiceLocator.injector.get(ConstructionSystemMasterEstAssemblyLookupService);
			estAssemblyLookupService.cache.setList(loaded.estassemblyfk);
		}
		return loaded.dtos;
	}

	private processData() {
		return {
			process: (item: ICosAssemblyEntity) => {
				if (item.EstLineItemFk === 0) {
					item.EstLineItemFk = null;
				}
				if (item.EstAssemblyCatFk === 0) {
					item.EstAssemblyCatFk = null;
				}
				this.setEntityReadOnlyFields(item, [{ field: 'EstAssemblyCatFk', readOnly: true }]);
			},

			revertProcess() {},
		};
	}
}

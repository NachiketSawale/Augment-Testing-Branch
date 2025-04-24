/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { get } from 'lodash';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
import { BasicsProcurementStructureDataService } from '../procurement-structure/basics-procurement-structure-data.service';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import { IPrcConfiguration2GeneralsEntity } from '../model/entities/prc-configuration-2-generals-entity.interface';
import { BasicsSharedGeneralTypeLookupService, BasicsSharedProcurementConfigurationHeaderLookupService } from '@libs/basics/shared';


/**
 * Procurement structure general data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureGeneralDataService extends DataServiceFlatLeaf<IPrcConfiguration2GeneralsEntity, IPrcStructureEntity, PrcStructureComplete> {
	private generalTypeLookUpService = inject(BasicsSharedGeneralTypeLookupService);
	private configHeaderLookUpService = inject(BasicsSharedProcurementConfigurationHeaderLookupService);
	private defaultConfigHeaderId: number | undefined;
	private defaultGenerateTypeId: number | undefined;

	public constructor(parentService: BasicsProcurementStructureDataService) {
		const options: IDataServiceOptions<IPrcConfiguration2GeneralsEntity> = {
			apiUrl: 'basics/procurementstructure/general',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'creategeneral',
				usePost: true,
				prepareParam: ident => {
					let hasDefault: boolean = false;
					if (this.defaultConfigHeaderId && this.defaultGenerateTypeId) {
						const defaultItem = this.getList().find(item => item.PrcConfigHeaderFk == this.defaultConfigHeaderId && item.PrcGeneralsTypeFk == this.defaultGenerateTypeId);
						hasDefault = !defaultItem;
					}
					return {
						mainItemId: ident.pKey1!,
						setDefault: hasDefault
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcConfiguration2GeneralsEntity, IPrcStructureEntity, PrcStructureComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcConfiguration2generals',
				parent: parentService
			}
		};
		super(options);
		this.getDefaultLookUpValue();
	}

	private async getDefaultLookUpValue() {
		this.defaultGenerateTypeId = (await this.generalTypeLookUpService.getDefaultAsync())?.Id;
		this.defaultConfigHeaderId = (await this.configHeaderLookUpService.getDefaultAsync())?.Id;
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the general data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IPrcConfiguration2GeneralsEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}

	public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcConfiguration2GeneralsEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}

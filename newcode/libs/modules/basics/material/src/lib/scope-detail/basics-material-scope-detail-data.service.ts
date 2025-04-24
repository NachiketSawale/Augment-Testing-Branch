/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { Subject } from 'rxjs';
import { max } from 'mathjs';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';

import { BasicsMaterialScopeDataService } from '../scope/basics-material-scope-data.service';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { IBasicsPriceConditionHeaderService, IBasicsScopeDetailDataService, IMaterialScopeDetailEntity, IMaterialScopeEntity } from '@libs/basics/interfaces';
import { BasicScopeDetailCalculationService } from '@libs/basics/shared';
import { BasicsMaterialScopeDetailReadonlyProcessor } from './processors/scope-detail-readonly-processor.class';
import { BasicsMaterialScopeDetailTotalProcessor } from './processors/scope-detail-total-processor.class';
import { MaterialScopeDetailComplete } from '../model/complete-class/material-scope-detail-complete.class';
import { MaterialScopeComplete } from '../model/complete-class/material-scope-complete.class';

export const BASICS_MATERIAL_SCOPE_DETAIL_DATA_TOKEN = new InjectionToken<BasicsMaterialScopeDetailDataService>('basicsMaterialScopeDetailDataToken');

/**
 * Material scope detail with container name 'Scope of Supply' data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialScopeDetailDataService
	extends DataServiceFlatNode<IMaterialScopeDetailEntity, MaterialScopeDetailComplete, IMaterialScopeEntity, MaterialScopeComplete>
	implements IBasicsPriceConditionHeaderService<IMaterialScopeDetailEntity,MaterialScopeDetailComplete>, IBasicsScopeDetailDataService<IMaterialScopeDetailEntity> {

	private readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	public readonly scopeDetailCalculator = inject(BasicScopeDetailCalculationService);

	private componentScopeOfSupplyType: number[] = [];
	/**
	 * Emitter for priceCondition change
	 */
	public priceConditionChanged$ = new Subject<number | null>();

	public readonly readonlyProcessor: BasicsMaterialScopeDetailReadonlyProcessor;

	public constructor(
		private materialDataService: BasicsMaterialRecordDataService,
		private materialScopeDataService: BasicsMaterialScopeDataService) {
		super({
			apiUrl: 'basics/material/scope/detail',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialScopeDetailEntity, IMaterialScopeEntity, MaterialScopeComplete>>{
				role: ServiceRole.Node,
				itemName: 'ScopeDetail',
				parent: materialScopeDataService
			},
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true
			}
		});

		this.readonlyProcessor = new BasicsMaterialScopeDetailReadonlyProcessor(this);
		this.processor.addProcessor([
			this.readonlyProcessor,
			new BasicsMaterialScopeDetailTotalProcessor(this)
		]);
	}

	public getExchangeRate(): number {
		// No foreign currency in material module, just return 1.
		return 1;
	}

	protected override provideLoadPayload(): object {
		const selected = this.getSelectedParent();
		if (selected){
			return {
				mainItemId: selected.Id
			};
		} else {
			throw new Error('There should be a selected parent material to load the scope data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMaterialScopeDetailEntity[] {

		//TODO: need to load the cost group as dynamic data.
		return get(loaded, 'dtoes')! as IMaterialScopeDetailEntity[];
	}

	protected override provideCreatePayload(): object {
		const selected = this.getSelectedParent();
		if (selected){
			return {
				Id: { Id: selected.Id },
				MaxNo:  max([...this.getList().map(e=> e.ItemNo),0])
			};
		} else {
			throw new Error('There should be a selected parent material scope to load the scope detail data');
		}
	}

	protected override onCreateSucceeded(loaded: object): IMaterialScopeDetailEntity {

		return loaded as IMaterialScopeDetailEntity;
	}

	public override createUpdateEntity(modified: IMaterialScopeDetailEntity | null): MaterialScopeDetailComplete {
		return new MaterialScopeDetailComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: MaterialScopeComplete, modified: MaterialScopeComplete[], deleted: IMaterialScopeDetailEntity[]): void {
		if (modified && modified.some(() =>	true)) {
			parentUpdate.MaterialScopeDetailToSave = modified;
		}

		if (deleted && deleted.some(() =>	true)) {
			parentUpdate.MaterialScopeDetailToDelete	= deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialScopeComplete): IMaterialScopeDetailEntity[] {
		if	(complete && complete.MaterialScopeDetailToSave) {
			return complete.MaterialScopeDetailToSave.map(e => e.MaterialScopeDetail!);
		}

		return [];
	}

	public async applyScopeTotal() {
		let listPrice = 0;
		const currentScope = this.materialScopeDataService.getSelectedEntity()!;
		const currentMaterial = this.materialDataService.getSelectedEntity()!;

		if (currentScope.IsSelected) {
			const result = await this.scopeDetailCalculator.calculateScopeTotal(this.getList());
			listPrice = this.scopeDetailCalculator.round(result.total, this.scopeDetailCalculator.roundingType['ListPrice']);
		}

		currentMaterial.ListPrice = listPrice;
		this.materialDataService.recalculateCost(currentMaterial, currentMaterial.ListPrice, 'ListPrice');
	}

	public async reloadPriceCondition(entity: IMaterialScopeDetailEntity, priceConditionFk: number, priceListFk?: number): Promise<void> {
		// Todo - Reload price condition, will be handled in ticket https://rib-40.atlassian.net/browse/DEV-14463
	}

	public override isParentFn(parentKey: IMaterialScopeEntity, entity: IMaterialScopeDetailEntity): boolean {
		return entity.MaterialScopeFk === parentKey.Id;
	}
}

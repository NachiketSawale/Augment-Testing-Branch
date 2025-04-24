/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MainDataDto } from '@libs/basics/shared';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IProcurementCommonSalesTaxEntity } from '../model/entities/procurement-common-sales-tax-entity.interface';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';

/**
 * Sales Tax service
 */
export class ProcurementCommonSalesTaxDataService<T extends IProcurementCommonSalesTaxEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);

	private isLoadAll: boolean = true;

	public constructor(protected parentService: IReadonlyParentService<PT, PU>) {

		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/invoice/salestax',
			readInfo: {
				endPoint: 'tree',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'InvSalesTax',
				parent: parentService
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: parent.Id,
			ShowAll: this.isLoadAll
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dataDto = new MainDataDto<T>(loaded);
		return dataDto.Main;
	}

	public async recalculate(isRest: boolean | null) {
		const reset = isRest || false;
		const parent = this.parentService.getSelectedEntity()!;
		const params = {
			mainItemId: parent.Id,
			isRest: reset
		};
		await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'procurement/invoice/recalculate', {params: params}));
		await this.load({id: 0, pKey1: parent.Id});
	}
	public disabled(){
		const parent = this.parentService.getSelectedEntity();
		return !parent;// ||parent["SalesTaxMethodFk"]===1;
	}
	public refreshTotal(){
		this.isLoadAll = !this.isLoadAll;
		// this.parentService.updateEntities();
	}

	public override isParentFn(parentKey: PT, entity: T): boolean {
		return entity.InvHeaderFk === parentKey.Id;
	}
}
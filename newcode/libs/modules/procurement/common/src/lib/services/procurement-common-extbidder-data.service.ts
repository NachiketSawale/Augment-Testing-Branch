/*
 * Copyright(c) RIB Software GmbH
 */
import {
	CompleteIdentification,
	IEntityIdentification
} from '@libs/platform/common';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IProcurementCommonExtBidderEntity } from '../model/entities/procurement-common-extbidder-entity.interface';
import { inject } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { MainDataDto } from '@libs/basics/shared';
import { ProcurementCommonExtBidderReadonlyProcessor } from './processors/procurement-common-extbidder-readonly-processor.service';

export abstract class ProcurementCommonExtBidderDataService<T extends IProcurementCommonExtBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatNode<T,object, PT, PU> {
	public readonly readonlyProcessor: ProcurementCommonExtBidderReadonlyProcessor<T, PT, PU>;
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);

	protected constructor(protected parentService: IReadonlyParentService<PT, PU>) {

		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/package/extbidder',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'PrcPackage2ExtBidder',
				parent: parentService
			},
			createInfo: {
				endPoint: 'createnew',
			}
		};
		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			MainItemId: this.getPackageFk(parent)
		};
	}

	protected override onCreateSucceeded(created: object): T {
		return created as unknown as T;
	}

	protected override provideLoadPayload(): object {
		//todo-when this.getPackageFk() return null,the request should not proceed--https://rib-40.atlassian.net/browse/DEV-19738 is closed,Modify the code below
		const parent = this.getSelectedParent()!;
		return {
			MainItemId: this.getPackageFk(parent)
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dataDto = new MainDataDto<T>(loaded);
		return dataDto.Main;
	}

	protected createReadonlyProcessor() {
		return new ProcurementCommonExtBidderReadonlyProcessor(this, this.isReadonly(), this.isReadonlyByBP());
	}

	public override create(): Promise<T> {
		const parent = this.parentService.getSelectedEntity()!;
		if (!this.getPackageFk(parent)) {
			this.messageBoxService.showErrorDialog('procurement.common.extBidderPackageMissing');
			return Promise.reject('Package FK missing');
		} else {
			return super.create();
		}
	}

	private isReadonlyByBP() {
		const selectedItem = this.getSelectedEntity();
		if (selectedItem) {
			return selectedItem.BusinessPartnerFk === null;
		}
		return false;
	}

	protected abstract getPackageFk(parent: PT): number;

	protected abstract isReadonly(): boolean;

}
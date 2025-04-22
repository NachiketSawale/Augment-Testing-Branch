/*
 * Copyright(c) RIB Software GmbH
 */

import { set } from 'lodash';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions
} from '@libs/platform/data-access';
import {
	CompleteIdentification,
	IEntityIdentification,
	IIdentificationData,
	PlatformConfigurationService, PlatformHttpService
} from '@libs/platform/common';
import { ServiceRole } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { MainDataDto } from '@libs/basics/shared';
import { IPrcHeaderDataService } from '../model/interfaces';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonSuggestedBidderReadonlyProcessorService } from './processors/procurement-common-suggested-bidder-readonly-processor.service';

export abstract class ProcurementCommonSuggestBiddersDataService<T extends IPrcSuggestedBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {

	/**
	 * List all entities or not
	 */
	public isListAll = true;

	protected createdTotals: T[] = [];
	protected abstract internalModuleName: ProcurementInternalModule;

	protected http = inject(PlatformHttpService);
	protected configService = inject(PlatformConfigurationService);
	public readonly readonlyProcessor: ProcurementCommonSuggestedBidderReadonlyProcessorService<T, PT, PU>;

	protected constructor(
		public parentService: IPrcHeaderDataService<PT, PU> & IReadonlyParentService<PT, PU>
	) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/common/suggestedbidder',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const parent = this.parentService.getSelectedEntity()!;
					return {
						MainItemId: this.getMainItemId(parent)
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcSuggestedBidder',
				parent: parentService
			}
		};

		super(options);
		this.readonlyProcessor = new ProcurementCommonSuggestedBidderReadonlyProcessorService(this);

		this.processor.addProcessor([
			this.readonlyProcessor,
		]);
	}


	/**
	 * Get MainItemId from parent entity
	 * @param parent
	 * @protected
	 */
	protected getMainItemId(parent: PT): number {
		return parent.Id!;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: T[], deleted: T[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'PrcSuggestedBidderToSave', modified);
		}
		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'PrcSuggestedBidderToDelete', deleted);
		}
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: this.getMainItemId(parent)
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dto = new MainDataDto<T>(loaded);
		return dto.Main;
	}
}
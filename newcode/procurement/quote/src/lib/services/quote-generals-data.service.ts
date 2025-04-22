/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcGeneralsEntity, PrcCreateContext, ProcurementCommonGeneralsDataService } from '@libs/procurement/common';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * quote generals data service
 */
export class ProcurementQuoteGeneralsDataService extends ProcurementCommonGeneralsDataService<IPrcGeneralsEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {

	public constructor(protected quoteDataService: ProcurementQuoteHeaderDataService) {
		super(quoteDataService, {});
	}

	public override getHeaderContext() {
		return this.quoteDataService.getHeaderContext();
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: QuoteHeaderEntityComplete, modified: IPrcGeneralsEntity[], deleted: IPrcGeneralsEntity[]): void {
		if (modified?.some(() => true)) {
			parentUpdate.PrcGeneralsToSave = modified;
		}
		if (deleted?.some(() => true)) {
			parentUpdate.PrcGeneralsToDelete = deleted;
		}
	}

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IPrcGeneralsEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}


	public override getSavedEntitiesFromUpdate(parentUpdate: QuoteHeaderEntityComplete): IPrcGeneralsEntity[] {
		if (parentUpdate?.PrcGeneralsToSave) {
			return parentUpdate.PrcGeneralsToSave;
		}
		return [];
	}

	protected override provideCreatePayload(): PrcCreateContext {
		const headerContext = this.getHeaderContext();
		return {
			MainItemId: headerContext.prcHeaderFk,
			PrcConfigFk: headerContext.prcConfigFk,
			StructureFk: headerContext.structureFk,
			ProjectFk: headerContext.projectFk
		};
	}
}
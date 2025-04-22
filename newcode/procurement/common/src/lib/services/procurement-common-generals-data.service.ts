/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IPrcModuleValidatorService } from '../model/interfaces';
import { IPrcGeneralsEntity } from '../model/entities/prc-generals-entity.interface';
import { ProcurementCommonDataServiceFlatLeaf } from './procurement-common-data-service-flat-leaf.service';
import { ProcurementCommonGeneralsReadonlyProcessor } from './processors/procurement-common-generals-readonly-processor.service';
import { IPrcGeneralsReloadData } from '../model/interfaces/prc-generals-reload-data.interface';

/**
 * The basic data service for procurement Generals entity
 */
export abstract class ProcurementCommonGeneralsDataService<T extends IPrcGeneralsEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementCommonDataServiceFlatLeaf<T, PT, PU> {
	private readonly readonlyProcessor: ProcurementCommonGeneralsReadonlyProcessor<T, PT, PU>;
	protected createReloadUrl: string = 'procurement/common/prcgenerals/reloadbybp';

	protected constructor(
		public override parentService: IPrcModuleValidatorService<PT, PU> & IReadonlyParentService<PT, PU>,
		protected config: { apiUrl?: string; itemName?: string },
	) {
		const dataConfig: { apiUrl: string; itemName: string; endPoint?: string } = {
			apiUrl: config.apiUrl || 'procurement/common/prcgenerals',
			itemName: config.itemName || 'PrcGenerals',
		};
		super(parentService, dataConfig);

		this.readonlyProcessor = this.createReadonlyProcessor();

		this.processor.addProcessor([this.readonlyProcessor]);
	}

	protected createReadonlyProcessor() {
		return new ProcurementCommonGeneralsReadonlyProcessor(this);
	}

	public updateReadOnlyFields(item: T) {
		this.readonlyProcessor.process(item);
	}

	protected override onCreateSucceeded(created: object): T {
		return super.onCreateSucceeded(created);
	}

	public controllingUnitSideFilterValue(): object {
		const header = this.getHeaderContext();
		return {
			PrjProjectFk: header?.projectFk,
			ExtraFilter: false,
			ByStructure: true,
		};
	}

	public async reloadGeneralsByBusinessPartnerFk(parameters: IPrcGeneralsReloadData) {
		this.http.post(this.configurationService.webApiBaseUrl + this.createReloadUrl, parameters);
		//todo reload data, should be put in the background code
		// if (res && res.data) {
		//     var originaltypes = res.data.OriginalGeneralTypes;`
		//     var main = res.data.Main;
		//     if (originaltypes) {
		//         angular.forEach(service.getList(), function (item) {
		//             if (item.PrcGeneralstypeFk && _.includes(originaltypes, item.PrcGeneralstypeFk)) {
		//                 serviceContainer.data.deleteItem(item, serviceContainer.data);
		//             }
		//         });
		//     }
		//     if (main) {
		//         angular.forEach(main, function (item) {
		//             if (serviceContainer.data.onCreateSucceeded && !_.find(service.getList(), {PrcGeneralstypeFk: item.PrcGeneralstypeFk})) {
		//                 serviceContainer.data.onCreateSucceeded(item, serviceContainer.data, {});
		//             }
		//         });
		//     }
		// }
	}
}

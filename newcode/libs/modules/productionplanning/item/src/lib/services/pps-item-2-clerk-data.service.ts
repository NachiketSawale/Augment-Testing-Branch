import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IPPSItem2ClerkEntity} from '../model/entities/pps-item-2clerk-entity.interface';
import {IPPSItemEntity} from '../model/entities/pps-item-entity.interface';
import {PPSItemComplete} from '../model/entities/pps-item-complete.class';
import {PpsItemDataService} from './pps-item-data.service';
import {PpsItem2ClerkValidationDataService} from './pps-item-2-clerk-validation-data.service';
import {BasicsSharedNewEntityValidationProcessorFactory} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class PpsItem2ClerkDataService extends DataServiceFlatLeaf<IPPSItem2ClerkEntity, IPPSItemEntity, PPSItemComplete> {
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);

	public constructor(private ppsItemDataService: PpsItemDataService ) {
		const options: IDataServiceOptions<IPPSItem2ClerkEntity> = {
			apiUrl: 'productionplanning/item/clerk',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'list',
				usePost: false,
				prepareParam: () => {
					const ppsItem = ppsItemDataService.getSelectedEntity();
					return {itemFk: ppsItem?.Id};
				}
			},
			createInfo: {
				prepareParam: () => {
					const ppsItem = ppsItemDataService.getSelectedEntity();
					return {
						Id: ppsItem?.Id ?? -1
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPPSItem2ClerkEntity, IPPSItemEntity, PPSItemComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PPSItemClerk',
				parent: ppsItemDataService
			}
		};

		super(options);
		this.processor.addProcessor(this.provideNewEntityValidationProcessor());
	}

	public override isParentFn(parentKey: IPPSItemEntity, entity: IPPSItem2ClerkEntity): boolean {
		return true;
	}

	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(PpsItem2ClerkValidationDataService, {
			moduleSubModule: 'ProductionPlanning.Item',
			typeName: 'PPSItem2ClerkDto'
		});
	}
}
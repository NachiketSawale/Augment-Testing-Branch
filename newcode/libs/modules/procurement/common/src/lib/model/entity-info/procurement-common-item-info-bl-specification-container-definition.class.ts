import { ContainerDefinition } from '@libs/ui/container-system';
import { BasicsSharedPlainTextContainerComponent } from '@libs/basics/shared';

export class ProcurementCommonItemInfoBlSpecificationContainerDefinition {
	public static prcCommonItemInfoBlSpecificaionPlainContainer(config: { uuid: string; id: string; permission: string }): ContainerDefinition {
		return new ContainerDefinition({
			id: config.id,
			containerType: BasicsSharedPlainTextContainerComponent,
			title: {
				text: 'Item Info (Baseline) Specification Plain',
				key: 'procurement.common.item.itemInfoBLSpecification',
			},
			uuid: config.uuid,
			permission: config.permission,
		});
	}
}

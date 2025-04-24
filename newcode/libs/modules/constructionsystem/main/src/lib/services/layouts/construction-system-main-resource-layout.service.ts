import { FieldOverloadSpec, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { ESTIMATE_MAIN_RESOURCE_LAYOUT_TOKEN } from '@libs/estimate/shared';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICosEstResourceEntity } from '../../model/entities/cos-est-resource-entity.interface';
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainResourceLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	public async generateLayout(): Promise<ILayoutConfiguration<ICosEstResourceEntity>> {
		const resourceCommonLayoutService = await this.lazyInjector.inject(ESTIMATE_MAIN_RESOURCE_LAYOUT_TOKEN);
		const cosMainResourceLayout = await resourceCommonLayoutService.generateLayout();
		if (cosMainResourceLayout.groups) {
			cosMainResourceLayout.groups = cosMainResourceLayout?.groups.filter((e) => e.gid !== 'Allowance');
			const basicsGroup = cosMainResourceLayout?.groups?.find((e) => e.gid === 'basicData');
			if (basicsGroup) {
				basicsGroup?.attributes.push('CompareFlag');
			}
		}
		///merge overloads
		const defaultOverloads = cosMainResourceLayout.overloads;
		cosMainResourceLayout.overloads = { ...defaultOverloads, ...customizeOverload() };
		return cosMainResourceLayout;

		/**
		 * Customize overload for construction system main resource
		 */
		function customizeOverload(): { [key in keyof Partial<ICosEstResourceEntity>]: FieldOverloadSpec<ICosEstResourceEntity> } {
			return {
				// CompareFlag: {// it is not shown
				// 	type: FieldType.Image,
				// 	// formatterOptions: { ///todo image type is not finish in framework
				// 	// 	imageSelector: 'constructionsystemMainCompareflagImageProcessor'
				// 	// }
				// },
				Code: {
					readonly: false,
					//type: FieldType.Lookup, /// todo wait for lookup estimate-main-resource-code-lookup
				},
				//DescriptionInfo  todo wait for lookup estimate-main-resource-code-lookup
				CostUnit: {
					readonly: true,
					//formatter: todo framework not support DEV-15667
				},
				//Quantity todo framework not support DEV-15667 formatter
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				BasCurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyReadonlyLookupOverload(),
				//estresourcetypeshortkey  todo estimateMainResourceTypeLookupService not ready and DEV-15667 formatter
			};
		}
	}
}

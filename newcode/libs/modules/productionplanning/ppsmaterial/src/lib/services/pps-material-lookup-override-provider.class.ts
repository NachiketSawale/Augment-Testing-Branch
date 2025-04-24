// todo in the future
// import { ServiceLocator } from '@libs/platform/common';
// import { ConcreteFieldOverload, FieldType, IAdditionalLookupOptions } from '@libs/ui/common';
// import { PPS_MATERIAL_PRODUCTIONMODES_TOKEN } from '../model/pps-material-production-modes';

// export class PpsMaterialLookupOverloadProvider {

// 	public static provideProductionModeReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
// 		return {
// 			readonly: true,
// 			type: FieldType.Select,
// 			itemsSource: {
// 				items: ServiceLocator.injector.get(PPS_MATERIAL_PRODUCTIONMODES_TOKEN)
// 			}
// 		};
// 	}

// }
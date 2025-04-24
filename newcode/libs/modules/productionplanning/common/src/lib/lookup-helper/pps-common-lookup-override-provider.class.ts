import { ConcreteFieldOverload, createLookup, FieldType, IAdditionalLookupOptions } from '@libs/ui/common';
import { PpsCommonLocationInfoLookupService } from '../lookup-service/pps-common-location-info-lookup.service';
import { IPpsCommonLocationInfoEntity } from '../model/entities/pps-common-location-info-entity.interface';

export class PpsCommonLookupOverloadProvider {

	public static provideLocationInfoReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IPpsCommonLocationInfoEntity>({
				dataServiceToken: PpsCommonLocationInfoLookupService,
				readonly: true,
				displayMember: 'BranchPath',
			})
		};
	}

}
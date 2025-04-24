import {EntityInfo} from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';

import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import {  Package2HeaderDataService } from '../../services/package-2header-data.service';
import { MODULE_INFO_PROCUREMENT } from '@libs/procurement/common';
import { IReqHeaderLookUpEntity, ProcurementShareReqLookupService } from '@libs/procurement/shared';
export const PACKAGE_2HEADER_INFO = EntityInfo.create<IPackage2HeaderEntity>({
	grid: {
		title: { text: 'Sub Package', key: MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.pacakge2headerGridTitle' },
	},
	form: {
		title: { text: 'Sub Package Detail', key: MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.pacakge2headerFormTitle' },
		containerUuid: '6dd9b281d92540ef82e0a9d0e4cc12df'
	},
	dataService: (ctx) => ctx.injector.get(Package2HeaderDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_PROCUREMENT.ProcurementPackagePascalCasedModuleName, typeName: 'PrcPackage2HeaderDto' },
	permissionUuid: 'fc591e48f5e740ad84068d97747a31ad',
	layoutConfiguration: {
		groups: [
			{
				'gid': 'basicData',
				'attributes': ['Description', 'CommentText', 'ReqHeaderFk']
			}
		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.CloudCommonModuleName + '.', {
				Description: {key: 'entityDescription'},
			}),
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.EstimateMainModuleName + '.', {
				CommentText: {key: 'comment'},
			}),
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.', {
				ReqHeaderFk: {key: 'entityReqCode'}
			})
		},
		overloads: {
			ReqHeaderFk: {
				readonly:true,
				type: FieldType.Lookup,
				lookupOptions: createLookup<IPackage2HeaderEntity, IReqHeaderLookUpEntity>({
					dataServiceToken: ProcurementShareReqLookupService,
					displayMember: 'Code',
				})
			}
		}
	}
});
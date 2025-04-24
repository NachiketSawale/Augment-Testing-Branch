import { EntityInfo } from '@libs/ui/business-base';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';
import { ProcurementPackageEstimateHeaderDataService } from '../../services/package-estimate-header-data.service';
import { EST_HEADER_LAYOUT } from './package-est-header-layout.model';
export const PROCUREMENT_PACKAGE_EST_HEADER_ENTITY_INFO = EntityInfo.create<IEstHeaderEntity>({
	grid: {
		title: 'procurement.package.estimateHeaderGridControllerTitle',
		containerUuid: '2682301ee1ad4b4ab523df2361a9fb3f',
	},
	dataService: (ctx) => ctx.injector.get(ProcurementPackageEstimateHeaderDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstHeaderDto' },
	permissionUuid: '2682301ee1ad4b4ab523df2361a9fb3f',
	layoutConfiguration: EST_HEADER_LAYOUT,
});

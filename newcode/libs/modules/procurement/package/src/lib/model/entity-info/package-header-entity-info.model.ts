import { EntityInfo } from '@libs/ui/business-base';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { ProcurementModule } from '@libs/procurement/shared';
import {
	BasicsSharedPackageStatusLookupService,
	BasicsSharedNumberGenerationService, BasicsSharedCompanyContextService,
} from '@libs/basics/shared';
import { ProcurementCommonSystemOptionBudgetEditingService } from '@libs/procurement/common';
import { ProcurementPackageSystemOptionShowPackageAutoUpdateDialogService } from '../../services/system-option-show-package-auto-update-dialog.service';
import { ProcurementPackageSystemOptionIsProtectContractedPackageItemAssignmentService } from '../../services/system-option-is-protect-contracted-pkg-item-assign.service';
import { ProcurementPackageHeaderValidationService } from '../../services/validations/package-header-validation.service';
import { ProcurementPackageRemarkContainerComponent } from '../../components/package-remark-container/package-remark-container.component';
import { IPackageRemarkAccessor, PACKAGE_REMARK_ACCESSOR } from '../entities/package-remark-accessor.interface';
import { PackageRemarkName } from '../enums/package-remark-name.enum';
import { ProcurementPackageHeaderLayoutService } from '../../services/layout-services/package-header-layout.service';

export const PROCUREMENT_PACKAGE_HEADER_ENTITY_INFO = EntityInfo.create<IPrcPackageEntity>({
	grid: {
		title: 'procurement.package.pacHeaderGridTitle',
	},
	form: {
		title: 'procurement.package.pacHeaderFormTitle',
		containerUuid: '2394ed1a419c49929bb3d3aac991e628',
	},
	permissionUuid: '1d58a4da633a485981776456695e3241',
	dataService: (ctx) => ctx.injector.get(ProcurementPackageHeaderDataService),
	validationService: (ctx) => ctx.injector.get(ProcurementPackageHeaderValidationService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Package, typeName: 'PrcPackageDto' },
	prepareEntityContainer: async (ctx) => {
		const prcCompanyContextSrv = ctx.injector.get(BasicsSharedCompanyContextService );
		const numberService = ctx.injector.get(BasicsSharedNumberGenerationService);
		const budgetEditingService = ctx.injector.get(ProcurementCommonSystemOptionBudgetEditingService);
		const isShowPackageAutoUpdateDialogService = ctx.injector.get(ProcurementPackageSystemOptionShowPackageAutoUpdateDialogService);
		const packageStatusLookupService = ctx.injector.get(BasicsSharedPackageStatusLookupService);
		const isProtectedContractedPkgItemAssignmentService = ctx.injector.get(ProcurementPackageSystemOptionIsProtectContractedPackageItemAssignmentService);
		await Promise.all([
			prcCompanyContextSrv.prepareLoginCompany(),
			numberService.getNumberGenerateConfig('procurement/package/numbergeneration/list'),
			budgetEditingService.getBudgetEditingInProcurementAsync(),
			isShowPackageAutoUpdateDialogService.getIsShowAsync(),
			packageStatusLookupService.getList(),
			isProtectedContractedPkgItemAssignmentService.getIsProtectedAsync(),
		]);
	},
	layoutConfiguration:(ctx) => ctx.injector.get(ProcurementPackageHeaderLayoutService).getLayout(),
	additionalEntityContainers: [
		// remark container
		{
			uuid: '1CV22AB7897R4B0F8196F4C5978EXA59',
			title: 'procurement.package.remarkContainerTitle',
			containerType: ProcurementPackageRemarkContainerComponent,
			providers: [
				{
					provide: PACKAGE_REMARK_ACCESSOR,
					useValue: <IPackageRemarkAccessor<IPrcPackageEntity>>{
						getText(remarkName: PackageRemarkName, entity: IPrcPackageEntity): string | undefined {
							switch (remarkName) {
								case PackageRemarkName.Remark:
									return entity.Remark;
								case PackageRemarkName.Remark2:
									return entity.Remark2;
								case PackageRemarkName.Remark3:
									return entity.Remark3;
							}
						},
						setText(remarkName: PackageRemarkName, entity: IPrcPackageEntity, value?: string) {
							if (value) {
								switch (remarkName) {
									case PackageRemarkName.Remark:
										entity.Remark = value;
										break;
									case PackageRemarkName.Remark2:
										entity.Remark2 = value;
										break;
									case PackageRemarkName.Remark3:
										entity.Remark3 = value;
										break;
								}
							}
						},
					},
				},
			],
		},
	],
});

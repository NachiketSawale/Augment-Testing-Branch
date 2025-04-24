import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType } from '@libs/ui/common';
import { MODULE_INFO_PROCUREMENT } from '@libs/procurement/common';
import { IPrcPackageImportEntity } from '../entities/prc-package-import-entity.interface';
import { PackageImportBehavior } from '../../behaviors/package-import-behavior.service';
import { PackageImportDataService } from '../../services/package-import-data.service';
import { PackageImportStatusItems } from '../Items/package-import-status-items';
import { ProcurementPackageImportDialogComponent } from '../../components/package-import-dialog/package-import-dialog.component';

export const PACKAGE_IMPORT_INFO = EntityInfo.create<IPrcPackageImportEntity>({
	grid: {
		title: { text: 'Sub Package', key: MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.packageImportWarningTitle' },
		containerUuid: '8a276c0574f94690a6087d9f22a06519',
		behavior: (ctx) => ctx.injector.get(PackageImportBehavior),
	},
	dataService: (ctx) => ctx.injector.get(PackageImportDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_PROCUREMENT.ProcurementPackagePascalCasedModuleName, typeName: 'PrcPackageImportDto' },
	permissionUuid: '8a276c0574f94690a6087d9f22a06519',
	layoutConfiguration: {
		transientFields: [
			{
				id: 'WarningMessage',
				model: 'WarningMessage',
				type: FieldType.CustomComponent,
				componentType: ProcurementPackageImportDialogComponent,
				label: { key: MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.import.warningMessage' },
			},
			{
				id: 'InsertTime',
				model: 'InsertTime',
				type: FieldType.DateUtc,
				label: { key: MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.import.time' },
				readonly: true,
			},
		],
		groups: [
			{
				gid: 'basicData',
				attributes: ['Status', 'WarningMessage', 'InsertTime'],
			},
		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.', {
				Status: { key: 'import.status' },
			}),
		},
		overloads: {
			Status: {
				readonly: true,
				type: FieldType.Select,
				itemsSource: {
					items: PackageImportStatusItems,
				},
			},
		},
	},
});

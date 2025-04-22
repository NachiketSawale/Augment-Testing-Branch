import { ProcurementCommonTotalEntityInfo } from '@libs/procurement/common';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementPackageTotalDataService } from '../../services/package-total-data.service';
import { ProcurementPackageTotalBehavior } from '../../behaviors/procurement-package-total-behavior.service';
import { ProcurementPackageTotalValidationService } from '../../services/validations/procurement-package-total-validation.service';

export const PROCUREMENT_PACKAGE_TOTAL_ENTITY_INFO = ProcurementCommonTotalEntityInfo.create({
	permissionUuid: '35dbeb11e37b46869a4decc4fd01f56e',
	formUuid: '518524d88c2f4c6fb3ed8df003624bf8',
	dataServiceToken: ProcurementPackageTotalDataService,
	validationServiceToken:ProcurementPackageTotalValidationService,
	behavior: ProcurementPackageTotalBehavior,
	dtoSchemeConfig: { moduleSubModule: ProcurementModule.Package, typeName: 'PrcPackageTotalDto' },
});

import {
	ProcurementCommonMasterRestrictionBoqHeaderLookupServiceProvider
} from '@libs/procurement/common';
import {IEntityContext, ServiceLocator} from '@libs/platform/common';
import {extend} from 'lodash';
import {IPrcPacMasterRestrictionEntity} from '../entities/prc-pac-master-restriction-entity.interface';
import {UiCommonLookupEndpointDataService} from '@libs/ui/common';
import {IBoqHeaderLookupEntity} from '@libs/boq/main';

export class PackageMasterRestrictionBoqHeaderLookupServiceProvider {

	public static getPackageBoqHeaderLookupService(): UiCommonLookupEndpointDataService<IBoqHeaderLookupEntity, IPrcPacMasterRestrictionEntity> {
		const provider = this.getCommonProvider();
		return provider.createLookup('procurement.package.packageboq', {
			boqType: 4, packageIds: []
		}, {
			filterParam: true,
			prepareListFilter(context?: IEntityContext<IPrcPacMasterRestrictionEntity>): string | object {
				const packageIds: number[] = [];
				if (context && context.entity && context.entity.PrcPackageBoqFk) {
					packageIds.push(context.entity.PrcPackageBoqFk);
				}

				const customFilter = {
					boqType: 4,
					packageIds: packageIds
				};

				return extend(provider.defaultFilter, customFilter);
			}
		});
	}

	public static getContractBoqHeaderLookupService(): UiCommonLookupEndpointDataService<IBoqHeaderLookupEntity, IPrcPacMasterRestrictionEntity> {
		const provider = this.getCommonProvider();
		return provider.createLookup('procurement.package.contractboq', {
			boqType: 7, contractIds: []
		}, {
			filterParam: true,
			prepareListFilter(context?: IEntityContext<IPrcPacMasterRestrictionEntity>): string | object {
				const contractIds: number[] = [];
				if (context && context.entity && context.entity.ConHeaderFk) {
					contractIds.push(context.entity.ConHeaderFk);
				}

				const customFilter = {
					boqType: 7,
					contractIds: contractIds
				};

				return extend(provider.defaultFilter, customFilter);
			}
		});
	}


	private static getCommonProvider(): ProcurementCommonMasterRestrictionBoqHeaderLookupServiceProvider<IPrcPacMasterRestrictionEntity> {
		return ServiceLocator.injector.get(ProcurementCommonMasterRestrictionBoqHeaderLookupServiceProvider);
	}
}
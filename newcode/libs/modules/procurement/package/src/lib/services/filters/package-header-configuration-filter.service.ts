import {Injectable} from '@angular/core';
import { ILookupServerSideFilter, ServerSideFilterValueType} from '@libs/ui/common';
import {ProcurementConfigurationEntity, Rubric} from '@libs/basics/shared';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageHeaderConfigurationFilterService implements ILookupServerSideFilter<ProcurementConfigurationEntity, IPrcPackageEntity> {
	public key = 'procurement-package-configuration-filter';
	public execute(): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return 'RubricFk = ' + Rubric.Package;
	}
}
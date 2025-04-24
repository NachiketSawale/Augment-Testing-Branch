import { IEntityProcessor } from '@libs/platform/data-access';
import { IResourceMasterResourceEntity } from '@libs/resource/interfaces';
import { ResourceMasterResourceDataService } from './data/resource-master-resource-data.service';
import { ICompany, PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { isNil } from 'lodash';

export class ResourceMasterResourceProcessor<T extends IResourceMasterResourceEntity> implements IEntityProcessor<T> {
	private companyMap: Map<number, ICompany> = new Map<number, ICompany>();
	/**
	 *The constructor
	 */
	public constructor(protected dataService: ResourceMasterResourceDataService, protected platformConfigurationService: PlatformConfigurationService) {
		firstValueFrom(platformConfigurationService.getCompaniesWithRoles()).then(cs => this.companiesTreeToMap(cs.companies));
	}
	public companiesTreeToMap(companiesList: ICompany[]) {
		companiesList.forEach(company =>  {
			this.companyMap.set(company.id, company);
			if (company.children) {
				this.companiesTreeToMap(company.children);
			}
		});
	}
	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		const signedInClientId = this.platformConfigurationService.getContext().signedInClientId;
		let flag = item.CompanyFk === signedInClientId;
		if (!flag && !isNil(item.CompanyFk)) {
			const company = this.companyMap.get(item.CompanyFk);
			flag = !!company && company.companyType === 3 && company.parentId === signedInClientId;
		}
		this.setColumnReadOnly(item, 'CompanyFk', !flag);
		this.setColumnReadOnly(item, 'IsLive', true);
		this.setColumnReadOnly(item, 'Rate', item.IsRateReadOnly);
		this.setColumnReadOnly(item, 'ItemFk', item.ItemFk === null);
	}

	private setColumnReadOnly(item: T, column: string, flag: boolean) {
		const fields = [
			{field: column, readOnly: flag}
		];
		this.dataService.setEntityReadOnlyFields(item, fields);
	}
	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}
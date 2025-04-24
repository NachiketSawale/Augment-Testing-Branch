import { ICompany } from './company.interface';
import { IRole } from './role.interface';
import { IRolesLookup } from './roles-lookup.interface';
import { IRoleDescriptionsLookup } from './role-description-lookup.interface';

export interface IGetCompanyRole {
	companies: ICompany[];
	roles: IRole[];
	rolesLookup: IRolesLookup[];
	roleDescriptionsLookup: IRoleDescriptionsLookup[];
}
import { ICompany } from './company.interface';
import { IRole } from './role.interface';
import { IRolesLookup } from './roles-lookup.interface';
import { IRoleDescriptionsLookup } from './role-description-lookup.interface';

export interface ICheckCompanyResponse {
	isValid: boolean;
	signedInCompanyCode: string;
	signedInCompanyName: string;
	companyCode: string;
	companyName: string;
	roleName: string;
	signedInCompanyId: number;
	companyId: number;
	requestedPermissionCompanyId: number;
	requestedRoleId: number;
	secureClientRolePart: string;
	companies?: ICompany[];
	roles?: IRole[];
	rolesLookup?: IRolesLookup[];
	roleDescriptionsLookup?: IRoleDescriptionsLookup[];
}
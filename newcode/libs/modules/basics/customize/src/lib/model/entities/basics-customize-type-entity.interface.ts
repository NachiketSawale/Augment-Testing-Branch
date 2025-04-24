import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IBasicsCustomizeTypeEntity extends IEntityBase, IEntityIdentification {
	Identifier: string;
	ClassName: string;
	DBTableName: string;
	ModuleName: string;
	Name: string;
	DefaultName: string;
	Type: string;
	Create: boolean;
	Delete: boolean;
	Edit: boolean;
	Hidden: boolean;
	HasRequiredProperty: boolean;
	UseCompanyContext: string;
	Action: string;
	InstanceAction: string;
}

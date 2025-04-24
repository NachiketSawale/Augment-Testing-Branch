export interface ISysContext {
	clientCode: string;
	clientId: number | undefined;
	clientName: string | undefined;
	permissionClientId: number;
	permissionObjectInfo: string;
	permissionRoleId: number | undefined;
	signedInClientCode: string;
	signedInClientId: number | undefined;
	signedInClientName: string | undefined;
	culture?: string | null | undefined;
	dataLanguageId?: string | number | undefined;
	language?: string | null | undefined;
	secureClientRole?: string | undefined;
	isLoggedIn?: boolean;
}
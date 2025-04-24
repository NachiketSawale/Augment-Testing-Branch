export enum ServiceRole {
	Root,
	Node,
	Leaf
}

/**
 * Interface providing th different options which can be set to data services
 * @typeParam T -  entity type handled by the data service
 * @typeParam PT -  entity type handled by the parent data service
 */
// TODO: check whether this generic parameter is required
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IDataServiceRoleOptions<T> {
	readonly itemName: string,

	/**
	 * Information about the role of the service created
	 */
	readonly role: ServiceRole,
}

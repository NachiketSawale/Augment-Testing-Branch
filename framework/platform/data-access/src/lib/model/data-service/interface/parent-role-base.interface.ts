/**
 * Interface for parent (sub) element data service
 * Especially for usage in cases the type information of the parent service is not needed / available. I.e. in the implementation
 * of subordinated (child) services
 * The functionality provided is the really base set of function necessary for a parent (root / node) data service
 */
export interface IParentRoleBase {
	/**
	 * Determine if the service is a root service, if it's not, the service is a node service
	 */
	isRoot(): boolean;
}

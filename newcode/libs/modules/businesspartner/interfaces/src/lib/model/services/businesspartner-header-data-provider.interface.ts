export interface IBusinesspartnerHeaderDataProvider<T extends object> {
	refreshOnlySelected(selected: T[]): Promise<T[]>;
}
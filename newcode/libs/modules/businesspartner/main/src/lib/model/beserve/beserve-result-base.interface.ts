export interface IBeserveSearchResultBaseEntity<T> {
	resultcode: number;
	resultmessage?: string | null;
	resultdata?: T | null;
}

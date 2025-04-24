import {CrefoSearchParams} from './crefo-search-params.class';

export interface ICrefoOption {
	loading: boolean;
	searchParams: CrefoSearchParams;
	keepfilter: boolean;
	selectedItemId: number | null;
	noresult: boolean,
	resultMessage: string | null;
	searchStarted: string;
	searchIdle: string;
	keepFilterChkLabel: string;
}
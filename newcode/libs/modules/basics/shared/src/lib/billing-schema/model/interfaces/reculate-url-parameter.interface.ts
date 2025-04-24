export interface  IReculateUrlParameter {
	baseUrl: string;
	params: {
		[key: string]: string | number;
	};
}
export interface IWorkflowHeader {
	headline: string;
	showFilter: boolean;
	showSettings: boolean;
	listConfig: {
		filter: {
			value: string;
		};
	};
}
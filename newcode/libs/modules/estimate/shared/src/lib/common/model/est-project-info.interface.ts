// An interface that represents project information
export interface IEstProjectInfo {
	// Project number or identification code
	ProjectNo: string,

	// Project name
	ProjectName: string,

	// Unique identifier for the project
	ProjectId: number,

	// Currency code or value related to the project (Note: Using number may not be ideal for currency codes, consider using string or enum instead)
	ProjectCurrency: number,

	// Optional: Calendar ID related to the project
	PrjCalendarId?: number|null,

	// Long project number or more detailed identification code
	ProjectLongNo: string
}
/**
 * Interface for export material result
 */
export interface IExportMaterialData {
    /**
     * FileExtension
     */
	FileExtension: string;

    /**
     * FileName
     */
	FileName: string;

    /**
     * Url
     */
	Url: string;

    /**
     * path
     */
	path: string
}

/**
 * Interface for export material request
 */
export interface IMaterialExportParameters{
    /**
     * objectFk
     */
    objectFk: number;

    /**
     * ProjectFk
     */
    ProjectFk?: number | null

    /**
     * CurrencyFk
     */
    CurrencyFk: number;

    /**
     * moduleName
     */
    moduleName: string;

    /**
     * subObjectFk
     */
    subObjectFk: number;
}
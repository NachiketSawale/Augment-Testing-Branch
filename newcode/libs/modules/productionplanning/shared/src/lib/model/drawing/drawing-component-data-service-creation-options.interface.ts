import { IParentRole } from '@libs/platform/data-access';


export interface IDrawingComponentDataServiceCreationOptions<PT extends object, PU extends object> {

	parentService?: IParentRole<PT, PU>;

	endPoint?: string;

	useLocalResource?: boolean;

	productTemplateKey?: string;

	drawingKey?: string;
}
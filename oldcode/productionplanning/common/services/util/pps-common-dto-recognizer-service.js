(function () {
	'use strict';
	angular.module('productionplanning.common').service('ppsCommonDtoRecognizerService', Service);
	Service.$inject = ['platformSchemaService'];

	function Service(platformSchemaService) {

		let isMappingDto = (dto, schemasOption, ignoredFields = []) => {
			const dtoSchema = platformSchemaService.getSchemaFromCache(schemasOption).properties;
			const propertyNames = Object.getOwnPropertyNames(dtoSchema);
			ignoredFields = ignoredFields.concat(['Inserted', 'Updated']);
			for (let i = 0; i < propertyNames.length; i++) {
				// skip dynamic slot fields and ignored fields
				if (propertyNames[i].includes('_slot_') || propertyNames[i].endsWith('_week') || ignoredFields.includes(propertyNames[i])) {
					continue;
				}

				if (!Object.prototype.hasOwnProperty.call(dto, propertyNames[i])) {
					return false;
				}
			}
			return true;
		};

		let isPPSItemDto = (entity) => {
			const ignoredFields = ['BoQRefNo']; // for some cases(like change PU status), we get Entity as Dto from service side, but Entity(not a Dto) doesn't include some additional properties of Dto, so we ignore these properties
			return isMappingDto(entity, {typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'}, ignoredFields);
		};

		let isProductDto = (entity) => {
			const ignoredFields = ['PpsStackListDocument', 'PpsLayoutDrawingDocument', 'PpsQTODocument', 'PpsPositionPlanDocument', 'PpsPositionPlanDocument', 'PpsEPADocument']; // for some cases(like change product status), we get Entity as Dto from service side, but Entity(not a Dto) doesn't include some additional properties of Dto, so we ignore these properties
			return isMappingDto(entity, {typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'}, ignoredFields);
		};

		return {
			isMappingDto: isMappingDto,
			isPPSItemDto: isPPSItemDto,
			isProductDto: isProductDto,
		};
	}
})();
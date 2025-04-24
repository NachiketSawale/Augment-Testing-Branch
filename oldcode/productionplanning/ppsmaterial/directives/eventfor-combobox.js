(function(angular){
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    angular.module(moduleName).directive('productionplanningPpsMaterialEventForComboBox',productionplanningPpsMaterialEventForComboBox);
    productionplanningPpsMaterialEventForComboBox.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

        function productionplanningPpsMaterialEventForComboBox(BasicsLookupdataLookupDirectiveDefinition) {
            var defaults = {
                lookupType: 'eventFor',
                valueMember: 'Id',
                displayMember: 'Code'
            };

            return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
                dataProvider: 'productionplanningPpsMaterialEventForDataService'
            });
        }


})(angular);


var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.directive("singleTypeahead", function ($filter) {
    var that = this;

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            addNewText: '@',
            stLookup: '=',
            stAddNew: '=',
            ngModel: '='
        },
        //
        //    '<input single-typeahead class="form-control* typeahead*" type="text" *autocomplete="off"* ng-model="item.location" />',
        link: function mtlink($scope, $element, $attr, ngModel) {
            $element.addClass("typeahead").attr("autocomplete","off");

            $element.typeahead({
                source: $scope.stLookup,
                addItem: { id: -1, name: $scope.addNewText },
                minLength: 2,
                updater: function (item, e) {
                    window.clearTimeout(that.notUpdated);

                    if (item.id == -1)
                        $scope.stAddNew();
                    else {
                        $scope.ngModel = { Text: item.name, Value: item.id };
                        return item.name;
                    }
                }
            });

            ngModel.$parsers.push(function parseString (value) {
                if (!value && !value.name)
                    return undefined;

                if (value.Text)
                    return value;

                if (ngModel.$modelValue && (value == ngModel.$modelValue.Text))
                    return ngModel.$modelValue;

                var item = $filter('filter')($scope.stLookup, { name: value }, true);
                if (item.length == 1)
                    return { Text: item[0].name, Value: item[0].id };

                return undefined;
            });

            ngModel.$formatters.push(function format(item) {
                item = item || {};
                return item.Text;
            });

            ngModel.$validators.validItem = function (modelValue, viewValue) {
                return viewValue == modelValue.Text;
            };

            $element.on("blur", function () {
                ngModel.$validate();
                if (ngModel.$invalid)
                    $element.val('');
            });

            ngModel.$render = function () {
                $element.val(ngModel.$viewValue);
            };
        }

    };
});
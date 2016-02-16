var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.directive("defaultButtons", function () {
    return {
        restrict: 'AE',
        scope: {
            targetDefaultClass: '@',
            targetCancelClass: '@',
            defaultAction: '&',
            cancelAction: '&'
        },
        link: function defaultButtonsLink($scope, $element) {
            var selected;
            var form;

            if ($element.is("input,select"))
                selected = $element;
            else if ($element.is("form,ng-form"))
                form = $element;

            selected = selected || $element.find("input,select");
            form = form || $element.closest("form,ngform");

            $scope.defaultAction = $scope.defaultAction || form.find("." + $scope.targetDefaultClass).click;
            $scope.cancelAction = $scope.cancelAction || form.find("." + $scope.targetCancelClass).click;

            selected.keypress(function (eventArgs) {
                if (eventArgs.which == 13)
                    $scope.defaultAction();
                if (eventArgs.which == 27)
                    $scope.cancelAction();
            });
        }
    };
});

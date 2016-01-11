var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.directive("bootstrapDialog", function () {
    return {
        restrict: 'E',
        //scope: {
        //    primaryText: '@',
        //    primaryAction: '&',
        //    title: '@'
        //},
        template: function ($element, $attributes) {
            var howToClose = $attributes.closeAction ? 'ng-click="' + $attributes.closeAction + '"' : 'data-dismiss="modal"';

            return '<div class="modal fade" tabindex="-1" role="dialog">' +
                '<div class="modal-dialog" tabindex="0">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" ' + howToClose + ' aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title">' + $attributes.title + '</h4>' +
                        '</div>' +
                        '<div class="modal-body" ng-include="' + $attributes.include + '">' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-primary" ng-click="' + $attributes.primaryAction + '()">' + $attributes.primaryText + '</button>' +
                            '<button type="button" class="btn btn-default" ' + howToClose + '>Close</button>' +
                        '</div>' +
                    '</div><!-- /.modal-content -->' +
                '</div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->';
        },
        link: function dialogLink($scope, $element, $attributes) {
            $scope.$on("$includeContentLoaded", function () {
                $element.find("input,textarea,select").keypress(function (eventArgs) {
                    if (eventArgs.which == 13) {
                        $scope.$apply($scope.$eval($attributes.primaryAction));
                    } else if (eventArgs.which == 27)
                        $element.find(".modal").modal('hide');
                });
            });

            $element.find(".modal").on("shown.bs.modal", function () {
                $element.find("input,textarea,select").first().select();
            });
        }

    };

});
 
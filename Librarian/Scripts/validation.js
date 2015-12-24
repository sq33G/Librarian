var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.service("validationService", function ValidationService() {
    var that = this;

    that.validateForm = function (form) {
        form.$setPristine();
        form.$setSubmitted();

        return form.$valid;
    };

    that.invalidField = function (form, field) {
        return field.$invalid && form.$submitted && field.$pristine;
    };

    that.invalidFieldClass = function (form, field) {
        if (that.invalidField(form, field))
            return 'has-error has-feedback';

        return '';
    };

    that.invalidIconClass = function (form, field) {
        if (that.invalidField(form, field))
            return 'glyphicon-remove';

        return '';
    }
});

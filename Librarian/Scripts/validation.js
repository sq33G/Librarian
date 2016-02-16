var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.service("validationService", function ValidationService() {
    var that = this;

    that.validateForm = function (form, customValidate) {
        if (customValidate)
            customValidate();

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
})

.factory("ValidatingForm", function formValidatorFactory(validationService) {
    return function FormValidator() {
        var that = this;

        that.invalidFieldClass = function (field) {
            if (field) return validationService.invalidFieldClass(that.form(), field);
        };

        that.invalidIconClass = function (field) {
            if (field) return validationService.invalidIconClass(that.form(), field);
        };

        that.isValid = function () {
            return validationService.validateForm(that.form(), that.customValidate);
        }
    };
});

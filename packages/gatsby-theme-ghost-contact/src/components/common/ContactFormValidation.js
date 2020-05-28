// A custom validation function. This must return an object
// which keys are symmetrical to our values/initialValues
export const useValidate = text => (values) => {
    const errors = {}
    if (!values.name) {
        errors.name = `${text(`FULL_NAME_REQUIRED`)}.`
    } else if (values.name.length < 3) {
        errors.name = `${text(`FULL_NAME_MUST_BE`)} ${text(`AT_LEAST`)} 3 ${text(`CHARACTERS_LONG`)}.`
    } else if (values.name.length > 20) {
        errors.name = `${text(`FULL_NAME_MUST_BE`)} 20 ${text(`CHARACTERS_OR_LESS`)}.`
    }

    if (!values.email) {
        errors.email = `${text(`EMAIL_IS_REQUIRED`)}.`
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = `${text(`INVALID_EMAIL_ADDRESS`)}.`
    }

    if (values.subject === `topic`) {
        errors.subject = `${text(`PLEASE_SELECT_SUBJECT`)}.`
    }

    if (!values.message) {
        errors.message = `${text(`MESSAGE_TEXT_IS_REQUIRED`)}.`
    } else if (values.message.length < 10) {
        errors.message = `${text(`MESSAGE_MUST_BE`)} ${text(`AT_LEAST`)} 10 ${text(`CHARACTERS_LONG`)}.`
    } else if (values.message.length > 4000) {
        errors.message = `${text(`MESSAGE_MUST_BE`)} 4000 ${text(`CHARACTERS_OR_LESS`)}.`
    }

    return errors
}

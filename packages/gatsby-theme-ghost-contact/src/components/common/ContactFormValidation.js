// A custom validation function. This must return an object
// which keys are symmetrical to our values/initialValues
export const validate = (values) => {
    const errors = {}
    if (!values.name) {
        errors.name = `Full Name is required.`
    } else if (values.name.length < 3) {
        errors.name = `Full Name must be at least 3 characters long.`
    } else if (values.name.length > 20) {
        errors.name = `Full Name Must be 20 characters or less.`
    }

    if (!values.email) {
        errors.email = `Email is required.`
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = `Invalid email address.`
    }

    if (values.subject === `topic`) {
        errors.subject = `Please select one subject.`
    }

    if (!values.message) {
        errors.message = `A message text is required.`
    } else if (values.message.length < 10) {
        errors.message = `Your message must be at least 10 characters long.`
    } else if (values.message.length > 4000) {
        errors.message = `Your message must be 4000 characters or less.`
    }

    return errors
}

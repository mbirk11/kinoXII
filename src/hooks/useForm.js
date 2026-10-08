import { useCallback, useMemo, useState } from 'react'

// Form state with blur validation and API (422) error mapping
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [serverErrors, setServerErrors] = useState({})

  const errors = useMemo(() => validate(values), [validate, values])
  const isValid = Object.values(errors).every((error) => !error)

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setServerErrors((current) => ({ ...current, [name]: null }))
  }, [])

  const handleChange = (event) => setValue(event.target.name, event.target.value)

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
  }

  const touch = (name) => setTouched((current) => ({ ...current, [name]: true }))

  const touchAll = () =>
    setTouched(Object.fromEntries(Object.keys(initialValues).map((name) => [name, true])))

  // Maps the API's { field: [messages] } shape onto the form
  const applyServerErrors = (apiErrors, fieldMap = {}) => {
    const mapped = {}
    Object.entries(apiErrors).forEach(([field, messages]) => {
      mapped[fieldMap[field] ?? field] = Array.isArray(messages) ? messages[0] : messages
    })
    setServerErrors(mapped)
    touchAll()
  }

  const getError = (name) => serverErrors[name] || (touched[name] ? errors[name] : null)

  const isFieldValid = (name) => Boolean(touched[name] && !getError(name))

  const getFieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: getError(name),
    isValid: isFieldValid(name),
  })

  return {
    values,
    isValid,
    setValue,
    touch,
    touchAll,
    getError,
    getFieldProps,
    applyServerErrors,
  }
}

export default useForm

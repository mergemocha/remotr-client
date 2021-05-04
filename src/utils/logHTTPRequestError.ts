/**
 * Logs errors from an HTTP request selectively based on what exactly went wrong.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export default (err: any): void => {
  console.error('An HTTP request failed. More information to follow.')

  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    const { data, status, headers } = err.response

    console.error('Request succeeded, but response was in error range (4xx-5xx).')
    console.error('Status:', status)
    console.error('Headers:', headers)
    console.error('Data', data)
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js

    console.error('Request was made, but no response was received.')
    console.error('Request data:', err.request)
  } else {
    console.error('A generic error occurred, request could not be constructed.')
    console.error('Error:', err.message)
  }

  console.error('Stack trace:', err.stack)
  console.error('Request configuration:', err.config)
}

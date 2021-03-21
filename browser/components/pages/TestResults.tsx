import { createGlobalStyle } from 'styled-components'
import html from '../../../docs/results/results.md'

const GlobalStyles = createGlobalStyle`
body {
  margin: 20px;
}
  h1 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  h2 {
    font-size: 18px;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 8px;
  }
  a {
    color: blue;
    &:hover {
      text-decoration: underline;
    }
  }

  table {
    th {
      background-color: #f0f0f0;
    }
    th, td {
      border: 1px solid #dbdbdb;
      padding: 5px 10px;
    }
  }
`

function TestResults() {
  return (
    <>
      <GlobalStyles />
      <h1>Test results</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  )
}

export default TestResults

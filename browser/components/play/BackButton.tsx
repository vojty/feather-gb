import { useHistory } from 'react-router'
import styled from 'styled-components'

const Back = styled.div`
  cursor: pointer;
`

export function Backbutton() {
  const history = useHistory()
  return <Back onClick={() => history.goBack()}>←</Back>
}

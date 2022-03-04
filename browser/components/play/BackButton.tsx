import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Back = styled.div`
  cursor: pointer;
`

export function Backbutton() {
  const navigate = useNavigate()
  return <Back onClick={() => navigate(-1)}>←</Back>
}

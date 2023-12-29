import { useRecoilValue, useSetRecoilState } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";


export default function Authpage() {
    const authScreenState = useRecoilValue(authScreenAtom);
    console.log(authScreenAtom);
    // useSetRecoilState(authScreenAtom)
  return (
    <>
        {authScreenState === "login" ? <LoginCard/> : <SignupCard/>}
    </>
  )
}

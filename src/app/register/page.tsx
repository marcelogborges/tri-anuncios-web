import { Suspense } from "react"
import { RegisterForm } from "@/features/register/register-form"

const RegisterPage = () => {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage

import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";

const signInImage = "https://i.pinimg.com/736x/cc/1a/8c/cc1a8c664981e1153a01fb55c2fd8dbc.jpg";

export default function Forgot() {
  return <AuthLayout imageUrl={signInImage} caption="We’ll help you get back into your account.">
    <AuthForm mode="forgot" />
  </AuthLayout>;
}

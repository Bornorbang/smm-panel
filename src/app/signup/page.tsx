import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";

const signUpImage = "https://i.pinimg.com/736x/93/86/f5/9386f512929d0bd27270ff36641c7fc7.jpg";

export default function Signup() {
  return <AuthLayout imageUrl={signUpImage} caption="A simpler place to manage your next campaign.">
    <AuthForm mode="signup" />
  </AuthLayout>;
}

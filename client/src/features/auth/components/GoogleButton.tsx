import { Button } from "@/components/ui/button";
import GoogleIcon from "@/shared/components/icons/GoogleIcon";
export default function GoogleButton() {
  return (
    <Button variant="outline" type="button" className="w-full cursor-pointer">
      <GoogleIcon />
      Google
    </Button>
  );
}

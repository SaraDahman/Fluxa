import { Button } from "@/components/ui/button";
import GitHubIcon from "@/shared/components/icons/GithubIcon";

export default function GithubButton() {
  return (
    <Button variant="outline" type="button" className="w-full cursor-pointer">
      <GitHubIcon />
      GitHub
    </Button>
  );
}

import { Claude } from "@lobehub/icons";
import { LogoutButton } from "./auth/logout";
import { DeleteMessages } from "./delete-messages";

export function Navbar() {
  return (
    <header className="p-4 w-full flex justify-between items-center">
      <div className="flex justify-start items-center gap-x-2">
        <Claude.Color size={30} type={"color"} />
        <Claude.Text size={24} />
      </div>
      <div className="flex gap-x-2 items-center">
        <DeleteMessages />
        <LogoutButton />
      </div>
    </header>
  );
}
